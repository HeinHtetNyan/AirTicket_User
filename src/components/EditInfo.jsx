import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCustomerMe, updateCustomerMe } from "../utils/api";
import Notification from "../components/Notification";
import { FaUser, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

function splitFullName(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function EditInfo() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ✅ NEW notification state
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customer = await getCustomerMe();
        const { firstName, lastName } = splitFullName(customer?.full_name);

        setFormData({
          firstName,
          lastName,
          email: customer?.email || "",
          phone: customer?.phone || "",
        });
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    const full_name = [formData.firstName, formData.lastName]
      .map((value) => value.trim())
      .filter(Boolean)
      .join(" ");

    try {
      await updateCustomerMe({
        full_name,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });

      // ✅ SUCCESS NOTIFICATION
      setNotification({
        type: "success",
        message: "Profile updated successfully.",
      });

      // delay navigation so user can see toast
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      // ❌ ERROR NOTIFICATION
      setNotification({
        type: "error",
        message:
          err?.response?.data?.message ||
          err.message ||
          "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Notification */}
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ type: "", message: "" })}
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="mt-2 text-gray-600">
            Update your personal information and preferences
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FaUser size={16} />
                </div>
                Personal Information
              </h2>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="John"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhoneAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <Link
                to="/profile"
                className="flex-1 border-2 border-gray-300 text-gray-900 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-center"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditInfo;