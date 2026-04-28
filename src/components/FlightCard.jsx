import { FaPlane } from "react-icons/fa";

const FlightCard = ({ flight, onSelect }) => {
  const snapshot = flight?.flight_snapshot;
  const isRoundTrip = flight?.type === "ROUND_TRIP";

  const flightData =
    isRoundTrip && snapshot?.outbound ? snapshot.outbound : snapshot;

  const priceMin = snapshot?.price_estimate_min_mmk || flight?.final_price_mmk;
  const priceMax = snapshot?.price_estimate_max_mmk || flight?.final_price_mmk;

  const formetMMK = (value) => {
    if (!value) return "0 MMK";
    return `MMK ${Number(value).toLocaleString()}`;
  };

  const priceDisplay =
    priceMin && priceMax && priceMin !== priceMax
      ? `${formetMMK(priceMin)} - ${formetMMK(priceMax)}`
      : formetMMK(priceMax || priceMin || flight?.final_price_mmk || 0);

  const formatTime = (iso) => {
    if (!iso) return "--:--";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "--:--";
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const airline = flightData?.airline || "Unknown Airline";
  const airlineCode = flightData?.airline_code || "XX";
  const flightNumber = flightData?.flight_number || "-";
  const departureTime = formatTime(flightData?.departure_time);
  const arrivalTime = formatTime(flightData?.arrival_time);
  const duration = flightData?.duration_minutes
    ? `${Math.floor(flightData.duration_minutes / 60)}h ${flightData.duration_minutes % 60}m`
    : "-";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <FaPlane className="text-lg" />
        </div>

        <div className="min-w-0">
          <p className="text-slate-800 font-semibold truncate">{airline}</p>
          <p className="text-sm text-slate-400">
            {airlineCode}-{flightNumber}
          </p>
        </div>

        <div className="md:ml-6 min-w-[110px]">
          <p className="text-slate-800 font-medium">
            {departureTime} - {arrivalTime}
          </p>
          <p className="text-sm text-slate-400">{duration}</p>
        </div>

        <div className="flex flex-wrap gap-2 md:ml-4">
          <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium">
            {isRoundTrip ? "Round Trip" : "One Way"}
          </span>
          <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium">
            Economy
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 shrink-0">
        <p className="text-base md:text-lg font-semibold text-slate-700 whitespace-nowrap">
          {priceDisplay}
        </p>

        <button
          onClick={() => onSelect(flight)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default FlightCard;