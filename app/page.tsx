'use client';

import Image from "next/image";
import ImageSlider from "./components/ImageSlider";
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Menu, X, ArrowRight,ShieldCheck, Clock, Zap, Wrench, Truck, Bike, Car, MapPin, Check } from 'lucide-react';
import { title } from "process";

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
  const [selectedVespa, setSelectedVespa] = useState<string | null>(null);
  const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(null);
  const [selectedHarga, setSelectedHarga] = useState<number>(0);
  const [totalHarga, setTotalHarga] = useState<number>(0);

  const listVespa = [
    { name: 'Klasik (PX, Sprint, dll)', multiplier: 1 }, 
    { name: 'Modern (Primavera, LX)', multiplier: 1.15 }, 
    { name: 'Premium (GTS, GTV, SEI)', multiplier: 1.35 }
  ];

  const listLayanan: Layanan[] = [
    { title: 'Servis Rutin', price: 85000, displayPrice: 'Rp.85.000', time: '1-2 Jam' },
    { title: 'Restorasi Total', price: 3500000, displayPrice: 'Rp.3.500.000', time: '7-14 Hari' },
    // { title: 'Upgrade Performa', price: 500000, displayPrice: 'Rp.500.000', time: '7-14 Hari' },
    // { title: 'Listrik & Sistem', price: 150000, displayPrice: 'Rp.150.000', time: '3 Hari' },
    { title: 'Custom Build', price: 2000000, displayPrice: 'Rp.2.000.000', time: '3-7 Hari' }
  ];

  useEffect(() => {
    if (selectedVespa && selectedLayanan) {
      const vespaObj = listVespa.find(v => v.name === selectedVespa);
      if (vespaObj) {
        setTotalHarga(selectedLayanan.price * vespaObj.multiplier);
      }
    }
  }, [selectedVespa, selectedLayanan]);

  const handleLayananClick = (item: Layanan) => {
    setSelectedLayanan(item);
  };

  

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-sm border-b border-slate-200">
        <div className="flex justify-between items-center px-4 md:px-12 py-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-black text-orange-600">VesBooth</h1>
          
          <div className="hidden md:flex gap-6 lg:gap-8 font-medium text-slate-600 text-sm lg:text-base">
            {['Home', 'Produk', 'Bengkel', 'Gallery', 'Blog', 'Kontak'].map((link) => (
              <a key={link} href="#" className="hover:text-orange-600 transition">{link}</a>
            ))}
          </div>

          <button className="hidden md:block bg-orange-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-orange-700 transition">
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
      <section className="px-6 md:px-12 pt-32 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-5xl md:text-6xl font-extrabold mt-6 leading-[1.1]">
            Tempat Vespa Kamu <span className="text-orange-600">Makin Slay</span>
          </h2>
          <p className="text-slate-600 mt-6 text-lg">
            Sparepart original, bengkel berpengalaman, harga transparan. Semua untuk Vespa kamu yang satu itu.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition">
              Booking Servis <ArrowRight size={20}/>
            </button>
            <button className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition">
              Lihat Produk
            </button>
          </div>

          <div className="mt-12 grid grid-cols-4 gap-4">
            {[
              { val: '500+', label: 'Unit Dikerjakan' },
              { val: '8+', label: 'Tahun Pengalaman' },
              { val: '4.9', label: 'Rating Pelanggan' }
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-black">{s.val}</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Visual Box */}
        <div className="relative bg-white p-3 rounded-[2.5rem] shadow-xl border border-slate-100">
           <div className="w-full h-[400px]">
             <ImageSlider />
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 md:px-12 py-20 bg-slate-900 text-white">
        <div className="text-center mb-16">
          <h3 className="text-orange-500 font-bold uppercase tracking-widest text-2xl mb-2">Kenapa Kami?</h3>
          <h2 className="text-4xl font-bold">Bukan Sekadar Bengkel Biasa</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: ShieldCheck, title: "Part Bergaransi", desc: "Sparepart original & aftermarket premium." },
            { icon: Wrench, title: "Mekanik Tersertifikasi", desc: "Tim kami terlatih khusus untuk Vespa & Piaggio." },
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

      {/* Layanan Section */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-orange-500 font-bold uppercase text-sm">Layanan Bengkel</span>
          <h2 className="text-4xl font-bold mt-2">Titip Vespamu, <br/><span className="text-orange-600">Kami Urus Semuanya</span></h2>
        </div>

        {/* TIPE VESPA: Grid 3 kecil */}
        <div>
          <span className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-4 block">Tipe Vespa</span>
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
            {listVespa.map((item: VespaType) => (
              <button
                key={item.name}
                onClick={() => setSelectedVespa(item.name)}
                className={`p-12 rounded-2xl border-2 transition-all text-left relative ${selectedVespa === item.name ? 'border-orange-600 bg-orange-50' : 'border-slate-200 bg-white hover:border-orange-300'}`}
              >
                <h4 className={`font-bold ${selectedVespa === item.name ? 'text-orange-700' : 'text-slate-800'}`}>{item.name}</h4>
                <p className="text-xs text-slate-500 mt-2 italic">
                  {item.multiplier === 1 
                    ? '' 
                    : `+${Math.round((item.multiplier - 1) * 100)}% dari harga dasar`
                  }
                </p>
                {selectedVespa === item.name && <Check className="absolute right-4 top-4 text-orange-600" size={20} />}
              </button>
            ))}
          </div>
        </div>
        {/* <div className="mb-16">
          <span className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-4 block">Tipe Vespa</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {listVespa.map((item) => (
              <button 
                key={item}
                onClick={() => setSelectedVespa(item)}
                className={`p-6 rounded-2xl border-2 transition-all text-left relative ${selectedVespa === item ? 'border-orange-600 bg-orange-50' : 'border-slate-200 bg-white hover:border-orange-300'}`}
              >
                <h4 className={`font-bold ${selectedVespa === item ? 'text-orange-700' : 'text-slate-800'}`}>{item}</h4>
                {selectedVespa === item && <Check className="absolute right-4 top-4 text-orange-600" size={20} />}
              </button>
            ))}
          </div>
        </div> */}

        {/* TIPE LAYANAN: Slider */}
        <div>
          <span className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-4 block">Tipe Layanan</span>
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
            {listLayanan.map((item) => (
              <button
                key={item.title}
                onClick={() => setSelectedLayanan(item)}
                className={`min-w-[280px] p-8 rounded-3xl border-2 transition-all text-left flex flex-col justify-between ${selectedLayanan?.title === item.title ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div>
                  <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold inline-block mb-4 ${selectedLayanan?.title === item.title ? 'bg-white/20' : 'bg-slate-100'}`}>
                    {item.time}
                  </span>
                </div>
                <span className="font-black text-lg block">Mulai {item.displayPrice}</span>
              </button>
            ))}
          </div>
        </div>

        {/* BOX ESTIMASI */}
        <AnimatePresence>
          {selectedVespa && selectedLayanan && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-slate-900 p-8 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="mt-4">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Estimasi Total Biaya</p>
              </div>
              <div className="text-right">
                <p className="text-orange-500 font-black text-3xl">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalHarga)}
                </p>
                <button className="mt-4 bg-orange-600 px-6 py-2 rounded-xl font-bold hover:bg-orange-700 transition">
                  Lanjut Booking
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* SECTION: PILIH ARMADA JEMPUT */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Pilih Lokasi & Armada Jemput</h2>
        
        <div className="relative mb-8">
          <MapPin className="absolute left-4 top-4 text-orange-500" size={20} />
          <input type="text" placeholder="Masukkan lokasi penjemputan..." className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-orange-500 outline-none transition" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Motor', icon: Bike, desc: 'Pengalaman lebih cepat untuk barang kecil.', dim: '1 x 0.5 meter', capacity: 'Up to 20 kg' },
            { name: 'Mobil Pickup', icon: Truck, desc: 'Solusi tangguh untuk bawa barang lebih banyak.', dim: '2 x 1.5 meter', capacity: 'Up to 500 kg' },
            { name: 'Sedan', icon: Car, desc: 'Privasi terjaga, aman untuk dokumen/barang sensitif.', dim: '1.5 x 1 meter', capacity: 'Up to 100 kg' }
          ].map((armada) => (
            <div key={armada.name} className="border-2 border-slate-200 p-6 rounded-3xl hover:border-orange-500 transition cursor-pointer flex flex-col gap-3">
              <armada.icon className="text-orange-500" size={32} />
              <h3 className="font-bold text-lg">{armada.name}</h3>
              <p className="text-xs text-slate-500 flex-grow">{armada.desc}</p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-sm font-semibold space-y-1">
                <div>{armada.dim}</div>
                <div className="text-orange-600">{armada.capacity}</div>
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl flex justify-between items-center">
          <span className="font-bold">Estimasi Biaya Jemput</span>
          <span className="text-2xl font-black">Rp 25.000</span>
        </div>
      </section>

      {/* Testimoni */}
      <section className="px-6 md:px-12 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Kata Mereka Soal VesBooth</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Rizal A.', quote: 'Restorasi PX-ku selesai sempurna!' },
            { name: 'Dinda S.', quote: 'Mekaniknya jujur, harganya transparan.' },
            { name: 'Bagas K.', quote: 'Custom build pertamaku sukses.' }
          ].map((t, i) => (
            <div key={i} className="p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="font-medium italic mb-6">"{t.quote}"</p>
              <div className="font-bold">- {t.name}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          
          {/* Branding */}
          <div className="col-span-1 md:col-span-1">
            <h1 className="text-2xl font-black text-orange-600 mb-4">VesBooth.</h1>
            <p className="text-sm leading-relaxed">
              Bengkel spesialis Vespa terpercaya di Bandung. Memberikan sentuhan terbaik agar Vespa kamu tetap slay setiap hari.
            </p>
          </div>

          {/* Menu Link */}
          <div>
            <h4 className="text-white font-bold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              {['Tentang Kami', 'Layanan', 'Produk', 'Gallery', 'Blog'].map((item) => (
                <li key={item}><a href="#" className="hover:text-orange-500 transition">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Kontak & Alamat */}
          <div>
            <h4 className="text-white font-bold mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm">
              <li>Jl. Vespa Raya No. 12, Ciputat</li>
              <li>WhatsApp: 0812-3456-7890</li>
              <li>Email: hello@vesbooth.com</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white font-bold mb-4">Ikuti Kami</h4>
            <div className="flex gap-4">
              {/* Anda bisa tambahkan ikon dari lucide-react di sini */}
              <a href="#" className="hover:text-orange-500 transition">Instagram</a>
              <a href="#" className="hover:text-orange-500 transition">TikTok</a>
              <a href="#" className="hover:text-orange-500 transition">Facebook</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          <p>© 2026 VesBooth. All rights reserved. Dibuat dengan cinta untuk para Vespa enthusiast.</p>
        </div>
      </footer>
    </main>
  );
}
