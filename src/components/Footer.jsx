import { FaFacebookF, FaFacebookMessenger, FaViber } from "react-icons/fa";

function Footer() {
  const contactPhone = "+95 9 785 364854";
  const viberNumber = contactPhone.replace(/\s/g, "");

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-400">
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <p className="text-sm">Email: infwallet@gmail.com</p>
            <p className="text-sm mt-2">Phone: {contactPhone}</p>
          </div>

          <div className="text-center">
            <h4 className="text-white font-semibold mb-4">Social Media</h4>
            <div className="flex justify-center gap-6">
              <a
                href="https://www.facebook.com/iwmcs"
                target="_blank"
                rel="noreferrer"
                className="text-2xl text-gray-300 hover:text-blue-600 transition"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.facebook.com/iwmcs"
                target="_blank"
                rel="noreferrer"
                className="text-2xl text-gray-300 hover:text-blue-500 transition"
                aria-label="Messenger"
              >
                <FaFacebookMessenger />
              </a>
              <a
                href={`viber://chat?number=${encodeURIComponent(viberNumber)}`}
                className="text-2xl text-gray-300 hover:text-purple-500 transition"
                aria-label="Viber"
              >
                <FaViber />
              </a>
            </div>
          </div>

          <div className="md:text-right">
            <h4 className="text-white font-semibold mb-4">Address</h4>
            <p className="text-sm">
              Delaware - 2055 Limestone Rd, Wilmington, 19801
              <br />
              Montana - 1001 S Main St, Kalispell, 59901
              <br />
              Thailand - 93/6, Lumpini Ville Prachachuen Phongphet, Pracha Chuen Road, Nontaburi
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm">
          <p>&copy; 2026 Flight Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
