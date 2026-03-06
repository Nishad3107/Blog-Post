import os
import time
import re
from typing import List, Dict, Any

import requests
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE = os.getenv("SUPABASE_SERVICE_ROLE", "")
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX = 30
_rate_cache: Dict[str, List[float]] = {}

app = FastAPI(title="Travel Info Scraper", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _rate_limit(ip: str) -> None:
    now = time.time()
    timestamps = [t for t in _rate_cache.get(ip, []) if now - t < RATE_LIMIT_WINDOW]
    if len(timestamps) >= RATE_LIMIT_MAX:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    timestamps.append(now)
    _rate_cache[ip] = timestamps


def _supabase_headers() -> Dict[str, str]:
    return {
        "apikey": SUPABASE_SERVICE_ROLE,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE}",
        "Content-Type": "application/json",
    }


def _supabase_available() -> bool:
    return bool(SUPABASE_URL and SUPABASE_SERVICE_ROLE)


def _normalize_location(location: str) -> str:
    return re.sub(r"\s+", " ", location.strip())


def fetch_wikipedia_intro(location: str) -> str:
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{requests.utils.quote(location)}"
    resp = requests.get(url, timeout=8)
    if resp.ok:
        data = resp.json()
        return data.get("extract", "")
    return ""


def fetch_wikivoyage(location: str) -> Dict[str, List[str]]:
    url = f"https://en.wikivoyage.org/wiki/{requests.utils.quote(location)}"
    resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
    if not resp.ok:
        return {"top_places": [], "travel_tips": []}

    soup = BeautifulSoup(resp.text, "html.parser")
    sections = {"See": [], "Do": [], "Eat": [], "Drink": [], "Sleep": []}
    current = None

    for header in soup.select("span.mw-headline"):
        title = header.get_text(strip=True)
        if title in sections:
            current = title
            items = []
            for sibling in header.parent.find_next_siblings():
                if sibling.name and sibling.find("span", class_="mw-headline"):
                    break
                if sibling.name == "ul":
                    for li in sibling.find_all("li", recursive=False):
                        text = li.get_text(" ", strip=True)
                        if text:
                            items.append(text)
                if len(items) >= 5:
                    break
            sections[title] = items

    top_places = (sections.get("See") or [])[:3] + (sections.get("Do") or [])[:2]
    travel_tips = (sections.get("Eat") or [])[:2] + (sections.get("Sleep") or [])[:2]

    return {
        "top_places": [t for t in top_places if t][:5],
        "travel_tips": [t for t in travel_tips if t][:5],
    }


def fetch_tripadvisor(location: str) -> List[str]:
    query = requests.utils.quote(f"Top attractions in {location}")
    url = f"https://www.tripadvisor.com/Search?q={query}"
    try:
        resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        if not resp.ok:
            return []
        soup = BeautifulSoup(resp.text, "html.parser")
        results = []
        for a in soup.select("a[href*='Attraction_Review']"):
            text = a.get_text(strip=True)
            if text and text not in results:
                results.append(text)
            if len(results) >= 5:
                break
        return results[:5]
    except Exception:
        return []


def fetch_unsplash_images(location: str) -> Dict[str, Any]:
    if not UNSPLASH_ACCESS_KEY:
        return {"hero": "", "gallery": []}
    url = "https://api.unsplash.com/search/photos"
    resp = requests.get(
        url,
        params={"query": location, "per_page": 6, "orientation": "landscape"},
        headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
        timeout=8,
    )
    if not resp.ok:
        return {"hero": "", "gallery": []}
    data = resp.json().get("results", [])
    gallery = [img["urls"]["regular"] for img in data if img.get("urls")]
    hero = gallery[0] if gallery else ""
    return {"hero": hero, "gallery": gallery}


def fetch_weather(location: str) -> Dict[str, Any]:
    if not OPENWEATHER_API_KEY:
        return {"temperature": "--", "condition": "Unavailable", "humidity": "--"}
    url = "https://api.openweathermap.org/data/2.5/weather"
    resp = requests.get(
        url,
        params={"q": location, "appid": OPENWEATHER_API_KEY, "units": "metric"},
        timeout=8,
    )
    if not resp.ok:
        return {"temperature": "--", "condition": "Unavailable", "humidity": "--"}
    data = resp.json()
    return {
        "temperature": data.get("main", {}).get("temp"),
        "condition": (data.get("weather") or [{}])[0].get("main", ""),
        "humidity": data.get("main", {}).get("humidity"),
    }


def get_cached(location: str) -> Dict[str, Any] | None:
    if not _supabase_available():
        return None
    url = f"{SUPABASE_URL}/rest/v1/travel_info?location=eq.{requests.utils.quote(location)}"
    resp = requests.get(url, headers=_supabase_headers(), timeout=8)
    if not resp.ok:
        return None
    data = resp.json()
    return data[0] if data else None


def upsert_cache(payload: Dict[str, Any]) -> None:
    if not _supabase_available():
        return
    url = f"{SUPABASE_URL}/rest/v1/travel_info"
    requests.post(
        url,
        headers={**_supabase_headers(), "Prefer": "resolution=merge-duplicates"},
        json=payload,
        timeout=8,
    )


@app.get("/travel-info")
def travel_info(request: Request, location: str = Query(..., min_length=2)):
    _rate_limit(request.client.host)
    location_key = _normalize_location(location)

    cached = get_cached(location_key)
    if cached:
        return {
            "location": cached.get("location"),
            "intro": cached.get("intro"),
            "top_places": cached.get("top_places") or [],
            "travel_tips": cached.get("tips") or [],
            "attractions": cached.get("attractions") or [],
            "images": cached.get("images") or [],
            "weather": cached.get("weather") or {},
        }

    intro = fetch_wikipedia_intro(location_key)
    voyage = fetch_wikivoyage(location_key)
    attractions = fetch_tripadvisor(location_key)
    unsplash = fetch_unsplash_images(location_key)
    weather = fetch_weather(location_key)

    response = {
        "location": location_key,
        "intro": intro,
        "top_places": voyage.get("top_places", []),
        "travel_tips": voyage.get("travel_tips", []),
        "attractions": attractions,
        "images": unsplash.get("gallery", []),
        "weather": weather,
    }

    upsert_cache({
        "location": location_key,
        "intro": response["intro"],
        "top_places": response["top_places"],
        "tips": response["travel_tips"],
        "attractions": response["attractions"],
        "images": response["images"],
        "weather": response["weather"],
    })

    return response
