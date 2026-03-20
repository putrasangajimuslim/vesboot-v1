import { useEffect, useState, useCallback, useRef } from 'react';
import { Menu, X, Zap, ChevronRight, ShoppingCart, Plus, Minus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from "next/link"


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

export default function Navbar() {
const [isCartOpen, setIsCartOpen] = useState(false);
const cartIconRef = useRef<HTMLDivElement>(null);
const [cartItems, setCartItems] = useState<CartItem[]>([]);
const totalQty = cartItems.length;
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  return (
   <nav className="fixed w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-7xl mx-auto">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center rotate-3">
            <span className="text-white font-black">V</span>
          </div>

          <h1 className="text-2xl font-black tracking-tighter text-slate-900">
            VESBOOTH
          </h1>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-8 font-bold text-slate-500 text-sm">
          <Link href="/" className="hover:text-orange-600 transition">
            Home
          </Link>

          <Link href="/produk" className="hover:text-orange-600 transition">
            Produk
          </Link>

          <Link href="/bengkel" className="hover:text-orange-600 transition">
            Bengkel
          </Link>

          <Link href="/gallery" className="hover:text-orange-600 transition">
            Gallery
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden p-2 text-slate-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-6 flex flex-col gap-4 font-bold">

          <Link href="/" onClick={()=>setIsMenuOpen(false)}>
            Home
          </Link>

          <Link href="/produk" onClick={()=>setIsMenuOpen(false)}>
            Produk
          </Link>

          <Link href="/bengkel" onClick={()=>setIsMenuOpen(false)}>
            Bengkel
          </Link>

          <Link href="/gallery" onClick={()=>setIsMenuOpen(false)}>
            Gallery
          </Link>
        </div>
      )}
    </nav>
  )
}