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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alamat, setAlamat] = useState("");
  const [waktu, setWaktu] = useState("09:00");
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

    // Animasi Terbang (Visual Feedback)
    const button = e.currentTarget as HTMLElement;
    const cartIcon = cartIconRef.current;
    if (cartIcon && button) {
      const btnRect = button.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      const flyEl = document.createElement("div");
      flyEl.style.position = "fixed";
      flyEl.style.left = `${btnRect.left}px`;
      flyEl.style.top = `${btnRect.top}px`;
      flyEl.style.zIndex = "9999";
      flyEl.style.background = "#ea580c";
      flyEl.style.padding = "10px";
      flyEl.style.borderRadius = "50%";
      flyEl.style.color = "white";
      flyEl.innerText = "+";
      document.body.appendChild(flyEl);
      
      flyEl.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: `scale(0.2) translate(${cartRect.left - btnRect.left}px, ${cartRect.top - btnRect.top}px)`, opacity: 0 }], 
        { duration: 800, easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)' }).onfinish = () => flyEl.remove();
    }
  };

  const totalQty = cartItems.length;
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

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
             {/* Ikon Keranjang dengan ref */}
            <div ref={cartIconRef} onClick={() => setIsCartOpen(!isCartOpen)} className="bg-slate-100 p-3 rounded-2xl relative hover:bg-orange-600 hover:text-white transition cursor-pointer group">
              <div className="group-hover:scale-110 transition">
                <ShoppingCart size={22} />
                {totalQty > 0 && <motion.span initial={{scale:0}} animate={{scale:1}} className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">{totalQty}</motion.span>}
              </div>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full"
                  >{cartCount}</motion.span>
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

        {/* CART DRAWER */}
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
                        <button onClick={() => updateQty(item.id, -1)} className="p-1 bg-slate-100 rounded-lg"><Minus size={14}/></button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1 bg-slate-100 rounded-lg"><Plus size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 font-black flex justify-between text-lg">
                  <span>Total</span><span>Rp {totalPrice.toLocaleString()}</span>
                </div>
                <button className="w-full mt-4 bg-orange-600 text-white py-3 rounded-2xl font-black hover:bg-slate-900 transition">Checkout Sekarang</button>
              </>
            )}
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="description">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Pilihan <span className="text-orange-600">Slay</span></h2>
              <p className="text-slate-500">Upgrade performa dan visual Vespamu sekarang.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              {["Semua", "Oli", "Aksesoris", "Knalpot"].map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setFilter(cat)} 
                  className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                    filter === cat ? 'bg-slate-900 text-white' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              {/* items-stretch: Memastikan semua card memiliki tinggi yang sama */}
              <div className="flex gap-6 pb-6 items-stretch"> 
                {filtered.map((p) => {
                  const discPrice = p.price - (p.price * ((p.disc || 0) / 100));
                  return (
                    <div 
                      key={p.id} 
                      /* w-[280px]: lebar tetap | flex-shrink-0: tidak akan menyusut | flex-col & justify-between: mensejajarkan tombol bawah */
                      className="w-[280px] md:w-[300px] flex-shrink-0 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-48 bg-slate-100 rounded-2xl mb-4 relative overflow-hidden">
                          {p.label && <div className="absolute top-4 left-4 px-3 py-1 bg-orange-600 text-white text-[10px] font-black rounded-full uppercase">{p.label}</div>}
                          {(p.disc || 0) > 0 && (
                            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black">
                              -{p.disc}%
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-lg leading-snug">{p.name}</h4>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div>
                          {p.disc > 0 ? (
                            <>
                              <span className="font-black text-orange-600 block text-sm">Rp {discPrice.toLocaleString()}</span>
                              <span className="text-slate-400 text-[10px] line-through">Rp {p.price.toLocaleString()}</span>
                            </>
                          ) : (
                            <span className="font-black text-slate-900 text-sm">Rp {p.price.toLocaleString()}</span>
                          )}
                        </div>
                        <motion.button 
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => addToCartWithAnimation(e, p)} 
                          className="bg-slate-900 text-white p-4 rounded-full hover:bg-orange-600 transition"
                        >
                          <ShoppingBag size={20} />
                        </motion.button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {filtered.length > 2 && (
              <div className="flex justify-end gap-4 mt-8">
                <button onClick={() => emblaApi?.scrollPrev()} className="p-4 rounded-full border-2 border-slate-200 bg-white outline-none hover:bg-slate-100 cursor-pointer"><ChevronLeft size={20}/></button>
                <button onClick={() => emblaApi?.scrollNext()} className="p-4 rounded-full border-2 border-slate-200 bg-white outline-none hover:bg-slate-100 cursor-pointer"><ChevronRight size={20}/></button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Layanan Section - Padding Bottom Dikurangi */}
      <section className="px-6 pt-4 pb-8 max-w-7xl mx-auto">
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

      {/* MODAL: FORM BOOKING */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-black text-2xl text-slate-900">Form Booking</h3>
                  <p className="text-slate-500 text-sm">Tentukan jadwal kedatanganmu.</p>
                </div>
                <button onClick={() => setIsBookingModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={24}/></button>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nama</label>
                    <input type="text" placeholder="Budi" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">WhatsApp</label>
                    <input type="tel" placeholder="0812..." className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition" />
                  </div>
                </div>

                {/* INPUT HARI & JAM */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Hari Kedatangan</label>
                    <div className="relative">
                      <input type="date" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition text-sm text-slate-600" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Jam Datang</label>
                    <div className="relative">
                      <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition text-sm text-slate-600 appearance-none">
                        {jamOperasional.map((jam) => (
                          <option key={jam} value={jam}>{jam} WIB</option>
                        ))}
                      </select>
                      <Clock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {isPayDP && selectedLayanan && (
                  <div className="bg-orange-50 border-2 border-orange-100 rounded-3xl p-5 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-orange-800">{selectedLayanan.title}</span>
                      <span className="text-[10px] font-black bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full uppercase">DP 20%</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-orange-600 font-bold uppercase">Bayar Sekarang</p>
                        <p className="text-2xl font-black text-orange-700">{formatCurrency(totalHarga * 0.2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Sisa Pelunasan</p>
                        <p className="text-sm font-bold text-slate-600">{formatCurrency(totalHarga * 0.8)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-orange-600 transition shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]">
                    {isPayDP ? <><CreditCard size={20}/> Bayar DP Sekarang</> : 'Konfirmasi Booking'}
                  </button>
                </div>
              </form>
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