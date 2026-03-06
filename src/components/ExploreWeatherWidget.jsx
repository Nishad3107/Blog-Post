export default function ExploreWeatherWidget({ weather }) {
  if (!weather) {
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
        <div>
          <p className="text-4xl font-bold font-heading">{Math.round(weather.temperature)}°C</p>
          <p className="text-white/80 font-body capitalize">{weather.condition}</p>
        </div>
        <div className="text-right space-y-2">
          <p className="font-body">Humidity: {weather.humidity ?? '--'}%</p>
        </div>
      </div>
    </div>
  );
}
