'use client';

import Image from "next/image";
import ImageSlider from "./components/ImageSlider";
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight, ShieldCheck, Clock, Zap, Wrench, Truck, Bike, Car, MapPin, Check } from 'lucide-react';

interface Layanan {
  title: string;
  price: number;
  displayPrice: string;
  time: string;
}

interface VespaType {
  name: string;
  multiplier: number;
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alamat, setAlamat] = useState("");
  const [waktu, setWaktu] = useState("09:00");
  const [selectedVespa, setSelectedVespa] = useState<string | null>(null);
  const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(null);
  const [totalHarga, setTotalHarga] = useState<number>(0);
  
  // Solusi Hydration: Memastikan komponen sudah termuat di client
  const [hasMounted, setHasMounted] = useState(false);

  const listVespa: VespaType[] = [
    { name: 'Klasik (PX, Sprint, dll)', multiplier: 1 }, 
    { name: 'Modern (Primavera, LX)', multiplier: 1.15 }, 
    { name: 'Premium (GTS, GTV, SEI)', multiplier: 1.35 }
  ];

  const listLayanan: Layanan[] = [
    { title: 'Servis Rutin', price: 85000, displayPrice: 'Rp.85.000', time: '1-2 Jam' },
    { title: 'Restorasi Total', price: 3500000, displayPrice: 'Rp.3.500.000', time: '7-14 Hari' },
    { title: 'Custom Build', price: 2000000, displayPrice: 'Rp.2.000.000', time: '3-7 Hari' }
  ];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Daftar jam operasional 09:00 - 18:00
  const jamOperasional = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  useEffect(() => {
    if (selectedVespa && selectedLayanan) {
      const vespaObj = listVespa.find(v => v.name === selectedVespa);
      if (vespaObj) {
        setTotalHarga(selectedLayanan.price * vespaObj.multiplier);
      }
    }
  }, [selectedVespa, selectedLayanan]);

  // Fungsi Helper untuk format mata uang agar konsisten SSR & Client
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-sm border-b border-slate-200">
        <div className="flex justify-between items-center px-4 md:px-12 py-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-black text-orange-600">VesBooth</h1>
          
          <div className="hidden md:flex gap-6 lg:gap-8 font-medium text-slate-600 text-sm lg:text-base">
            {['Home', 'Produk', 'Bengkel', 'Gallery', 'Blog', 'Kontak'].map((link) => (
              <a key={link} href="#" className="hover:text-orange-600 transition">{link}</a>
            ))}
          </div>

          <button 
            suppressHydrationWarning
            className="hidden md:block bg-orange-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-orange-700 transition"
          >
            Booking Servis
          </button>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-b p-6 flex flex-col gap-4 shadow-xl">
            {['Home', 'Produk', 'Bengkel', 'Gallery', 'Blog', 'Kontak'].map((link) => (
              <a key={link} href="#" className="text-lg font-bold text-slate-800" onClick={() => setIsMenuOpen(false)}>{link}</a>
            ))}
            <button className="bg-orange-600 text-white py-3 rounded-xl font-bold w-full">Booking Servis</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-32 py-16 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <div>
          <h2 className="text-5xl md:text-6xl font-extrabold mt-6 leading-[1.1]">
            Tempat Vespa Kamu <span className="text-orange-600">Makin Slay</span>
          </h2>
          <p className="text-slate-600 mt-6 text-lg">
            Sparepart original, bengkel berpengalaman, harga transparan. Semua untuk Vespa kamu yang satu itu.
          </p>

          {/* JAM OPERASIONAL - Ikon satu di tengah */}
          {hasMounted && (
            <div className="mt-6 flex flex-col gap-2 text-sm font-medium text-slate-500">
              {/* Label Buka */}
              <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full w-fit text-[10px] uppercase font-bold mb-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div> 
                Buka Sekarang
              </div>
              
              {/* Container Ikon + Teks */}
              <div className="flex items-center gap-2 ml-1">
                {/* Ikon Jam - Diposisikan di tengah secara vertikal oleh flex-items-center */}
                <Clock size={20} className="text-orange-600 shrink-0 mr-2" />
                
                {/* Kolom teks */}
                <div className="flex flex-col gap-0.5">
                  <span className="leading-tight">Senin - Jumat: 09.00 - 18.00 WIB</span>
                  <span className="leading-tight">Sabtu - Minggu: 09.00 - 15.00 WIB</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              suppressHydrationWarning
              className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition"
            >
              Booking Servis <ArrowRight size={20}/>
            </button>
            <button 
              suppressHydrationWarning
              className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition"
            >
              Lihat Produk
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { val: '500+', label: 'Unit Selesai' },
              { val: '8+', label: 'Tahun Pengalaman' },
              { val: '4.9', label: 'Rating Pelanggan' }
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-black">{s.val}</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Visual Box */}
        <div className="relative bg-white p-3 rounded-[2.5rem] shadow-xl border border-slate-100">
           <div className="w-full h-[300px] md:h-[400px] overflow-hidden rounded-[2rem]">
             <ImageSlider />
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 md:px-12 py-20 bg-slate-900 text-white">
        <div className="text-center mb-16 max-w-7xl mx-auto">
          <h3 className="text-orange-500 font-bold uppercase tracking-widest text-xl mb-2">Kenapa Kami?</h3>
          <h2 className="text-4xl font-bold">Bukan Sekadar Bengkel Biasa</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { icon: ShieldCheck, title: "Part Bergaransi", desc: "Sparepart original & aftermarket premium." },
            { icon: Wrench, title: "Mekanik Ahli", desc: "Tim kami terlatih khusus untuk Vespa modern & klasik." },
            { icon: Clock, title: "Tepat Waktu", desc: "Estimasi pengerjaan jelas. Tidak molor." },
            { icon: Zap, title: "Harga Jelas", desc: "Biaya diinformasikan di depan. No surprise." }
          ].map((item, i) => (
            <div key={i} className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
              <item.icon className="text-orange-500 mb-4" size={32} />
              <h4 className="text-xl font-bold mb-2">{item.title}</h4>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Layanan Section - Padding Bottom Dikurangi */}
      <section className="px-6 md:px-12 pt-16 pb-4 max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-orange-500 font-bold uppercase text-sm">Layanan Bengkel</span>
          <h2 className="text-4xl font-bold mt-2">Titip Vespamu, <br/><span className="text-orange-600">Kami Urus Semuanya</span></h2>
        </div>

        {/* PILIH TIPE */}
        <div className="mb-10">
          <span className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-4 block">1. Pilih Tipe Vespa</span>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
            {listVespa.map((item) => (
              <button key={item.name} suppressHydrationWarning onClick={() => setSelectedVespa(item.name)}
                className={`min-w-[220px] md:min-w-[280px] p-6 rounded-2xl border-2 transition-all text-left relative snap-start ${selectedVespa === item.name ? 'border-orange-600 bg-orange-50' : 'border-slate-200 bg-white hover:border-orange-300'}`}>
                <h4 className={`font-bold ${selectedVespa === item.name ? 'text-orange-700' : 'text-slate-800'}`}>{item.name}</h4>
                {selectedVespa === item.name && <Check className="absolute right-4 top-4 text-orange-600" size={20} />}
              </button>
            ))}
          </div>
        </div>

        {/* PILIH LAYANAN */}
        <div className="mb-10">
          <span className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-4 block">2. Pilih Layanan</span>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
            {listLayanan.map((item) => (
              <button key={item.title} suppressHydrationWarning onClick={() => setSelectedLayanan(item)}
                className={`min-w-[250px] p-8 rounded-3xl border-2 transition-all text-left flex flex-col justify-between snap-start ${selectedLayanan?.title === item.title ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <div>
                  <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold inline-block mb-4 ${selectedLayanan?.title === item.title ? 'bg-white/20' : 'bg-slate-100'}`}>{item.time}</span>
                </div>
                <span className="font-black text-lg block">Mulai {item.displayPrice}</span>
              </button>
            ))}
          </div>
        </div>

        {/* BOX ESTIMASI */}
        <AnimatePresence>
          {selectedVespa && selectedLayanan && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="bg-slate-900 p-8 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Estimasi Total ({selectedVespa})</p>
                <h3 className="text-xl font-bold">{selectedLayanan.title}</h3>
              </div>
              <div className="text-left md:text-right">
                <p className="text-orange-500 font-black text-3xl">{formatCurrency(totalHarga)}</p>
                <button className="mt-3 bg-orange-600 px-8 py-2.5 rounded-xl font-bold hover:bg-orange-700 transition w-full md:w-auto text-sm">Booking Sekarang</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* SECTION: ARMADA JEMPUT - Padding Top Dikurangi agar Rapat */}
      <section className="px-6 pt-4 pb-16 max-w-7xl mx-auto">
        <div className="mb-8 border-t border-slate-200 pt-10">
          <h2 className="text-2xl font-bold">Ambil di Rumah (Pick-up)</h2>
          <p className="text-slate-500 text-sm">Layanan antar-jemput Vespa langsung ke depan pintu.</p>
        </div>
        
        <div className="relative mb-8 max-w-2xl">
          <MapPin className="absolute left-4 top-4 text-orange-500" size={20} />
          <input readOnly onClick={() => setIsModalOpen(true)} value={alamat || "Masukkan lokasi penjemputan..."} className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-orange-500 outline-none transition text-sm" />
        </div>

        {/* MODAL ALAMAT */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">Atur Lokasi Jemput</h3>
                <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
              </div>
              
              <input 
                onChange={(e) => setAlamat(e.target.value)} 
                placeholder="Ketik alamat..." 
                className="w-full p-4 border-2 border-slate-200 focus:border-orange-500 outline-none transition rounded-xl mb-6" 
                value={alamat}
              />

              <div className="flex justify-between items-center p-4 bg-slate-100 rounded-2xl">
                <span className="text-sm font-semibold truncate w-1/2">{alamat || "Belum ada alamat"}</span>
                
                {/* Jam yang sudah dibesarkan dan rounded */}
                <div className="flex items-center gap-1.5 px-4 py-3 bg-white rounded-full border border-slate-200 shadow-sm w-32 justify-center">
                  <Clock size={16} className="text-orange-600" />
                  <select 
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
                    className="bg-transparent outline-none cursor-pointer text-sm font-bold text-orange-500 appearance-none text-center w-full"
                  >
                    {jamOperasional.map((jam) => (
                      <option key={jam} value={jam}>{jam}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button onClick={() => setIsModalOpen(false)} className="w-full mt-6 bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700">Simpan Lokasi</button>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Motor Towing', icon: Bike, desc: 'Solusi cepat untuk servis ringan.', cap: 'Max 1 Unit' },
            { name: 'Pickup L300', icon: Truck, desc: 'Standar angkut Vespa yang aman.', cap: 'Max 3 Unit' },
            { name: 'Blind Van', icon: Car, desc: 'Privasi & terlindung cuaca.', cap: 'Premium' }
          ].map((armada) => (
            <div key={armada.name} className="group border-2 border-slate-200 p-6 rounded-3xl hover:border-orange-500 hover:shadow-md transition cursor-pointer bg-white">
              <armada.icon className="text-orange-500 mb-3" size={28} />
              <h3 className="font-bold text-base">{armada.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{armada.desc}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] font-bold text-orange-600 uppercase tracking-wider">{armada.cap}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: METODE PEMBAYARAN */}
      <section className="px-6 py-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h4 className="font-bold text-slate-800 text-sm">Metode Pembayaran</h4>
            <p className="text-xs text-slate-500">Transaksi aman & terpercaya.</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {/* BCA */}
            <span className="font-black text-xl tracking-tighter" style={{ color: '#0060AA' }}>BCA</span>
            
            {/* BNI */}
            <span className="font-black text-xl tracking-tighter" style={{ color: '#F68B1F' }}>BNI</span>
            
            {/* OVO */}
            <span className="font-bold text-white px-2 py-0.5 rounded text-xs tracking-wider" style={{ backgroundColor: '#4E2A84' }}>OVO</span>
            
            {/* GOPAY */}
            <span className="font-black text-lg tracking-tighter" style={{ color: '#00ADEF' }}>GoPay</span>
            
            {/* QRIS - Hitam Standar */}
            <div className="border border-slate-300 px-2 py-0.5 rounded shadow-sm">
              <span className="font-black text-black text-xs tracking-tighter uppercase">QRIS</span>
            </div>
            
            {/* MANDIRI */}
            <span className="font-bold text-lg tracking-tighter" style={{ color: '#005197' }}>mandiri</span>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </main>
  );
}