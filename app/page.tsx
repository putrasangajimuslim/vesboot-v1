'use client';
import Image from "next/image";
import ImageSlider from "./components/ImageSlider";
import { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight, ShieldCheck, Clock, Zap, Wrench, Truck, Bike, Car, MapPin, Check, ChevronRight, ChevronLeft, ShoppingBag, CreditCard, ShoppingCart, Search, Trash2, Plus, Minus } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

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

interface Product {
  id: number;
  name: string;
  price: number;
  label: string;
  disc: number;
  category: string;
}

interface CartItem extends Product {
  qty: number;
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [alamat, setAlamat] = useState("");
  const [waktu, setWaktu] = useState("");
  const [selectedArmada, setSelectedArmada] = useState<string | null>(null);
  const [filter, setFilter] = useState("Semua");
  const [selectedVespa, setSelectedVespa] = useState<string | null>(null);
  const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(null);
  const [totalHarga, setTotalHarga] = useState<number>(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // Modal Form Booking
  const [isPayDP, setIsPayDP] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const cartIconRef = useRef<HTMLDivElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Solusi Hydration: Memastikan komponen sudah termuat di client
  const [hasMounted, setHasMounted] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  const [trackingId, setTrackingId] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);

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

  const products: Product[] = [
    { id: 1, name: "Vespa Original Oil", price: 150000, label: "Populer", disc: 10, category: "Oli" },
    { id: 2, name: "Vespa Classic Mirror", price: 250000, label: "Baru", disc: 0, category: "Aksesoris" },
    { id: 3, name: "Racing Exhaust", price: 1200000, label: "Populer", disc: 20, category: "Knalpot" },
    { id: 4, name: "Handle Grip Premium", price: 350000, label: "Baru", disc: 5, category: "Aksesoris" },
    { id: 5, name: "Handle Grip Standar", price: 150000, label: "Baru", disc: 2, category: "Aksesoris" },
  ];

  const dummyTracking = {
    "#VB-2026-001": {
      name: "Budi",
      vespa: "Vespa Primavera",
      service: "Servis Rutin",
      status: 2,
      steps: [
        { label: "Antri", date: "20 Mar 2026" },
        { label: "Dikerjakan", date: "21 Mar 2026" },
        { label: "Quality Check", date: "-" },
        { label: "Selesai", date: "-" },
      ],
    }
  };

  // ================= FUNCTION =================
  const handleTracking = () => {
    const data = dummyTracking[trackingId as keyof typeof dummyTracking];
    if (data) {
      setTrackingData(data);
    } else {
      alert("ID tidak ditemukan");
    }
  };

  const updateQty = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const filtered = filter === "Semua" ? products : products.filter(p => p.category === filter);

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

  const openGeneralBooking = () => {
    setIsPayDP(false);
    setIsBookingModalOpen(true);
  };

