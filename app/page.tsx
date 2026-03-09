import Image from "next/image";
import ImageSlider from "./components/ImageSlider";

import { ArrowRight, ShieldCheck, Wrench, Clock, Zap, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* ... (Navbar tetap seperti sebelumnya) ... */}

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1]">
            Tempat Vespa Kamu <span className="text-orange-600">Makin Slay</span>
          </h2>
          <p className="text-slate-600 mt-6 text-lg">
            Sparepart original, bengkel berpengalaman, harga transparan. Semua untuk Vespa kamu yang satu itu.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-700 transition">
              Booking Servis Sekarang
            </button>
            <button className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition">
              Lihat Produk
            </button>
          </div>

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-3 gap-8">
            {[
              { label: 'Unit', val: '500+' },
              { label: 'Tahun', val: '8+' },
              { label: 'Rating', val: '4.9' }
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-black text-slate-900">{s.val}</div>
                <div className="text-slate-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Visual Box */}
        <div className="relative bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100">
           <div className="h-[400px] w-full bg-slate-200 rounded-[1.8rem] flex items-center justify-center">
             <ImageSlider />
           </div>
        </div>
      </section>

      {/* Modern Features Grid */}
      <section className="px-6 md:px-12 py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h3 className="text-orange-500 font-bold uppercase tracking-widest mb-2">Mengapa Kami?</h3>
          <h2 className="text-4xl font-bold">Bukan Sekadar Bengkel Biasa</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: ShieldCheck, title: "Part Bergaransi", desc: "Sparepart original & aftermarket premium, semua bergaransi resmi." },
            { icon: Wrench, title: "Mekanik Tersertifikasi", desc: "Tim kami terlatih dan bersertifikat khusus untuk Vespa & Piaggio." },
            { icon: Clock, title: "Tepat Waktu", desc: "Estimasi pengerjaan jelas. Tidak molor, tidak ada alasan." },
            { icon: Zap, title: "Harga Jelas", desc: "Semua biaya diinformasikan sebelum pengerjaan dimulai. No surprise." }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-orange-500 transition-colors">
              <item.icon className="text-orange-500 mb-4" size={32} />
              <h4 className="text-xl font-bold mb-2">{item.title}</h4>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
