import React from "react";

export default function NavbarECG() {
  const theme = {
    navy: "#1F3D68",
    blue: "#264B93",
    border: "rgba(31, 61, 104, 0.15)", // Low opacity navy
  };

  return (
    <header className="w-full fixed top-4 left-0 z-50 mb-8">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="backdrop-blur-xl bg-white/80 border rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-5 py-3 flex items-center justify-between transition-all duration-300"
          style={{ borderColor: theme.border }}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 group">
              <svg
                className="w-6 h-6 transition-transform group-hover:scale-110"
                style={{ color: theme.blue }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>

            <h1
              className="text-xl font-bold tracking-tight select-none"
              style={{ color: theme.navy }}
            >
              ECG <span style={{ color: theme.blue }}>Classification</span>
            </h1>
          </div>
        </div>
      </nav>
    </header>
  );
}
