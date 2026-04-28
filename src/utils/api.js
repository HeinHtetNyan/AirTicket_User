import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const loginUser = async (email, password) => {
  const response = await apiClient.post("/auth/customer/login", {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await apiClient.post("/auth/customer/signup", payload);
  return response.data;
};

export const refreshToken = async () => {
  const response = await apiClient.post("/auth/customer/token");
  return response.data;
};

// Booking APIs
export const createBooking = async (bookingData) => {
  const response = await apiClient.post("/bookings/", bookingData);
  return response.data;
};

export const addPassengers = async (bookingId, passengersData) => {
  const response = await apiClient.post(
    `/bookings/${bookingId}/passengers`,
    passengersData,
  );
  return response.data;
};

export const getUserBookings = async () => {
  const response = await apiClient.get("/bookings/me");
  return response.data;
};

export const getBookingDetail = async (bookingId) => {
  const response = await apiClient.get(`/bookings/${bookingId}`);
  return response.data;
};

// Contact APIs
export const createContact = async (contactData) => {
  const response = await apiClient.post("/contact/", contactData);
  return response.data;
};

export const getMyContact = async () => {
  const response = await apiClient.get("/contact/me");
  return response.data;
};

export const updateContact = async (contactData) => {
  const response = await apiClient.put("/contact/me", contactData);
  return response.data;
};

// Flight APIs
export const searchFlights = async (searchParams) => {
  const response = await apiClient.get("/flights/search", {
    params: searchParams,
  });
  return response.data;
};

export const searchRoundTripFlights = async (searchParams) => {
  const response = await apiClient.get("/flights/search-round-trip", {
    params: searchParams,
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await apiClient.post("/auth/forgot-password", {
    email,
  });
  return response.data;
};

export const resetPassword = async (token, new_password) => {
  const response = await apiClient.post("/auth/reset-password", {
    token,
    new_password,
  });
  return response.data;
};

export const getCustomerMe = async () => {
  const response = await apiClient.get("/customer/me");
  return response.data;
};

export const updateCustomerMe = async (payload) => {
  const response = await apiClient.patch("/customer/me", payload);
  return response.data;
};

// Email Verification APIs
export const resendVerificationEmail = async (payload) => {
  const response = await apiClient.post("/auth/resend-verification", payload);
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await apiClient.post("/auth/verify-email", { token });
  return response.data;
};

export const getSecureTicket = async (bookingId) => {
  const response = await apiClient.get(`/secure/tickets/${bookingId}`, {
    responseType: "blob",
  });
  return response.data;
};

export const getTicketStatus = async (bookingId) => {
  const response = await apiClient.get(`/files/status/${bookingId}`);
  return response.data;
};

// Content APIs
export const getBanners = async () => {
  const response = await apiClient.get("/content/banners");
  return response.data;
};

export const getBackground = async () => {
  const response = await apiClient.get("/content/background");
  return response.data;
};