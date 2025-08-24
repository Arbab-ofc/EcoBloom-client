import { Link } from "react-router-dom";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import {
  FaLeaf,
  FaTruck,
  FaRecycle,
  FaSmile,
  FaShieldAlt,
  FaRupeeSign,
} from "react-icons/fa";

export default function About() {
  const [text] = useTypewriter({
    words: ["EcoBloom 🌿", "Grow green, live clean", "Plants make people happy"],
    loop: true,
    typeSpeed: 80,
    deleteSpeed: 50,
    delaySpeed: 1500,
  });

  return (
    <div className="space-y-16">
      <section className="text-center py-16 sm:py-20 bg-gradient-to-r from-emerald-100 via-green-50 to-lime-100 border-b">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-600">
          {text}
          <Cursor cursorStyle="|" />
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Growing happiness, one plant at a time.
        </p>
      </section>

      
      <section className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Our Story 🌱</h2>
        <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl mx-auto">
          EcoBloom was founded with the belief that plants bring peace, health,
          and joy into our lives. From indoor air-purifying plants to outdoor
          garden beauties, we curate each plant with love and care.
        </p>
      </section>

      
      <section className="bg-white py-12 border-t border-b">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl">🌿</p>
            <h3 className="font-semibold mt-2">Greener Homes</h3>
            <p className="text-gray-600 text-sm mt-1">
              Making every corner bloom with nature.
            </p>
          </div>
          <div>
            <p className="text-3xl">🚚</p>
            <h3 className="font-semibold mt-2">Safe Delivery</h3>
            <p className="text-gray-600 text-sm mt-1">
              Healthy plants packed & delivered with care.
            </p>
          </div>
          <div>
            <p className="text-3xl">🌍</p>
            <h3 className="font-semibold mt-2">Eco-Friendly</h3>
            <p className="text-gray-600 text-sm mt-1">
              Minimal plastic, sustainable packaging.
            </p>
          </div>
        </div>
      </section>

      
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Why Choose EcoBloom? 💚
        </h2>

        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition text-center">
            <FaLeaf className="text-emerald-600 text-3xl mx-auto" />
            <h3 className="font-semibold mt-3">Wide Plant Variety</h3>
            <p className="text-gray-600 text-sm mt-1">
              From succulents to air-purifiers—carefully curated for every space and style.
            </p>
          </div>

          <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition text-center">
            <FaTruck className="text-emerald-600 text-3xl mx-auto" />
            <h3 className="font-semibold mt-3">Fast & Safe Delivery</h3>
            <p className="text-gray-600 text-sm mt-1">
              Sturdy, plant-friendly packaging so your greens arrive fresh and happy.
            </p>
          </div>

          <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition text-center">
            <FaRecycle className="text-emerald-600 text-3xl mx-auto" />
            <h3 className="font-semibold mt-3">Eco Packaging</h3>
            <p className="text-gray-600 text-sm mt-1">
              Minimal plastic with recyclable materials—better for your home and the planet.
            </p>
          </div>

          <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition text-center">
            <FaSmile className="text-emerald-600 text-3xl mx-auto" />
            <h3 className="font-semibold mt-3">Customer Happiness</h3>
            <p className="text-gray-600 text-sm mt-1">
              Friendly support and plant tips to keep your greens thriving.
            </p>
          </div>

          <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition text-center">
            <FaShieldAlt className="text-emerald-600 text-3xl mx-auto" />
            <h3 className="font-semibold mt-3">Quality Assured</h3>
            <p className="text-gray-600 text-sm mt-1">
              Nursery-grade selection, health-checked and ready to grow at your place.
            </p>
          </div>

          <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition text-center">
            <FaRupeeSign className="text-emerald-600 text-3xl mx-auto" />
            <h3 className="font-semibold mt-3">Transparent Pricing</h3>
            <p className="text-gray-600 text-sm mt-1">
              Fair, upfront rates—no hidden charges, just honest value.
            </p>
          </div>
        </div>
      </section>

      
      <section className="bg-emerald-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Tech Stack ⚙️</h2>
          <p className="mt-4 text-gray-600">
            Built with modern tools for a smooth experience.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-4 py-2 rounded-full border bg-white">React + Vite</span>
            <span className="px-4 py-2 rounded-full border bg-white">TailwindCSS</span>
            <span className="px-4 py-2 rounded-full border bg-white">Node.js</span>
            <span className="px-4 py-2 rounded-full border bg-white">Express</span>
            <span className="px-4 py-2 rounded-full border bg-white">MongoDB</span>
            <span className="px-4 py-2 rounded-full border bg-white">JWT Auth</span>
          </div>
        </div>
      </section>

      
      <section className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800">Project Credits</h2>
        <p className="mt-2 text-gray-600">
          🚀 Project under <span className="font-bold text-emerald-700">Urvann</span>
        </p>
        <p className="text-gray-600">
          👨‍💻 Created by <span className="font-bold">Arbab</span>
        </p>
      </section>

      
      <section className="bg-white py-12 border-t mb-0">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800">Some Words by Arbab ✍️</h2>
          <p className="mt-4 text-gray-600 italic">
            "EcoBloom is not just a project; it’s a vision to connect people
            with nature. Every plant tells a story of growth, and with EcoBloom,
            I hope to bring that story into every home."
          </p>
        </div>
      </section>

      
      <section className="text-center py-12  bg-gradient-to-r from-emerald-100 via-green-50 to-lime-100 border-t">
        <h2 className="text-2xl font-bold text-gray-800">
          Ready to Bring Nature Home?
        </h2>
        <Link
          to="/"
          className="inline-block mt-4 px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
        >
          Go to Home
        </Link>
      </section>
    </div>
  );
}
