import React from "react";

export default function NavbarECG() {
  return (
    <header className="w-full fixed top-0 left-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-md bg-white/40 border border-white/30 rounded-2xl shadow-sm px-5 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            ECG Classification
          </h1>
        </div>
      </nav>
    </header>
  );
}
