import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getWeather, getWeatherIcon } from '../services/weather';
import DestinationInfo from '../components/DestinationInfo';
import { resolveImages, resolveSingleImage } from '../utils/imageFallback';
import { buildExploreData } from '../utils/exploreApi';
import BlogGallery from '../components/BlogGallery';
import { useTrip, useTrips } from '../hooks/useTrips';
import { useWishlist } from '../hooks/useWishlist';
import ChatbotWidget from '../components/ChatbotWidget';
import Toast from '../components/Toast';
import { setMeta } from '../utils/seo';

const tripsData = {
  1: {
    id: 1,
    title: 'Bali, Indonesia',
    location: 'Bali, Indonesia',
    date: 'March 15-22, 2026',
    region: 'Southeast Asia',
    season: 'Spring',
    budget: 'Mid',
    tags: ['Beaches', 'Culture', 'Wellness'],
    heroImage: '🌴',
    description: 'Tropical paradise with stunning beaches, ancient temples, and lush rice terraces. Experience the magic of island life.',
    story: `My journey to Bali was nothing short of magical. From the moment I stepped off the plane, I was greeted by the warm tropical air and the friendly smiles of the locals.

The first stop was Ubud, the cultural heart of Bali. I spent days exploring the ancient temples, walking through the famous rice terraces of Tegallalang, and immersing myself in the local art scene. The Monkey Forest in Ubud was both terrifying and hilarious - those cheeky primates know how to steal snacks!

Next, I headed to Canggu for some surfing. As a beginner, the waves were challenging but the instructors were patient and encouraging. The sunset beach clubs here are legendary - imagine sipping a cocktail while watching the sun dip below the horizon.

No trip to Bali is complete without visiting the sacred temples. Uluwatu at sunset was breathtaking, with the Kecak fire dance telling ancient stories against the backdrop of the Indian Ocean. The temples of Tanah Lot offered a different kind of beauty, especially during high tide when the waves crash against the rock formation.

The food scene in Bali surprised me at every turn. From street food stalls serving delicious nasi campur to high-end restaurants in Seminyak, every meal was an adventure. Don't forget to try the local coffee - Luwak coffee is an experience!

As I left Bali, I knew this wasn't goodbye but just a see you later. There's still so much more to explore - the eastern temples, the volcanic treks, the hidden waterfalls. Bali has a way of calling you back.`,
    gallery: ['🏖️', '🏝️', '🌅', '🛕', '🌾', '🐒'],
    coordinates: { lat: -8.4095, lng: 115.1889 },
    itinerary: [
      { day: 'Day 1', plan: 'Arrive in Ubud, sunset walk through rice terraces.' },
      { day: 'Day 2', plan: 'Temple visits + cultural markets.' },
      { day: 'Day 3', plan: 'Waterfall hike and cafe hopping.' },
      { day: 'Day 4', plan: 'Beach day in Canggu and surf lesson.' },
    ],
    checklist: ['Light rain jacket', 'Reef-safe sunscreen', 'Comfortable sandals', 'Cash for markets'],
  },
  2: {
    id: 2,
    title: 'Santorini, Greece',
    location: 'Santorini, Greece',
    date: 'April 5-12, 2026',
    region: 'Europe',
    season: 'Summer',
    budget: 'Mid',
    tags: ['Beaches', 'Romance', 'Food'],
    heroImage: '🏝️',
    description: 'White-washed buildings, crystal-clear waters, and world-famous sunsets.',
    story: `Santorini exceeded every expectation I had. This crescent-shaped island in the Aegean Sea is a masterpiece of natural beauty and human craftsmanship.

My stay in Oia provided the classic Santorini experience - blue-domed churches, winding cobblestone streets, and those iconic white-washed buildings cascading down the caldera edge. The famous sunset views from Oia castle are worth the crowds if you find a spot early.

Fira, the capital, offered a more lively atmosphere with its restaurants, bars, and nightlife. The hike between Fira and Oia along the caldera rim was challenging in the Greek heat but absolutely spectacular. You'll pass through small villages and have countless photo opportunities.

The beaches of Santorini are unique - Red Beach with its dramatic red volcanic cliffs, White Beach with its white pebble shores, and the black sand beaches of Perissa. Each has its own character.

A boat tour of the caldera is essential. Swimming in the hot springs, visiting the volcanic islands, and watching the sun set from the water creates memories that last a lifetime. The local wines, grown in volcanic soil, pair perfectly with fresh seafood.

Santorini taught me to slow down, savor each moment, and appreciate the simple beauty of watching the sun paint the sky in shades of orange and pink.`,
    gallery: ['🌅', '🏛️', '🛥️', '🏖️', '🍷', '🌺'],
    coordinates: { lat: 36.3932, lng: 25.4615 },
    itinerary: [
      { day: 'Day 1', plan: 'Check-in Oia, sunset viewpoint.' },
      { day: 'Day 2', plan: 'Caldera hike + winery tasting.' },
      { day: 'Day 3', plan: 'Boat tour and hot springs.' },
      { day: 'Day 4', plan: 'Beach day at Perissa.' },
    ],
    checklist: ['Light layers', 'Walking shoes', 'Sunhat', 'Camera'],
  },
  3: {
    id: 3,
    title: 'Kyoto, Japan',
    location: 'Kyoto, Japan',
    date: 'May 1-10, 2026',
    region: 'East Asia',
    season: 'Autumn',
    budget: 'Mid',
    tags: ['Culture', 'City', 'Food'],
    heroImage: '🗾',
    description: 'Ancient temples, traditional gardens, and authentic Japanese culture.',
    story: `Kyoto is a city where ancient traditions coexist seamlessly with modern life. Spending ten days here felt like stepping through time.

The temples are the heart of Kyoto. Kinkaku-ji, the Golden Pavilion, reflecting in its pond on a misty morning is an image I'll never forget. Fushimi Inari with its thousands of vermillion torii gates creates a tunnel that seems to lead to another world.

Arashiyama's bamboo grove was otherworldly - walking through towering bamboo stalks with sunlight filtering through creates a sense of peace that's hard to describe. The nearby monkey park offers both adorable inhabitants and panoramic city views.

Traditional ryokans (inn) provided an authentic experience - sleeping on futons, soaking in ofuro (bath), and enjoying kaiseki (multi-course) dinners. The attention to detail in Japanese hospitality is remarkable.

Exploring Gion, the geisha district, at dusk felt like entering another era. While you may spot a maiko (apprentice geisha), the preserved wooden machiya houses and lanterns create atmosphere regardless.

Kyoto's food scene is exceptional. From conveyor belt sushi to Michelin-starred kaiseki restaurants, from matcha everything to tender wagyu beef, every meal was a highlight. The Nishiki Market is a food lover's paradise.

Cherry blossom season was ending when I visited, but the late-blooming varieties still graced the gardens. Even without blossoms, the Japanese approach to garden design - every view is composed, every season has beauty - is inspiring.`,
    gallery: ['⛩️', '🎎', '🍵', '🌸', '🏯', '🎋'],
    coordinates: { lat: 35.0116, lng: 135.7681 },
    itinerary: [
      { day: 'Day 1', plan: 'Gion evening walk and shrine visit.' },
      { day: 'Day 2', plan: 'Fushimi Inari early morning hike.' },
      { day: 'Day 3', plan: 'Arashiyama bamboo grove + river stroll.' },
      { day: 'Day 4', plan: 'Temple circuit and tea ceremony.' },
    ],
    checklist: ['Comfortable walking shoes', 'Transit card', 'Reusable water bottle', 'Light jacket'],
  },
  4: {
    id: 4,
    title: 'Reykjavik, Iceland',
    location: 'Reykjavik, Iceland',
    date: 'June 20-28, 2026',
    region: 'Europe',
    season: 'Winter',
    budget: 'High',
    tags: ['Nature', 'Adventure', 'Hiking'],
    heroImage: '❄️',
    description: 'Northern lights, dramatic landscapes, and geothermal wonders.',
    story: `Iceland is a land of extremes - fire and ice, light and dark, rugged wilderness and modern comfort. Reykjavik served as the perfect base for exploration.

The Golden Circle route introduced me to Iceland's geological wonders: Thingvellir National Park where tectonic plates drift apart, the powerful Gullfoss waterfall, and the geothermal area of Geysir. Watching Strokkur erupt every few minutes never got old.

Beyond the tourist routes lie Iceland's true treasures. The black sand beaches of Vik, the basalt columns of Reynisfjara, the glacial lagoons where icebergs float like sculptures - each stop was more impressive than the last.

Northern lights hunting became an evening ritual. After several cloudy nights, the aurora finally appeared - dancing ribbons of green and purple across the sky. A bucket-list moment fulfilled.

Iceland's geology is active everywhere. Soaking in the geothermal pools of the Blue Lagoon felt like bathing in liquid sky. The Myvatn Nature Baths in the north offered a more remote, equally magical experience.

The Icelandic horse, with its distinctive fluffy coat and tölt gait, stole my heart. Riding through lava fields on these gentle creatures connected me to the landscape in a unique way.

Iceland taught me humility before nature's power and beauty. It's a place that demands respect but rewards those who venture here with experiences that transform.`,
    gallery: ['🌌', '🏔️', '♨️', '🧊', '🐴', '🌋'],
    coordinates: { lat: 64.1466, lng: -21.9426 },
    itinerary: [
      { day: 'Day 1', plan: 'Reykjavik city walk + local cuisine.' },
      { day: 'Day 2', plan: 'Golden Circle tour.' },
      { day: 'Day 3', plan: 'South coast waterfalls.' },
      { day: 'Day 4', plan: 'Blue Lagoon + northern lights hunt.' },
    ],
    checklist: ['Thermal layers', 'Waterproof jacket', 'Gloves', 'Power bank'],
  },
  5: {
    id: 5,
    title: 'Road Trip Through Switzerland',
    location: 'Switzerland',
    date: 'July 8-16, 2026',
    region: 'Europe',
    season: 'Summer',
    budget: 'High',
    tags: ['Mountains', 'Road Trip', 'Nature'],
    heroImage: '🏔️',
    description: 'Snow-capped passes, alpine lakes, and cinematic mountain drives across Switzerland.',
    story: `Switzerland is a dream for road trips: immaculate roads, postcard villages, and viewpoints at every turn.

I started in Lucerne and followed the lakeside routes to Interlaken, stopping for short hikes and panoramic train rides. The turquoise waters of Lake Brienz and Lake Thun are even more vivid in person.

From there, the drive to Grindelwald and Lauterbrunnen is pure magic. Waterfalls cut through the valley walls, and every cable car brings you to a different kind of alpine calm. The Eiger views from Kleine Scheidegg were the highlight of the week.

I saved the high passes for the final days: Furka and Grimsel. Hairpin roads, glacier views, and small mountain inns made it feel like a slow, cinematic escape.`,
    gallery: ['🏔️', '🚗', '🌲', '🏞️', '⛰️', '🧀'],
    coordinates: { lat: 46.8182, lng: 8.2275 },
    itinerary: [
      { day: 'Day 1', plan: 'Lucerne lakefront + old town.' },
      { day: 'Day 2', plan: 'Interlaken and lake cruise.' },
      { day: 'Day 3', plan: 'Grindelwald and alpine hike.' },
      { day: 'Day 4', plan: 'Furka + Grimsel passes.' },
    ],
    checklist: ['Light jacket', 'Daypack', 'Swiss travel pass', 'Hiking shoes'],
  },
  6: {
    id: 6,
    title: 'Desert Nights in Morocco',
    location: 'Morocco',
    date: 'August 2-10, 2026',
    region: 'North Africa',
    season: 'Autumn',
    budget: 'Mid',
    tags: ['Desert', 'Culture', 'Food'],
    heroImage: '🏜️',
    description: 'Golden dunes, ancient medinas, and starlit nights in the Sahara.',
    story: `Morocco is a sensory journey: the scent of spices, the call to prayer at dusk, and the rhythm of the souks.

I began in Marrakech, wandering through the maze of the medina and tasting fresh mint tea at a rooftop cafe. The city feels alive at every hour.

From there, I headed toward the Sahara via the Atlas Mountains. The landscapes change fast: winding passes, kasbahs, and then open desert. A camel trek into the dunes at sunset is unforgettable.

At night, the desert is perfectly still. We sat by the fire under a sky full of stars, sharing stories with local guides. It’s a kind of quiet that stays with you.`,
    gallery: ['🏜️', '🐪', '🌅', '🕌', '✨', '🥘'],
    coordinates: { lat: 31.7917, lng: -7.0926 },
    itinerary: [
      { day: 'Day 1', plan: 'Marrakech medina + rooftop sunset.' },
      { day: 'Day 2', plan: 'Atlas Mountains drive.' },
      { day: 'Day 3', plan: 'Sahara dunes and camel trek.' },
      { day: 'Day 4', plan: 'Desert camp night under stars.' },
    ],
    checklist: ['Scarf for sand', 'Sunscreen', 'Light layers', 'Comfortable sandals'],
  },
};

