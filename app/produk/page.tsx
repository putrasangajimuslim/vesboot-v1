'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import Navbar from '../components/navbar';
import ProductPage from '../components/ProductPage';
import FooterSection from '../components/FooterSection';

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

export default function ProdukRoutePage() {
  const [filter, setFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('Terbaru');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const cartIconRef = useRef<HTMLDivElement>(null);

  const products: Product[] = [
    {
      id: 1,
      name: 'Karburator PE28 Racing',
      price: 385000,
      label: 'Sale',
      disc: 10,
      category: 'Mesin',
      description: 'Karburator racing untuk power maksimal, cocok untuk Vespa PX & Sprint.',
      stock: 'Stok Tersedia',
      badge: 'SALE',
    },
    {
      id: 2,
      name: 'Knalpot Leo Vince Classic',
      price: 1250000,
      label: 'Hot',
      disc: 0,
      category: 'Mesin',
      description: 'Knalpot after-market dengan suara khas dan performa optimal.',
      stock: 'Stok Tersedia',
      badge: 'HOT',
    },
    {
      id: 3,
      name: 'Spion Bulat Chrome Retro',
      price: 145000,
      label: 'Aksesoris',
      disc: 0,
      category: 'Aksesoris',
      description: 'Spion bundar chrome style retro, cocok untuk semua seri Vespa klasik.',
      stock: 'Stok Tersedia',
    },
    {
      id: 4,
      name: 'Body Panel Vespa Sprint',
      price: 875000,
      label: 'New',
      disc: 0,
      category: 'Body',
      description: 'Panel bodi OEM replacement berkualitas tinggi, anti karat.',
      stock: 'Stok Tersedia',
      badge: 'NEW',
    },
    {
      id: 5,
      name: 'Set Filter Udara Premium',
      price: 275000,
      label: 'Kualitas',
      disc: 5,
      category: 'Kelistrikan',
      description: 'Filter udara premium untuk aliran lebih stabil dan respons mesin lebih baik.',
      stock: 'Stok Tersedia',
    },
    {
      id: 6,
      name: 'Oli Vespa SAE 20W-50',
      price: 99000,
      label: 'Oli & Cairan',
      disc: 0,
      category: 'Oli & Cairan',
      description: 'Oli mesin Vespa khusus dengan aditif anti aus untuk mesin halus.',
      stock: 'Stok Tersedia',
    },
  ];

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = filter === 'Semua' || product.category === filter;
      const searchTerms = searchQuery.toLowerCase().trim().split(' ').filter(Boolean);
      const matchesSearch = searchTerms.every((term) =>
        product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
      );
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'Harga Terendah') return a.price - b.price;
      if (sortOrder === 'Populer') return (b.disc || 0) - (a.disc || 0);
      return b.id - a.id;
    });

  const updateQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const addToCartWithAnimation = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { ...product, qty: 1 }];
    });

    const button = e.currentTarget as HTMLElement;
    const cartIcon = cartIconRef.current;

    if (cartIcon && button) {
      const btnRect = button.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      const flyEl = document.createElement('div');
      flyEl.className = 'fixed z-[9999] bg-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold pointer-events-none';
      flyEl.style.left = `${btnRect.left + btnRect.width / 2}px`;
      flyEl.style.top = `${btnRect.top}px`;
      flyEl.innerText = '+1';
      document.body.appendChild(flyEl);

      flyEl.animate(
        [
          { transform: 'scale(1)', opacity: 1 },
          { transform: `translate(${cartRect.left - btnRect.left}px, ${cartRect.top - btnRect.top}px) scale(0.2)`, opacity: 0 },
        ],
        { duration: 800, easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)' }
      ).onfinish = () => flyEl.remove();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <Navbar
        items={cartItems}
        cartIconRef={cartIconRef}
        updateQty={updateQty}
        onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
      />

      <AnimatePresence>
        {isTrackingModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-lg">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-[3rem] p-8 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-2xl">Lacak Servis</h3>
                <button onClick={() => setIsTrackingModalOpen(false)}><X /></button>
              </div>
              <div className="relative">
                <input type="text" placeholder="Masukkan ID Order..." className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none" />
              </div>
              <p className="text-xs text-slate-400 mt-4 font-bold text-center">Contoh: #VB-2026-001</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ProductPage
        products={filteredProducts}
        filter={filter}
        search={searchQuery}
        sort={sortOrder}
        onFilterChange={setFilter}
        onSearchChange={setSearchQuery}
        onSortChange={setSortOrder}
        addToCartWithAnimation={addToCartWithAnimation}
      />

      <FooterSection />
    </main>
  );
}
