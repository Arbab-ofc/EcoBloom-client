import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { useTypewriter, Cursor } from "react-simple-typewriter";

export default function Footer() {
  const [text] = useTypewriter({
    words: [
      "Designed and Created by Arbab Arshad ✨",
      "© 2025 EcoBloom. All rights reserved.",
    ],
    loop: true,
    typeSpeed: 70,
    deleteSpeed: 40,
    delaySpeed: 1800,
  });

  return (
    <footer
      className="
        relative mt-0 border-t
        bg-white/70 backdrop-blur-md
        
        overflow-hidden
      "
    >
      
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_60%)]
        "
        aria-hidden
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        
        <div className="flex flex-col items-center text-center gap-4">
          <h2
            className="
              text-base sm:text-lg md:text-xl font-medium
              bg-clip-text text-transparent
              bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500
            "
          >
            {text}
            <Cursor cursorStyle="|" />
          </h2>

          
          <span className="h-px w-24 sm:w-32 md:w-40 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
        </div>

        
        <div
          className="
            mt-6 flex items-center justify-center gap-5 sm:gap-6
          "
        >
          <a
            href="mailto:ecobloomprvt@gmail.com"
            aria-label="Email Arbab Arshad"
            className="
              group relative inline-flex h-10 w-10 items-center justify-center
              rounded-full border bg-white/80 dark:bg-neutral-900/80
              transition-all
              hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)]
              hover:border-emerald-500/60
              focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
            "
            title="Email"
          >
            <FaEnvelope className="text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 transition-transform group-hover:-translate-y-0.5" />
          </a>

          <a
            href="https://github.com/Arbab-ofc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="
              group relative inline-flex h-10 w-10 items-center justify-center
              rounded-full border bg-white/80 dark:bg-neutral-900/80
              transition-all
              hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)]
              hover:border-emerald-500/60
              focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
            "
            title="GitHub"
          >
            <FaGithub className="text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 transition-transform group-hover:-translate-y-0.5" />
          </a>

          <a
            href="https://www.linkedin.com/in/arbab-arshad-0b2961326/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="
              group relative inline-flex h-10 w-10 items-center justify-center
              rounded-full border bg-white/80 dark:bg-neutral-900/80
              transition-all
              hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)]
              hover:border-emerald-500/60
              focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
            "
            title="LinkedIn"
          >
            <FaLinkedin className="text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>

        
        <p className="mt-6 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Built with ❤️, React, and a lot of ☕.
        </p>
      </div>
    </footer>
  );
}
