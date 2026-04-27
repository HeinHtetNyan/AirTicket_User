import FlightCard from "./FlightCard";

const ResultsSection = ({
  pageTitle,
  previousFlight,
  showSelectedPreviousFlight,
  onSelectFlight,
  flights = [],
  loading = false,
  error = "",
  onRetry,
}) => {
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

  return (
    <section className="bg-[#eef4fb] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">{pageTitle}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="space-y-3 sticky top-24">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-blue-700 mb-2">
                  Message us
                </h3>
                <p className="text-xs text-slate-400">For more information</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-blue-700 mb-2">
                  Call us
                </h3>
                <p className="text-xs text-slate-400">For more information</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {showSelectedPreviousFlight && previousFlight && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="font-semibold text-slate-800 mb-2">
                  Selected flight:
                </p>

                {previousFlight.type === "ROUND_TRIP" ? (
                  <>
                    <p className="text-slate-700">
                      {previousFlight.flight_snapshot?.outbound?.airline} •{" "}
                      {previousFlight.flight_snapshot?.outbound?.flight_number}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatTime(
                        previousFlight.flight_snapshot?.outbound?.departure_time
                      )}{" "}
                      –{" "}
                      {formatTime(
                        previousFlight.flight_snapshot?.outbound?.arrival_time
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-slate-700">
                      {previousFlight.flight_snapshot?.airline} •{" "}
                      {previousFlight.flight_snapshot?.flight_number}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatTime(previousFlight.flight_snapshot?.departure_time)}{" "}
                      –{" "}
                      {formatTime(previousFlight.flight_snapshot?.arrival_time)}
                    </p>
                  </>
                )}
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-slate-500">
                Loading flights...
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <p className="text-red-700 mb-4">{error}</p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            {!loading && !error && flights.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-slate-500">
                No flights found.
              </div>
            )}

            {!loading &&
              !error &&
              flights.map((flight) => (
                <FlightCard
                  key={flight.bundle_key}
                  flight={flight}
                  onSelect={onSelectFlight}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;