function WeatherWidget({ coordinates }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      if (!coordinates) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await getWeather(coordinates.lat, coordinates.lng);
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [coordinates]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-soft-mint">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-accent-green border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-soft-mint">
        <p className="text-dark-green font-body text-center">Weather data unavailable</p>
      </div>
    );
  }

  if (!coordinates) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-soft-mint">
        <p className="text-dark-green font-body text-center">Weather data unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sky-400 to-ocean-500 rounded-2xl shadow-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4 font-heading">Current Weather</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {weather?.icon && (
            <img 
              src={getWeatherIcon(weather.icon)} 
              alt={weather.condition}
              className="w-16 h-16"
            />
          )}
          <div>
            <p className="text-4xl font-bold font-heading">{weather?.temperature}°C</p>
            <p className="text-white/80 font-body capitalize">{weather?.description}</p>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="flex items-center gap-2 justify-end">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="font-body">Humidity: {weather?.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-body">Feels like: {weather?.feelsLike}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TripDetails() {
  const { id } = useParams();
  const { trip: dbTrip, loading: dbLoading } = useTrip(id);
  const { trips: allTrips } = useTrips();
  const wishlist = useWishlist();
  const trip = tripsData[id] || dbTrip;
  const [travelInfo, setTravelInfo] = useState(null);
  const [infoLoading, setInfoLoading] = useState(true);
  const [infoError, setInfoError] = useState(null);
  const [copyNotice, setCopyNotice] = useState('');
  const heroImage = trip
    ? resolveSingleImage(trip.location, travelInfo?.images?.[0] || trip.image_url || trip.image)
    : null;
  const storyText =
    trip?.story ||
    trip?.content ||
    (trip?.description ? `${trip.description} This journey highlights the key moments, local culture, and must-see experiences.` : '');
  const storyParagraphs = storyText
    ? storyText.split('\n\n')
    : [
        `Discover the highlights of ${trip?.location || 'this destination'} and plan your own memorable trip.`,
      ];
  const dateText = trip?.date || (trip?.created_at ? new Date(trip.created_at).toLocaleDateString() : 'Flexible dates');
  const relatedTrips = allTrips
    .filter((t) => t.id !== trip?.id)
    .filter((t) => {
      if (!trip) return false;
      const tagMatch = Array.isArray(trip.tags) && Array.isArray(t.tags)
        ? t.tags.some((tag) => trip.tags.includes(tag))
        : false;
      const regionMatch = trip.region && t.region && trip.region === t.region;
      return tagMatch || regionMatch;
    })
    .slice(0, 3);
  const chatContext = trip
    ? [
        `Location: ${trip.location}`,
        `Title: ${trip.title}`,
        trip.description ? `Summary: ${trip.description}` : '',
        Array.isArray(trip.tags) ? `Tags: ${trip.tags.join(', ')}` : '',
        travelInfo?.topPlaces?.length ? `Top places: ${travelInfo.topPlaces.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  useEffect(() => {
    if (!trip) return;
    setMeta({
      title: `${trip.title} | TravelBlog`,
      description: trip.description,
      image: trip.image_url || heroImage,
      url: window.location.href,
    });
  }, [trip, heroImage]);

  useEffect(() => {
    if (!trip?.location) return;

    let isMounted = true;

    async function loadTravelInfo() {
      setInfoLoading(true);
      setInfoError(null);
      const locationKey = trip.location;

      const sample = {
        location: locationKey,
        intro: `${locationKey} is a destination known for its unique culture, landscapes, and unforgettable experiences.`,
        top_places: ['Old Town', 'Waterfront', 'Scenic Overlook'],
        travel_tips: ['Start early to beat crowds', 'Carry water and sunscreen'],
        attractions: ['City viewpoint', 'Local market', 'Historic landmark'],
        weather: { temperature: '--', condition: 'Unavailable', humidity: '--' },
        images: [],
      };

      try {
        const payload = await buildExploreData(locationKey);
        const resolved = await resolveImages(locationKey, payload.images || []);
        if (isMounted) {
          setTravelInfo({
            location: payload.location || locationKey,
            intro: payload.intro || sample.intro,
            top_places: payload.topPlaces || sample.top_places,
            travel_tips: sample.travel_tips,
            attractions: sample.attractions,
            images: resolved.gallery,
            weather: payload.weather || sample.weather,
          });
        }
      } catch (err) {
        if (!isMounted) return;
        const resolved = await resolveImages(locationKey, []);
        setTravelInfo({ ...sample, images: resolved.gallery });
        setInfoError(err?.message || 'Failed to load travel info');
      } finally {
        if (isMounted) setInfoLoading(false);
      }
    }

    loadTravelInfo();

    return () => {
      isMounted = false;
    };
  }, [trip?.location]);

  if (dbLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
          <div className="h-64 rounded-3xl bg-white/60 border-2 border-soft-mint animate-pulse" />
          <div className="h-10 w-1/2 bg-white/60 border-2 border-soft-mint rounded-full animate-pulse" />
          <div className="h-40 bg-white/60 border-2 border-soft-mint rounded-2xl animate-pulse" />
        </div>
      </Layout>
    );
  }

  if (!trip) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-dark mb-4">Trip Not Found</h1>
            <p className="text-dark-green">The trip you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-background-mint">
        <div className="relative h-[400px] md:h-[500px] bg-gradient-to-r from-primary-dark to-dark-green flex items-center justify-center overflow-hidden">
          {heroImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/70 to-dark-green/60" />
          {!heroImage && (
            <div className="absolute inset-0 flex items-center justify-center text-[150px] md:text-[200px] opacity-30">
              {trip.heroImage || '🌍'}
            </div>
          )}
          <div className="relative text-center text-white px-4 z-10">
            <h1 className="font-hero text-4xl md:text-6xl mb-4">{trip.title}</h1>
            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={() => wishlist.toggle(trip)}
                className="bg-white/90 text-primary-dark text-xs sm:text-sm font-medium px-3 py-1 rounded-full font-body hover:bg-white transition"
              >
                {wishlist.isSaved(trip.id) ? 'Saved' : 'Save'}
              </button>
              <a
                href="/wishlist"
                className="ml-3 bg-white/10 text-white text-xs sm:text-sm font-medium px-3 py-1 rounded-full font-body hover:bg-white/20 transition"
              >
                Wishlist
              </a>
              <button
                type="button"
                onClick={async () => {
                  const shareUrl = window.location.href;
                  if (navigator.share) {
                    await navigator.share({ title: trip.title, url: shareUrl });
                  } else {
                    await navigator.clipboard.writeText(shareUrl);
                    setCopyNotice('Link copied');
                  }
                }}
                className="ml-3 bg-white/10 text-white text-xs sm:text-sm font-medium px-3 py-1 rounded-full font-body hover:bg-white/20 transition"
              >
                Share
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-light-green">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {trip.location}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {dateText}
              </span>
              {trip.region && (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                  {trip.region}
                </span>
              )}
              {trip.season && (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m10-10H2" />
                  </svg>
                  {trip.season}
                </span>
              )}
              {trip.budget && (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.12-3 2.5S10.343 13 12 13s3 1.12 3 2.5S13.657 18 12 18m0-10V6m0 12v-2" />
                  </svg>
                  {trip.budget}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-soft-mint">
            <p className="text-xl text-dark-green italic mb-8 leading-relaxed font-body">
              "{trip.description}"
            </p>
            {Array.isArray(trip.tags) && trip.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {trip.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-background-mint text-primary-dark text-xs font-body">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              {storyParagraphs.map((paragraph, index) => (
                <p key={index} className="text-dark-green mb-6 leading-relaxed font-body">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-soft-mint">
              <h3 className="font-heading text-xl text-primary-dark mb-3">Itinerary</h3>
              <ul className="space-y-3">
                {(trip.itinerary || []).map((item, index) => (
                  <li key={index} className="text-dark-green font-body">
                    <span className="font-semibold">{item.day}:</span> {item.plan}
                  </li>
                ))}
              </ul>
              {!trip.itinerary && (
                <p className="text-dark-green font-body">Plan a flexible route based on your interests.</p>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-soft-mint">
              <h3 className="font-heading text-xl text-primary-dark mb-3">Travel Checklist</h3>
              <ul className="space-y-2">
                {(trip.checklist || []).map((item, index) => (
                  <li key={index} className="text-dark-green font-body">• {item}</li>
                ))}
              </ul>
              {!trip.checklist && (
                <p className="text-dark-green font-body">Pack light layers, comfortable shoes, and essentials.</p>
              )}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-primary-dark mb-6 text-center">
              Travel Info From the Web
            </h2>
            <DestinationInfo info={travelInfo} loading={infoLoading} error={infoError} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-primary-dark mb-8 text-center">Location</h2>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-soft-mint">
                <div className="h-[300px]">
                  {trip.coordinates ? (
                    <iframe
                      title="Map"
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${trip.coordinates.lat},${trip.coordinates.lng}&z=6&output=embed`}
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-soft-mint to-light-green flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🗺️</div>
                        <p className="text-dark-green font-medium font-body">{trip.location}</p>
                        <p className="text-sm text-gray-500 mt-4 font-body">
                          Location coordinates not available.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-primary-dark mb-8 text-center">Weather</h2>
              <WeatherWidget coordinates={trip.coordinates} />
            </div>
          </div>

          {relatedTrips.length > 0 && (
            <div className="mb-6">
              <h2 className="font-heading text-3xl font-bold text-primary-dark mb-6 text-center">
                Related Trips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedTrips.map((rt) => (
                  <a
                    key={rt.id}
                    href={`/trip/${rt.id}`}
                    className="bg-white rounded-2xl shadow-lg border-2 border-soft-mint overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                  >
                    <img
                      src={rt.image_url || rt.image}
                      alt={rt.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/fallback-images/placeholder.svg';
                      }}
                    />
                    <div className="p-4">
                      <p className="text-xs text-accent-green font-body uppercase tracking-[0.2em]">{rt.location}</p>
                      <h3 className="font-heading text-lg text-primary-dark mt-2">{rt.title}</h3>
                      <p className="text-sm text-dark-green font-body mt-2 line-clamp-2">{rt.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast message={copyNotice} duration={3000} onClose={() => setCopyNotice('')} />
      <ChatbotWidget context={chatContext} />
    </Layout>
  );
}
