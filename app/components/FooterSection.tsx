'use client';

export default function FooterSection() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <h1 className="text-2xl font-black text-orange-600 mb-4">VesBooth.</h1>
          <p className="text-xs leading-relaxed">Spesialis restorasi dan servis Vespa terpercaya di Bandung. Jadikan Vespamu selalu prima dan tetap slay.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm">Navigasi</h4>
          <ul className="space-y-2 text-xs">
            {['Layanan', 'Produk Original', 'Galeri Restorasi', 'Lokasi Bengkel'].map((item) => (
              <li key={item}><a href="#" className="hover:text-orange-500 transition">{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm">Kontak</h4>
          <ul className="space-y-2 text-xs font-mono">
            <li>WA: 0812-3456-7890</li>
            <li>IG: @vesbooth.id</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm">Workshop</h4>
          <p className="text-xs leading-relaxed font-mono text-slate-500">Jl. Vespa No. 12, Ciputat<br/>Tangerang Selatan, 15412</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-900 text-center text-[10px] tracking-widest uppercase">
        <p>© 2026 VesBooth Garage. All rights reserved.</p>
      </div>
    </footer>
  );
}
