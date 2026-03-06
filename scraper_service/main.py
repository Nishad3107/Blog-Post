from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
import re
import os
from urllib.parse import quote_plus

app = FastAPI(title="Travel Scraper Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WIKIVOYAGE_BASE = "https://en.wikivoyage.org/wiki/"
WIKIPEDIA_SUMMARY = "https://en.wikipedia.org/api/rest_v1/page/summary/"
USER_AGENT = "TravelBlogScraper/1.0 (+https://example.com)"
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")


def _slugify(location: str) -> str:
    return location.strip().replace(" ", "_")


def _first_paragraph(soup: BeautifulSoup) -> str:
    for p in soup.select(".mw-parser-output > p"):
        text = re.sub(r"\s+", " ", p.get_text(" ", strip=True))
        if len(text) > 80:
            return text
    return ""


def _find_best_time(soup: BeautifulSoup) -> str:
    pattern = re.compile(r"(best time|best season|ideal time|best months|best month)", re.I)
    for p in soup.select(".mw-parser-output > p"):
        text = re.sub(r"\s+", " ", p.get_text(" ", strip=True))
        if pattern.search(text):
            return text
    return "Year-round; check seasonal weather and local festivals."


def _section_items(soup: BeautifulSoup, section_titles, max_items=5):
    titles = {t.lower() for t in section_titles}
    for headline in soup.select("span.mw-headline"):
        if headline.get_text(strip=True).lower() in titles:
            header = headline.find_parent(["h2", "h3", "h4"])  # section header
            if not header:
                continue
            node = header
            while True:
                node = node.find_next_sibling()
                if node is None:
                    break
                if node.name in ["h2", "h3", "h4"]:
                    break
                if node.name in ["ul", "ol"]:
                    items = [
                        re.sub(r"\s+", " ", li.get_text(" ", strip=True))
                        for li in node.select("li")
                    ]
                    items = [i for i in items if i]
                    if items:
                        return items[:max_items]
    return []


def scrape_wikivoyage(location: str):
    slug = _slugify(location)
    url = f"{WIKIVOYAGE_BASE}{slug}"
    try:
        response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=10)
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="Source page unavailable")
    except requests.RequestException:
        raise HTTPException(status_code=502, detail="Failed to fetch source page")

    soup = BeautifulSoup(response.text, "html.parser")

    description = _first_paragraph(soup)
    top_places = _section_items(soup, ["See", "Do", "Attractions"], max_items=6)
    tips = _section_items(
        soup,
        ["Stay safe", "Get in", "Get around", "Stay healthy", "Respect"],
        max_items=6,
    )
    best_time = _find_best_time(soup)

    return {
        "location": location,
        "description": description or f"Travel highlights and practical info for {location}.",
        "top_places": top_places or [],
        "best_time": best_time,
        "tips": tips or [],
        "source": "Wikivoyage",
        "source_url": url,
    }


def scrape_wikipedia_summary(location: str):
    slug = _slugify(location)
    url = f"{WIKIPEDIA_SUMMARY}{slug}"
    try:
        response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=10)
        if response.status_code != 200:
            return {
                "description": "",
                "source": "Wikipedia",
                "source_url": f"https://en.wikipedia.org/wiki/{slug}",
            }
    except requests.RequestException:
        return {
            "description": "",
            "source": "Wikipedia",
            "source_url": f"https://en.wikipedia.org/wiki/{slug}",
        }

    data = response.json()
    return {
        "description": data.get("extract") or "",
        "source": "Wikipedia",
        "source_url": data.get("content_urls", {}).get("desktop", {}).get("page", f"https://en.wikipedia.org/wiki/{slug}"),
    }


def scrape_tripadvisor_top_attractions(location: str, max_items=6):
    search_url = f"https://www.tripadvisor.com/Search?q={quote_plus(location)}"
    try:
        response = requests.get(search_url, headers={"User-Agent": USER_AGENT}, timeout=10)
        if response.status_code != 200:
            return []
    except requests.RequestException:
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    items = []
    for link in soup.select("a[href*='Attraction_Review']"):
        text = re.sub(r"\s+", " ", link.get_text(" ", strip=True))
        if text and text not in items:
            items.append(text)
        if len(items) >= max_items:
            break
    return items


def fetch_unsplash_images(location: str, count=8):
    if not UNSPLASH_ACCESS_KEY:
        return []
    try:
        response = requests.get(
            "https://api.unsplash.com/search/photos",
            headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
            params={"query": location, "per_page": count, "orientation": "landscape"},
            timeout=10,
        )
        if response.status_code != 200:
            return []
    except requests.RequestException:
        return []

    data = response.json()
    results = data.get("results", [])
    return [item.get("urls", {}).get("regular") for item in results if item.get("urls", {}).get("regular")]


def fetch_weather(location: str):
    if not WEATHER_API_KEY:
        return None
    try:
        response = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={"q": location, "appid": WEATHER_API_KEY, "units": "metric"},
            timeout=10,
        )
        if response.status_code != 200:
            return None
    except requests.RequestException:
        return None

    data = response.json()
    weather = data.get("weather", [{}])[0]
    wind = data.get("wind", {})
    return {
        "condition": weather.get("description"),
        "temperature": data.get("main", {}).get("temp"),
        "humidity": data.get("main", {}).get("humidity"),
        "wind": round((wind.get("speed") or 0) * 3.6, 1),
    }


@app.get("/scrape")
def scrape(location: str = Query(..., min_length=2, max_length=80)):
    clean = location.strip()
    if not clean:
        raise HTTPException(status_code=400, detail="location is required")

    wiki_voyage = scrape_wikivoyage(clean)
    wiki_summary = scrape_wikipedia_summary(clean)

    description = wiki_summary.get("description") or wiki_voyage.get("description")

    return {
        "location": clean,
        "description": description,
        "top_places": wiki_voyage.get("top_places", []),
        "best_time": wiki_voyage.get("best_time", ""),
        "tips": wiki_voyage.get("tips", []),
        "sources": [
            {"name": wiki_voyage.get("source"), "url": wiki_voyage.get("source_url")},
            {"name": wiki_summary.get("source"), "url": wiki_summary.get("source_url")},
        ],
    }


@app.get("/travel-info")
def travel_info(location: str = Query(..., min_length=2, max_length=80)):
    clean = location.strip()
    if not clean:
        raise HTTPException(status_code=400, detail="location is required")

    wiki_voyage = scrape_wikivoyage(clean)
    wiki_summary = scrape_wikipedia_summary(clean)
    tripadvisor_places = scrape_tripadvisor_top_attractions(clean)
    images = fetch_unsplash_images(clean)
    weather = fetch_weather(clean)

    description = wiki_summary.get("description") or wiki_voyage.get("description")
    combined_places = []
    for place in (wiki_voyage.get("top_places", []) + tripadvisor_places):
        if place and place not in combined_places:
            combined_places.append(place)

    return {
        "location": clean,
        "intro": description,
        "top_places": combined_places[:8],
        "best_time": wiki_voyage.get("best_time", ""),
        "tips": wiki_voyage.get("tips", []),
        "images": images,
        "weather": weather,
        "sources": [
            {"name": wiki_voyage.get("source"), "url": wiki_voyage.get("source_url")},
            {"name": wiki_summary.get("source"), "url": wiki_summary.get("source_url")},
            {"name": "TripAdvisor", "url": f"https://www.tripadvisor.com/Search?q={quote_plus(clean)}"},
            {"name": "Unsplash", "url": "https://unsplash.com"},
            {"name": "OpenWeather", "url": "https://openweathermap.org"},
        ],
    }