  const openDPBooking = () => {
    setIsPayDP(true);
    setIsBookingModalOpen(true);
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start', 
    containScroll: 'keepSnaps',
    dragFree: true 
  }, [Autoplay({ delay: 3000 })]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const addToCartWithAnimation = (e: React.MouseEvent, product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });

    // Efek Animasi Terbang
    const button = e.currentTarget as HTMLElement;
    const cartIcon = cartIconRef.current;
    if (cartIcon && button) {
      const btnRect = button.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      const flyEl = document.createElement("div");
      flyEl.className = "fixed z-[9999] bg-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold pointer-events-none";
      flyEl.style.left = `${btnRect.left + btnRect.width / 2}px`;
      flyEl.style.top = `${btnRect.top}px`;
      flyEl.innerText = "+1";
      document.body.appendChild(flyEl);
      
      flyEl.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: `translate(${cartRect.left - btnRect.left}px, ${cartRect.top - btnRect.top}px) scale(0.2)`, opacity: 0 }
      ], { duration: 800, easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)' }).onfinish = () => flyEl.remove();
    }
  };

  const totalQty = cartItems.length;
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const isPickupValid = alamat && waktu && selectedArmada;

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <nav className="fixed w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-orange-200">
                <Zap className="text-white fill-white" size={20} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900">VESBOOTH</h1>
          </div>
          
          <div className="hidden md:flex gap-8 font-bold text-slate-500 text-sm">
            {['Home', 'Produk', 'Bengkel', 'Gallery'].map((link) => (
              <a key={link} href="#" className="hover:text-orange-600 transition">{link}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* --- WRAPPER FOR MOUSE LEAVE LOGIC --- */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCartOpen(true)}
              onMouseLeave={() => setIsCartOpen(false)}
            >
              <div 
                ref={cartIconRef} 
                className="bg-slate-100 p-3 rounded-2xl relative cursor-pointer hover:bg-slate-200 transition"
              >
                <ShoppingCart size={22} />
                {totalQty > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black"
                  >
                    {totalQty}
                  </motion.span>
                )}
              </div>

              <AnimatePresence>
              {isCartOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="fixed top-[85px] right-6 w-80 bg-white shadow-2xl rounded-[2rem] p-6 z-[90]"
                >
                  {totalQty === 0 ? (
                  <p className="text-slate-400 font-bold text-center py-10">Keranjang masih kosong.</p>
                ) : (
                  <>
                    <p className="font-black text-sm mb-4">({totalQty}) produk yang dipilih</p>
                    <div className="space-y-4 mb-4">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm font-bold pb-2">
                          <div className="flex flex-col">
                            <span>{item.name}</span>
                            <span className="text-orange-600">Rp {item.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(item.id, -1)} className="p-1 bg-slate-100 rounded-lg cursor-pointer"><Minus size={14}/></button>
                            <span>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="p-1 bg-slate-100 rounded-lg cursor-pointer"><Plus size={14}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 font-black flex justify-between text-lg">
                      <span>Total</span><span>Rp {totalPrice.toLocaleString()}</span>
                    </div>
                    <button className="w-full mt-4 bg-orange-600 text-white py-3 rounded-2xl font-black cursor-pointer">Checkout Sekarang</button>
                  </>
                )}
                </motion.div>
              )}
            </AnimatePresence>
            </div>

            <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white border-b border-slate-200 p-6 flex flex-col gap-4 shadow-xl font-bold"
            >
              {['Home', 'Produk', 'Bengkel', 'Gallery', 'Blog', 'Kontak'].map((link) => (
                <a key={link} href="#" className="text-slate-700 hover:text-orange-600 py-2">{link}</a>
              ))}
              <div className="pt-2">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 block">Quick Access</span>
                <button onClick={() => {setIsTrackingModalOpen(true); setIsMenuOpen(false);}} className="flex w-full items-center justify-between gap-2 text-white bg-slate-900 px-6 py-5 rounded-2xl font-black">
                  <div className="flex items-center gap-3"> Lacak Status Servis</div>
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MODAL LACAK STATUS */}
      <AnimatePresence>
        {isTrackingModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-lg">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] p-8 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-2xl">Lacak Servis</h3>
                <button onClick={() => setIsTrackingModalOpen(false)}><X/></button>
              </div>
              <div className="relative">
                <input type="text" placeholder="Masukkan ID Order..." className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none" />
                <button className="absolute right-2 top-2 bg-orange-600 text-white p-3 rounded-xl"><Search size={20} /></button>
              </div>
              <p className="text-xs text-slate-400 mt-4 font-bold text-center">Contoh: #VB-2026-001</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
            <button onClick={openGeneralBooking}
              suppressHydrationWarning
              className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition cursor-pointer"
            >
              Booking Servis <ArrowRight size={20}/>
            </button>
            <button 
              suppressHydrationWarning
              className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition cursor-pointer"
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

      {/* ================= TRACKING SECTION ================= */}
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
            onClick={handleTracking}
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

      {/* SECTION: KATALOG PRODUK (Dibuat lebih rapat dengan pb-8 pt-12) */}
      <section className="pt-16 pb-6 px-6">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-2">
                Pilihan <span className="text-orange-600">Slay</span>
              </h2>
              <p className="text-slate-500">
                Upgrade performa dan visual Vespamu sekarang.
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              {["Semua", "Oli", "Aksesoris", "Knalpot"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${
                    filter === cat
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 hover:bg-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* CAROUSEL */}
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6 pb-6 items-stretch">
                {filtered.map((p) => {
                  const discPrice = p.price - (p.price * ((p.disc || 0) / 100));

                  return (
                    <div
                      key={p.id}
                      className="group w-[280px] md:w-[300px] flex-shrink-0 bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      {/* IMAGE */}
                      <div className="relative h-52 bg-slate-100 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-100 group-hover:scale-110 transition duration-500" />

                        {/* LABEL */}
                        {p.label && (
                          <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-white text-[10px] font-bold rounded-full">
                            {p.label}
                          </div>
                        )}

                        {/* DISCOUNT */}
                        {p.disc > 0 && (
                          <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow">
                            -{p.disc}%
                          </div>
                        )}

                        {/* HOVER OVERLAY */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <button className="bg-white text-black px-4 py-2 rounded-xl font-bold">
                            Lihat Detail
                          </button>
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-5 flex flex-col flex-1 justify-between">
                        <div>
                          <h4 className="font-bold text-lg leading-snug group-hover:text-orange-600 transition">
                            {p.name}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1">
                            {p.category}
                          </p>
                        </div>

                        {/* PRICE */}
                        <div className="mt-4">
                          {p.disc > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="font-black text-orange-600 text-lg">
                                Rp {discPrice.toLocaleString()}
                              </span>
                              <span className="text-slate-400 text-xs line-through">
                                Rp {p.price.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="font-black text-slate-900 text-lg">
                              Rp {p.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* CTA */}
                        <button
                          onClick={(e) => addToCartWithAnimation(e, p)}
                          className="mt-4 w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition"
                        >
                          <ShoppingCart size={18} />
                          Tambah ke Keranjang
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CHEVRON (TETAP ADA & UPGRADE) */}
            {filtered.length > 2 && (
              <>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                  <button
                    onClick={() => emblaApi?.scrollPrev()}
                    className="ml-2 p-3 bg-white shadow-xl rounded-full hover:bg-orange-600 hover:text-white transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                </div>

                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                  <button
                    onClick={() => emblaApi?.scrollNext()}
                    className="mr-2 p-3 bg-white shadow-xl rounded-full hover:bg-orange-600 hover:text-white transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Layanan Section - UI Diperbarui */}
      <section className="px-6 pt-4 pb-8 max-w-7xl mx-auto">
        <div className="mb-10 md:mb-12">
          <span className="text-orange-500 font-bold uppercase text-sm">Layanan Bengkel</span>
          <h2 className="text-4xl font-bold mt-2">Titip Vespamu, <br/><span className="text-orange-600">Kami Urus Semuanya</span></h2>
          <p className="text-slate-500 max-w-2xl mt-3">Pilih paket servis dan tipe motor yang cocok, kami akan atur jadwalnya secara otomatis.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          {listLayanan.map((item) => {
            const selected = selectedLayanan?.title === item.title;
            return (
              <button
                key={item.title}
                suppressHydrationWarning
                onClick={() => setSelectedLayanan(item)}
                className={`p-6 rounded-3xl border-2 text-left transition-all relative shadow-sm hover:-translate-y-1 ${selected ? 'border-orange-600 bg-orange-50 text-slate-900 shadow-md' : 'border-slate-200 bg-white hover:border-orange-300'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-sm uppercase tracking-wider text-slate-500">{item.time}</span>
                  {selected && <Check className="text-orange-600" size={20} />}
                </div>
                <h3 className={`text-2xl font-bold ${selected ? 'text-orange-700' : 'text-slate-900'}`}>{item.title}</h3>
                <p className="text-sm text-slate-600 mt-3">Mulai {item.displayPrice}</p>
                <p className="text-slate-500 mt-3 text-sm">{item.title === 'Servis Rutin' ? 'Cakupan penuh mulai pengecekan, oli, dan setelan.' : item.title === 'Restorasi Total' ? 'Renovasi detail dengan upgrades kualitas tinggi.' : 'Modifikasi sesuai gaya dan performa kamu.'}</p>
              </button>
            );
          })}
        </div>

        <div className="mb-10">
          <span className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-4 block">Pilih Tipe Vespa</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {listVespa.map((item) => (
              <button
                key={item.name}
                suppressHydrationWarning
                onClick={() => setSelectedVespa(item.name)}
                className={`rounded-2xl border-2 p-4 text-left transition ${selectedVespa === item.name ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white hover:border-orange-300'}`}
              >
                <h4 className="font-semibold text-lg">{item.name}</h4>
                <p className="text-xs text-slate-500 mt-1">Multiplier {item.multiplier}x</p>
              </button>
            ))}
          </div>
        </div>

      {/* MODAL: FORM BOOKING */}
      <AnimatePresence>
        {isBookingModalOpen && (

          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]"
            >

              {/* HEADER (TIDAK IKUT SCROLL) */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">

                <div>
                  <h3 className="font-black text-2xl text-slate-900">
                    Form Booking
                  </h3>

                  <p className="text-slate-500 text-sm">
                    Tentukan jadwal kedatanganmu.
                  </p>
                </div>

                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition"
                >
                  <X size={24} />
                </button>

              </div>

              {/* BODY FORM (YANG SCROLL) */}
              <div className="overflow-y-auto p-6 space-y-4">

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

                  {/* NAMA + WA */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                        Nama
                      </label>

                      <input
                        type="text"
                        placeholder="Budi"
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                        WhatsApp
                      </label>

                      <input
                        type="tel"
                        placeholder="0812..."
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none"
                      />
                    </div>

                  </div>

                  {/* HARI + JAM */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                        Hari Kedatangan
                      </label>

                      <input
                        type="date"
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                        Jam Datang
                      </label>

                      <div className="relative">
                        <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none appearance-none">

                          {jamOperasional.map((jam) => (
                            <option key={jam} value={jam}>
                              {jam} WIB
                            </option>
                          ))}

                        </select>

                        <Clock
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                      </div>

                    </div>

                  </div>

                  {/* CARD DP */}
                  {isPayDP && selectedLayanan && (

                    <div className="bg-orange-50 border-2 border-orange-100 rounded-3xl p-5 mt-4">

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-orange-800">
                          {selectedLayanan.title}
                        </span>

                        <span className="text-[10px] font-black bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full uppercase">
                          DP 20%
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">

                        <div className="pb-3 sm:pb-0 border-b sm:border-none border-orange-200">
                          <p className="text-[10px] text-orange-600 font-bold uppercase">
                            Bayar Sekarang
                          </p>

                          <p className="text-2xl font-black text-orange-700">
                            {formatCurrency(totalHarga * 0.2)}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            Sisa Pelunasan
                          </p>

                          <p className="text-sm font-bold text-slate-600">
                            {formatCurrency(totalHarga * 0.8)}
                          </p>
                        </div>

                      </div>

                    </div>

                  )}

                  {/* BUTTON */}
                  <div className="pt-4">

                    <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-orange-600 transition flex items-center justify-center gap-3">

                      {isPayDP ? (
                        <>
                          <CreditCard size={20}/>
                          Bayar DP Sekarang
                        </>
                      ) : (
                        "Konfirmasi Booking"
                      )}

                    </button>

                  </div>

                </form>

              </div>

            </motion.div>

          </div>

        )}
      </AnimatePresence>

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
                <button onClick={openDPBooking} className="mt-3 bg-orange-600 px-8 py-2.5 rounded-xl font-bold hover:bg-orange-700 transition w-full md:w-auto text-sm cursor-pointer">Booking Sekarang</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* SECTION: ARMADA JEMPUT - Padding Top Dikurangi agar Rapat */}
      <section className="px-6 py-20 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-12 text-center">
          <span className="text-orange-500 font-bold uppercase text-sm tracking-widest">
            Pick-up Service
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-2">
            Kami Jemput Vespamu 🚚
          </h2>
          <p className="text-slate-500 mt-3">
            Tinggal isi detail, kami datang ke lokasi kamu.
          </p>
        </div>

        {/* STEP CONTAINER */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl p-6 md:p-10 space-y-10">

          {/* STEP 1 - LOKASI */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4 min-w-[180px]">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <span className="font-bold text-slate-800">Lokasi Jemput</span>
          </div>

          <div className="flex-1">
            <input
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Masukkan alamat penjemputan"
              className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-orange-500 outline-none"
            />
          </div>
        </div>

        {/* STEP 2 - WAKTU */}
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4 min-w-[180px]">
            <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <span className="font-bold text-slate-800">Waktu Jemput</span>
          </div>

          <div className="flex-1">
            <select
              value={waktu}
              onChange={(e) => setWaktu(e.target.value)}
              className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-orange-500 outline-none font-semibold"
            >
              <option value="">Pilih jam</option>
              {jamOperasional.map((jam) => (
                <option key={jam} value={jam}>
                  {jam} WIB
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* STEP 3 - ARMADA */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <span className="font-bold text-slate-800">Pilih Armada</span>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Motor Towing', icon: Bike, desc: 'Cepat & ringan' },
              { name: 'Pickup L300', icon: Truck, desc: 'Standar aman' },
              { name: 'Blind Van', icon: Car, desc: 'Premium protection' }
            ].map((armada) => {
              const selected = selectedArmada === armada.name;

              return (
                <div
                  key={armada.name}
                  onClick={() => setSelectedArmada(armada.name)}
                  className={`border-2 rounded-2xl p-5 cursor-pointer transition
                    ${selected 
                      ? 'border-orange-600 bg-orange-50 shadow-md' 
                      : 'border-slate-200 hover:border-orange-500 hover:shadow-lg'
                    }
                  `}
                >
                  <armada.icon className="text-orange-600 mb-3" size={26} />
                  <h3 className="font-bold">{armada.name}</h3>
                  <p className="text-sm text-slate-500">{armada.desc}</p>

                  {selected && (
                    <div className="mt-3 text-xs font-bold text-orange-600">
                      Dipilih ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            Estimasi konfirmasi dalam <span className="font-bold text-slate-800">5 menit</span>
          </p>

          <button
            disabled={!isPickupValid}
            className={`px-8 py-4 rounded-2xl font-bold transition
              ${isPickupValid 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            Booking Pickup
          </button>
        </div>

        </div>
      </section>

      {/* SECTION: TESTIMONI */}
      <section className="px-6 py-20 bg-white max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-orange-50 text-orange-600 font-bold text-xs uppercase tracking-widest mb-4">Pelanggan Bicara</div>
          <h2 className="text-4xl font-bold">Kata Mereka Soal <span className="text-orange-600">VesBooth</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Rizal A.', vespa: 'Vespa PX 125', text: 'Restorasi PX-ku selesai sempurna. Setiap detail diperhatiin, beneran worth it banget!', initial: 'RA' },
            { name: 'Dinda S.', vespa: 'Vespa GTS 150', text: 'Servis rutin di sini selalu oke. Mekaniknya jujur, harganya transparan. Pokoknya recommended!', initial: 'DS' },
            { name: 'Bagas K.', vespa: 'Vespa Primavera', text: 'Custom build pertamaku sukses. Konsepnya dieksekusi persis seperti yang gue mau. Grazie!', initial: 'BK' }
          ].map((review, i) => (
            <div key={i} className="p-8 rounded-3xl border border-slate-200 hover:shadow-xl transition-all bg-white">
              <div className="text-orange-400 mb-4 text-lg">★★★★★</div>
              <p className="text-slate-600 mb-8 italic">"{review.text}"</p>
              <div className="flex items-center gap-4 border-t pt-6">
                <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">{review.initial}</div>
                <div>
                  <h4 className="font-bold text-slate-800">{review.name}</h4>
                  <p className="text-xs text-slate-400">{review.vespa}</p>
                </div>
              </div>
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