'use client';
import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import Navbar from './components/navbar';
import HeroSection from './components/HeroSection';
import TrackingSection from './components/TrackingSection';
import FeaturesGrid from './components/FeaturesGrid';
import ProductCatalog from './components/ProductCatalog';
import ServiceSection from './components/ServiceSection';
import PickupSection from './components/PickupSection';
import TestimonialSection from './components/TestimonialSection';
import PaymentMethods from './components/PaymentMethods';
import FooterSection from './components/FooterSection';
import BookingModal from './components/BookingModal';

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
  description: string;
  stock: string;
  badge?: 'SALE' | 'HOT' | 'NEW';
}

interface CartItem extends Product {
  qty: number;
}

interface AddOn {
  id: string;
  title: string;
  price: number;
}

export default function Home() {
  const [alamat, setAlamat] = useState("");
  const [waktu, setWaktu] = useState("");
  const [selectedArmada, setSelectedArmada] = useState<string | null>(null);
  const [filter, setFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("Terbaru");
  const [selectedVespa, setSelectedVespa] = useState<string | null>(null);
  const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(null);
  const [totalHarga, setTotalHarga] = useState<number>(0);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // Modal Form Booking
  const [isPayDP, setIsPayDP] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const cartIconRef = useRef<HTMLDivElement>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Solusi Hydration: Memastikan komponen sudah termuat di client
  const [hasMounted, setHasMounted] = useState(false);

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
    { title: 'Custom Build', price: 2000000, displayPrice: 'Rp.2.000.000', time: '3-7 Hari' },
    { title: 'Body Repair & Cat', price: 450000, displayPrice: 'Rp.450.000', time: '5-7 Hari' },
    { title: 'Upgrade Performa', price: 500000, displayPrice: 'Rp.500.000', time: '2-3 Hari' },
    { title: 'Listrik & Sistem', price: 150000, displayPrice: 'Rp.150.000', time: '2-3 Hari' }
  ];

  const optionalAddOns: AddOn[] = [
    { id: 'motul', title: 'Oli Motul Premium', price: 95000 },
    { id: 'filter', title: 'Ganti Filter Udara', price: 75000 },
    { id: 'busi', title: 'Ganti Busi NGK Iridium', price: 85000 },
    { id: 'ban', title: 'Ganti Ban (per pcs)', price: 280000 },
    { id: 'lampu', title: 'Upgrade Lampu LED', price: 320000 },
    { id: 'alarm', title: 'Pasang Alarm', price: 450000 }
  ];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Daftar jam operasional 09:00 - 18:00
  const jamOperasional = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  const products: Product[] = [
    {
      id: 1,
      name: "Karburator PE28 Racing",
      price: 385000,
      label: "Sale",
      disc: 10,
      category: "Mesin",
      description: "Karburator racing untuk power maksimal, cocok untuk Vespa PX & Sprint.",
      stock: "Stok Tersedia",
      badge: 'SALE',
    },
    {
      id: 2,
      name: "Knalpot Leo Vince Classic",
      price: 1250000,
      label: "Hot",
      disc: 0,
      category: "Mesin",
      description: "Knalpot after-market dengan suara rada merah khas dan performa optimal.",
      stock: "Stok Tersedia",
      badge: 'HOT',
    },
    {
      id: 3,
      name: "Spion Bulat Chrome Retro",
      price: 145000,
      label: "Aksesoris",
      disc: 0,
      category: "Aksesoris",
      description: "Spion bundar chrome style retro, cocok untuk semua seri Vespa klasik.",
      stock: "Stok Tersedia",
    },
    {
      id: 4,
      name: "Body Panel Vespa Sprint",
      price: 875000,
      label: "New",
      disc: 0,
      category: "Body",
      description: "Panel bodi OEM replacement berkualitas tinggi, anti karat.",
      stock: "Stok Tersedia",
      badge: 'NEW',
    },
    {
      id: 5,
      name: "Set Filter Udara Premium",
      price: 275000,
      label: "Kualitas",
      disc: 5,
      category: "Kelistrikan",
      description: "Filter udara premium untuk aliran lebih stabil dan respons mesin lebih baik.",
      stock: "Stok Tersedia",
    },
    {
      id: 6,
      name: "Oli Vespa SAE 20W-50",
      price: 99000,
      label: "Oli & Cairan",
      disc: 0,
      category: "Oli & Cairan",
      description: "Oli mesin Vespa khusus dengan aditif anti aus untuk mesin halus.",
      stock: "Stok Tersedia",
    },
  ];

  const filtered = products
    .filter((product) => {
      const matchesCategory = filter === 'Semua' || product.category === filter;
      const matchesSearch = searchQuery
        .toLowerCase()
        .split(' ')
        .every((term) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'Harga Terendah') {
        return a.price - b.price;
      }
      if (sortOrder === 'Harga Tertinggi') {
        return b.price - a.price;
      }
      if (sortOrder === 'Populer') {
        return (b.disc || 0) - (a.disc || 0);
      }
      return a.id - b.id;
    });

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

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addOnTotal = selectedAddOnIds.reduce((sum, id) => {
    const item = optionalAddOns.find((addOn) => addOn.id === id);
    return sum + (item?.price ?? 0);
  }, 0);

  const totalHargaWithAddOns = totalHarga + addOnTotal;

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

  const isPickupValid = Boolean(alamat && waktu && selectedArmada);

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <Navbar
        items={cartItems}
        cartIconRef={cartIconRef}
        updateQty={updateQty}
        onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
      />

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

      <HeroSection hasMounted={hasMounted} onBookingClick={openGeneralBooking} />

      <TrackingSection trackingId={trackingId} setTrackingId={setTrackingId} onTrack={handleTracking} trackingData={trackingData} />

      <FeaturesGrid />

      <ProductCatalog filtered={filtered} filter={filter} onFilterChange={setFilter} emblaRef={emblaRef} emblaApi={emblaApi} addToCartWithAnimation={addToCartWithAnimation} />

      <ServiceSection
        listLayanan={listLayanan}
        selectedLayanan={selectedLayanan}
        onSelectLayanan={setSelectedLayanan}
        listVespa={listVespa}
        selectedVespa={selectedVespa}
        onSelectVespa={setSelectedVespa}
        totalHarga={totalHargaWithAddOns}
        optionalAddOns={optionalAddOns}
        selectedAddOnIds={selectedAddOnIds}
        onToggleAddOn={toggleAddOn}
        onBookingClick={openDPBooking}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        isPayDP={isPayDP}
        selectedLayanan={selectedLayanan}
        totalHarga={totalHargaWithAddOns}
        jamOperasional={jamOperasional}
      />

      <PickupSection
        alamat={alamat}
        setAlamat={setAlamat}
        waktu={waktu}
        setWaktu={setWaktu}
        selectedArmada={selectedArmada}
        setSelectedArmada={setSelectedArmada}
        jamOperasional={jamOperasional}
        isPickupValid={isPickupValid}
      />

      <TestimonialSection />

      <PaymentMethods />

      <FooterSection />
    </main>
  );
}