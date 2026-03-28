'use client';

import ImageSlider from './ImageSlider';
import { ArrowRight, Clock, Zap } from 'lucide-react';

interface HeroSectionProps {
  hasMounted: boolean;
  onBookingClick: () => void;
}

export default function HeroSection({ hasMounted, onBookingClick }: HeroSectionProps) {
  return (
    <section className="px-6 md:px-12 pt-32 py-16 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
      <div>
        <h2 className="text-5xl md:text-6xl font-extrabold mt-6 leading-[1.1]">
          Tempat Vespa Kamu <span className="text-orange-600">Makin Slay</span>
        </h2>
        <p className="text-slate-600 mt-6 text-lg">
          Sparepart original, bengkel berpengalaman, harga transparan. Semua untuk Vespa kamu yang satu itu.
        </p>

        {hasMounted && (
          <div className="mt-6 flex flex-col gap-2 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full w-fit text-[10px] uppercase font-bold mb-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
              Buka Sekarang
            </div>
            <div className="flex items-center gap-2 ml-1">
              <Clock size={20} className="text-orange-600 shrink-0 mr-2" />
              <div className="flex flex-col gap-0.5">
                <span className="leading-tight">Senin - Jumat: 09.00 - 18.00 WIB</span>
                <span className="leading-tight">Sabtu - Minggu: 09.00 - 15.00 WIB</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={onBookingClick}
            className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition"
          >
            Booking Servis <ArrowRight size={20} />
          </button>
          <button className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition">
            Lihat Produk
          </button>
        </div>

        <div className="mt-12 grid grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { val: '500+', label: 'Unit Selesai' },
            { val: '8+', label: 'Tahun Pengalaman' },
            { val: '4.9', label: 'Rating Pelanggan' }
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl font-black">{stat.val}</div>
              <div className="text-slate-500 text-[10px] uppercase font-bold leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative bg-white p-3 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="w-full h-[300px] md:h-[400px] overflow-hidden rounded-[2rem]">
          <ImageSlider />
        </div>
      </div>
    </section>
  );
}
