'use client';

import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Search, ChevronDown, Camera, RotateCcw, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../components/navbar';
import FooterSection from '../components/FooterSection';

// --- INTERFACES ---
interface GalleryItem {
  id: number;
  name: string;
  category: string;
  description: string;
  src: string;
  defaultSrc: string;
  badge?: 'NEW' | 'HOT' | 'TREND';
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

// --- DATA CONSTANTS ---
const defaultGalleryItems: GalleryItem[] = [
  {
    id: 1,
    name: 'Booth Restoration',
    category: 'Restorasi',
    description: 'Booth studio dengan pencahayaan hangat dan detail Vespa yang segar.',
    src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    defaultSrc: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    badge: 'TREND',
  },
  {
    id: 2,
    name: 'Custom Chrome',
    category: 'Custom',
    description: 'Aksen chrome dan cat custom membuat Vespa tampil berbeda.',
    src: 'https://images.unsplash.com/photo-1518098268026-4e89f1aeb16d?auto=format&fit=crop&w=1200&q=80',
    defaultSrc: 'https://images.unsplash.com/photo-1518098268026-4e89f1aeb16d?auto=format&fit=crop&w=1200&q=80',
    badge: 'HOT',
  },
  {
    id: 3,
    name: 'Workshop Vibes',
    category: 'Booth',
    description: 'Suasana bengkel Vespa dengan detail peralatan dan kendaraan ready service.',
    src: 'https://images.unsplash.com/photo-1519817650390-64a93db511dc?auto=format&fit=crop&w=1200&q=80',
    defaultSrc: 'https://images.unsplash.com/photo-1519817650390-64a93db511dc?auto=format&fit=crop&w=1200&q=80',
    badge: 'NEW',
  },
  {
    id: 4,
    name: 'Retro Detail',
    category: 'Restorasi',
    description: 'Detail mesin dan aksesoris dengan nuansa retro yang premium.',
    src: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80',
    defaultSrc: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    name: 'Sunset Cruise',
    category: 'Custom',
    description: 'Vespa siap turing dengan latar sunset yang dramatis.',
    src: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=crop&w=1200&q=80',
    defaultSrc: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    name: 'Interior Booth',
    category: 'Booth',
    description: 'Ruang bengkel bersih dan modern dengan peralatan lengkap.',
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    defaultSrc: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  },
];

const categories = ['Semua', 'Restorasi', 'Custom', 'Booth'];
const sortOptions = ['Terbaru', 'Terpopuler', 'A-Z'];

export default function GalleryRoutePage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(defaultGalleryItems);
  const [filter, setFilter] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('Terbaru');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartIconRef = useRef<HTMLDivElement | null>(null);

  // --- LOGIC HANDLERS ---
  const updateQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, id: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') return;
      setGalleryItems((prev) => prev.map((item) => (item.id === id ? { ...item, src: result } : item)));
    };
    reader.readAsDataURL(file);
  };

  const resetPhoto = (id: number) => {
    setGalleryItems((prev) => prev.map((item) => (item.id === id ? { ...item, src: item.defaultSrc } : item)));
  };

  const filteredGalleryItems = useMemo(() => {
    let filtered = galleryItems.filter((item) => {
      const matchesCategory = filter === 'Semua' || item.category === filter;
      const matchesSearch = `${item.name} ${item.category} ${item.description}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sort === 'A-Z') filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'Terpopuler') filtered.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    
    return filtered;
  }, [galleryItems, filter, searchTerm, sort]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-orange-100 selection:text-orange-600">
      <Navbar 
        items={cartItems} 
        cartIconRef={cartIconRef} 
        updateQty={updateQty} 
        onOpenTrackingModal={() => {}} 
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-100/50 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
          >
            <Sparkles size={14} className="text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Visual Experience</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
            Showcase <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">Vesbooth</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg leading-relaxed">
            Eksplorasi mahakarya restorasi dan modifikasi Vespa. Ubah perspektif Anda dengan fitur kustomisasi visual kami.
          </p>
        </div>
      </section>

      {/* Toolbar - Sticky Glassmorphism */}
      <div className="sticky top-[72px] z-40 bg-white/80 backdrop-blur-md border-y border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari inspirasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pb-2 lg:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    filter === cat 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative w-full lg:w-48">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-none rounded-2xl py-3 pl-5 pr-10 text-sm font-bold text-slate-700 outline-none cursor-pointer"
              >
                {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12 min-h-[600px]">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode='popLayout'>
            {filteredGalleryItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                className="break-inside-avoid group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-orange-200 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-100"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={item.src} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Gradation */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-orange-500 text-[10px] font-black text-white shadow-lg">
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Content on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1">{item.category}</p>
                    <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                    <p className="text-slate-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="p-4 flex items-center justify-between bg-white">
                  <div className="flex gap-2">
                    <label className="p-3 rounded-2xl bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors" title="Unggah Foto">
                      <Camera size={18} />
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => handleFileChange(e, item.id)}
                      />
                    </label>
                    <button 
                      onClick={() => resetPhoto(item.id)}
                      className="p-3 rounded-2xl bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Reset Foto"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>
                  
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-transform active:scale-95 shadow-md">
                    Lihat Detail
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredGalleryItems.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex p-6 rounded-full bg-slate-50 mb-4">
              <ImageIcon size={48} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tidak ada hasil ditemukan</h3>
            <p className="text-slate-500">Coba kata kunci atau kategori lain.</p>
          </div>
        )}
      </main>

      <FooterSection />
    </div>
  );
}