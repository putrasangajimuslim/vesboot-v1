'use client';

import { ShieldCheck, Wrench, Clock, Zap } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    { icon: ShieldCheck, title: 'Part Bergaransi', desc: 'Sparepart original & aftermarket premium.' },
    { icon: Wrench, title: 'Mekanik Ahli', desc: 'Tim kami terlatih khusus untuk Vespa modern & klasik.' },
    { icon: Clock, title: 'Tepat Waktu', desc: 'Estimasi pengerjaan jelas. Tidak molor.' },
    { icon: Zap, title: 'Harga Jelas', desc: 'Biaya diinformasikan di depan. No surprise.' }
  ];

  return (
    <section className="px-6 md:px-12 py-20 bg-slate-900 text-white">
      <div className="text-center mb-16 max-w-7xl mx-auto">
        <h3 className="text-orange-500 font-bold uppercase tracking-widest text-xl mb-2">Kenapa Kami?</h3>
        <h2 className="text-4xl font-bold">Bukan Sekadar Bengkel Biasa</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {features.map((item, i) => (
          <div key={i} className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
            <item.icon className="text-orange-500 mb-4" size={32} />
            <h4 className="text-xl font-bold mb-2">{item.title}</h4>
            <p className="text-slate-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
