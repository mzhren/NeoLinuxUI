'use client';

export default function AboutApp() {
  return (
    <div className="h-full p-8 bg-black/30 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl mb-6 animate-pulse"></div>
      <h1 className="text-white text-3xl font-bold mb-2">NeoLinux OS</h1>
      <p className="text-white/60 mb-6">Version 2024.12.0</p>
      <p className="text-white/80 max-w-md mb-4">
        A modern, beautiful Linux desktop experience built with cutting-edge web technologies.
      </p>
      <div className="flex flex-col gap-2 text-sm text-white/60">
        <div>Kernel: 6.x.x-neo</div>
        <div>Shell: NeoShell 5.1</div>
        <div>Desktop: NeoDE 3.0</div>
      </div>
      <div className="mt-8 flex gap-4">
        <div className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium cursor-pointer hover:scale-105 transition-transform">
          Documentation
        </div>
        <div className="px-4 py-2 bg-white/10 rounded-lg text-white font-medium cursor-pointer hover:bg-white/20 transition-colors">
          GitHub
        </div>
      </div>
    </div>
  );
}
