import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getCustomerMe, getUserBookings } from "../utils/api";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-blue-100 shadow-sm ${className}`}>
    {children}
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [customerData, bookingsData] = await Promise.all([
          getCustomerMe(),
          getUserBookings(),
        ]);
        setCustomer(customerData || null);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setCustomer(null);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString();
  };

  const formatMMK = (value) => `MMK ${toNumber(value).toLocaleString()}`;

  const getFlightInfo = (booking) => {
    const snap = booking?.flight_snapshot || {};
    const outbound = snap.outbound || null;
    const inbound = snap.inbound || null;

    const priceMinMMK = snap?.price_estimate_min_mmk || booking.final_price_mmk;
    const priceMaxMMK = snap?.price_estimate_max_mmk || booking.final_price_mmk;

    const estimatePriceMMK =
      priceMinMMK && priceMaxMMK && priceMinMMK !== priceMaxMMK
        ? `${formatMMK(priceMinMMK)} - ${formatMMK(priceMaxMMK)}`
        : formatMMK(priceMaxMMK || priceMinMMK || 0);

    if (outbound || inbound) {
      const outRoute = outbound
        ? `${outbound.origin || "-"} → ${outbound.destination || "-"}`
        : "-";

      const inRoute = inbound
        ? `${inbound.origin || "-"} → ${inbound.destination || "-"}`
        : "-";

      return {
        flightNumber:
          outbound?.flight_number ||
          inbound?.flight_number ||
          snap.flight_number ||
          "-",
        route: outbound && inbound ? `${outRoute} / ${inRoute}` : outRoute,
        departure:
          outbound?.departure_time ||
          inbound?.departure_time ||
          snap.departure_time ||
          "-",
        estimatePriceMMK,
      };
    }

    return {
      flightNumber: snap.flight_number || "-",
      route: snap.route || `${snap.origin || "-"} → ${snap.destination || "-"}`,
      departure: snap.departure_time || "-",
      estimatePriceMMK,
    };
  };

  const stats = useMemo(() => {
    const totalSpentMMK = bookings.reduce(
      (sum, b) => sum + toNumber(b.final_price_mmk),
      0
    );

    const cancelled = bookings.filter(
      (b) => String(b.status || "").toUpperCase() === "CANCELLED"
    ).length;

    const avgMMK = bookings.length ? totalSpentMMK / bookings.length : 0;

    return { totalSpentMMK, cancelled, avgMMK };
  }, [bookings]);

  const getBookingStatusClass = (status) => {
    const s = String(status || "").toUpperCase();

    if (s === "COMPLETED" || s === "CONFIRMED") {
      return "bg-green-50 text-green-700 border border-green-200";
    }

    if (s === "CANCELLED") {
      return "bg-red-50 text-red-600 border border-red-200";
    }

    if (s === "PENDING" || s === "PROCESSING") {
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    }

    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  const getPaymentStatusClass = (status) => {
    const s = String(status || "").toUpperCase();

    if (s === "PAID") {
      return "bg-green-50 text-green-700 border border-green-200";
    }

    if (s === "FAILED") {
      return "bg-red-50 text-red-600 border border-red-200";
    }

    if (s === "PENDING" || s === "UNPAID") {
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    }

    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eaf4ff] flex items-center justify-center">
        <p className="text-sm text-slate-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaf4ff] py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-7">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-slate-600 hover:text-slate-900 text-2xl leading-none"
            aria-label="Back"
          >
            ←
          </Link>

          <Link
            to="/edit-info"
            className="bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-6 py-3 rounded-lg transition"
          >
            Edit info
          </Link>
        </div>

        <Card className="p-7">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {customer?.full_name || customer?.name || "Customer"}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {customer?.email || "-"}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-6"></div>
        </Card>

        <Card className="p-7">
          <h3 className="text-lg font-bold text-slate-700 mb-8">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-28 gap-y-7">
            <div>
              <p className="text-xs text-slate-400 mb-2">Customer ID</p>
              <p className="text-sm text-slate-800 break-all">
                {customer?.id || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-2">Email Address</p>
              <p className="text-sm text-slate-800">
                {customer?.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-2">Phone Number</p>
              <p className="text-sm text-slate-800">
                {customer?.phone || customer?.phone_number || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-2">Registration Date</p>
              <p className="text-sm text-slate-800">
                {formatDate(customer?.created_at)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-7">
          <h3 className="text-lg font-bold text-slate-700 mb-6">
            Booking Statistics
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border border-gray-100 rounded-xl p-4">
            {[
              { label: "Total Bookings", value: bookings.length },
              {
                label: "Total Spent",
                value: `MMK ${stats.totalSpentMMK.toLocaleString()}`,
              },
              { label: "Cancelled", value: stats.cancelled },
              {
                label: "Average Booking",
                value: `MMK ${Math.round(stats.avgMMK).toLocaleString()}`,
              },
            ].map((stat) => (
              <div key={stat.label} className="px-3 py-3">
                <p className="text-xs text-slate-400 mb-3">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 break-all">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-7">
            <h3 className="text-lg font-bold text-slate-700">Recent Bookings</h3>
          </div>

          {bookings.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              No bookings found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[760px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left text-xs text-slate-500 font-semibold py-4 px-5">
                      Booking ID
                    </th>
                    <th className="text-left text-xs text-slate-500 font-semibold py-4 px-5">
                      Flight No.
                    </th>
                    <th className="text-left text-xs text-slate-500 font-semibold py-4 px-5">
                      Route
                    </th>
                    <th className="text-left text-xs text-slate-500 font-semibold py-4 px-5">
                      Departure
                    </th>
                    <th className="text-left text-xs text-slate-500 font-semibold py-4 px-5">
                      Adults
                    </th>
                    <th className="text-left text-xs text-slate-500 font-semibold py-4 px-5">
                      Estimate Price (MMK)
                    </th>
                    <th className="text-left text-xs text-slate-500 font-semibold py-4 px-5">
                      Status
                    </th>
                    <th className="text-left text-xs text-slate-500 font-semibold py-4 px-5">
                      Payment
                    </th>
                    <th className="text-left text-xs text-slate-500 font-semibold py-4 px-5">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {bookings.map((b) => {
                    const f = getFlightInfo(b);

                    return (
                      <tr key={b.booking_id} className="hover:bg-blue-50/50">
                        <td className="py-4 px-5 text-xs text-slate-700 break-all">
                          {b.booking_code || "-"}
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-700">
                          {f.flightNumber}
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-700">
                          {f.route}
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-600 whitespace-nowrap">
                          {formatDateTime(f.departure)}
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-700">
                          {b.adults ?? 1}
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-700">
                          {f.estimatePriceMMK}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${getBookingStatusClass(
                              b.status
                            )}`}
                          >
                            {b.status || "-"}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${getPaymentStatusClass(
                              b.payment_status
                            )}`}
                          >
                            {b.payment_status || "-"}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <button
                            type="button"
                            onClick={() => navigate("/bookings/" + b.booking_id)}
                            className="rounded-md border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}