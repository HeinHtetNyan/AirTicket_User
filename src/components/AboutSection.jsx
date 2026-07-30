const stats = [
  { value: "300+", label: "Airlines" },
  { value: "120+", label: "Countries" },
  { value: "5M+", label: "Bookings" },
  { value: "24/7", label: "Support" },
];

const AboutSection = () => {
  return (
    <section className="bg-[#f5f7fb] py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 md:p-12">

          {/* TITLE */}
          <div className="flex items-center gap-4 mb-10">
            <span className="w-10 h-[2px] bg-blue-500"></span>

            <h2 className="text-lg md:text-xl font-semibold text-slate-800">
              About Us
            </h2>

            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-6 text-slate-600 leading-8 text-sm md:text-base max-w-5xl">
            <p>
              We are a leading airline booking platform dedicated to transforming
              the way travelers discover and book flights worldwide. Our platform
              connects millions of passengers with thousands of airlines, offering
              comprehensive flight options, competitive pricing, and real-time availability.
            </p>

            <p>
              Whether you're planning a business trip, family vacation, or spontaneous
              getaway, our platform offers intuitive search tools, flexible booking
              options, and 24/7 customer support. We’re committed to making air travel
              accessible, affordable, and stress-free for everyone.
            </p>
          </div>

          {/* STATS */}
          <div className="border-t border-gray-200 mt-12 pt-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

              {stats.map((item, index) => (
                <div key={index}>
                  <h3 className="text-3xl md:text-4xl font-bold text-blue-600">
                    {item.value}
                  </h3>
                  <p className="text-gray-500 mt-3 text-sm md:text-base">
                    {item.label}
                  </p>
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
