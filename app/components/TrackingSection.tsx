'use client';

import { Search } from 'lucide-react';

interface TrackingSectionProps {
  trackingId: string;
  setTrackingId: (value: string) => void;
  onTrack: () => void;
  trackingData: any;
}

export default function TrackingSection({ trackingId, setTrackingId, onTrack, trackingData }: TrackingSectionProps) {
  return (
    <section className="py-16 bg-slate-100 rounded-3xl shadow-md max-w-5xl mx-auto p-8">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 text-orange-600 font-bold uppercase text-sm tracking-widest">
          <Search size={16} /> Lacak Service
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">Lacak Status Servis Motor Anda</h2>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Masukkan nomor pesanan untuk melihat timeline pengerjaan real-time dan estimasi selesai.</p>
      </div>

      <div className="relative max-w-xl mx-auto">
        <input
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Contoh: #VB-2026-001"
          className="w-full p-5 pl-5 pr-28 rounded-2xl border-2 border-slate-300 focus:border-orange-500 outline-none font-semibold text-sm shadow-sm"
        />
        <button
          onClick={onTrack}
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-orange-700 transition flex items-center gap-2"
        >
          <Search size={18} />
          Lacak
        </button>
      </div>

      {trackingData && (
        <div className="mt-10 mx-auto max-w-xl bg-white rounded-3xl border border-gray-200 p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
            <div>
              <h4 className="text-lg font-bold text-slate-900">#{trackingId}</h4>
              <p className="text-slate-500 text-sm">{trackingData.vespa} • {trackingData.service}</p>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-xs">
              {trackingData.status >= 3 ? 'Selesai' : trackingData.status === 2 ? 'Quality Check' : 'Proses'}
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all" style={{ width: `${Math.min(100, ((trackingData.status + 1) / 4) * 100)}%` }} />
          </div>

          <div className="space-y-3">
            {trackingData.steps.map((step: any, i: number) => {
              const isActive = i <= trackingData.status;
              const icons = ['🕒', '🔧', '✅', '🏁'];

              return (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full border-2 ${isActive ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300 bg-white text-slate-400'} flex items-center justify-center font-semibold`}>
                      {icons[i]}
                    </div>
                    {i < trackingData.steps.length - 1 && <div className={`w-px h-8 ${isActive ? 'bg-orange-500' : 'bg-slate-200'} mt-1`} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`font-semibold ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</span>
                      <span className="text-xs text-slate-400">{step.date}</span>
                    </div>
                    <p className="text-xs text-slate-500">{isActive ? 'Sudah selesai' : 'Menunggu proses selanjutnya'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
