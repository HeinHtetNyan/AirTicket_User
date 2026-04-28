import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCustomerMe, updateCustomerMe } from "../utils/api";
import Notification from "../components/Notification";

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
      <div className="max-w-4xl mx-auto p-8 text-sm text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* ✅ Notification */}
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: "", message: "" })}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
        <p className="text-sm text-gray-500">
          Update customer information and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border rounded p-6 bg-white">
        <h2 className="font-medium mb-6">Personal Information</h2>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              First Name
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Last Name
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Link
            to="/profile"
            className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-5 py-2 rounded text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditInfo;