"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Receipt, Search, Trash2, Menu, X, 
  ShoppingCart, Plus, Minus, Edit3, Check, LogOut,
  Maximize, Minimize 
} from 'lucide-react';

// --- DATA PRODUK (Contoh) ---
const products = [
  { id: 1, name: "Milk Tea", category: "Thai Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: { Small: 8000, Big: 12000 } },
  { id: 2, name: "Matcha", category: "Thai Series", image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=400&h=400&fit=crop", prices: { Small: 9000, Big: 13000 } },
  { id: 3, name: "Green Tea", category: "Thai Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: { Small: 9000, Big: 13000 } },
  { id: 4, name: "Milo GreenTea", category: "Thai Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: { Small: 12000, Big: 17000 } },
  { id: 5, name: "Choco Dark", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 6, name: "Mango Yakult", category: "Yakult Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: 15000 },
];

const toppingsData = [
  { name: "Boba", price: 2000 },
  { name: "Oreo", price: 2000 },
  { name: "Creamcheese", price: 4000 },
];

const categories = ["All", "Thai Series", "Yakult Series", "Official Chocolate"];

export default function TekoKopiLandscapePOS() {
  const [cart, setCart] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [customQty, setCustomQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("Small");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // --- FULLSCREEN LOGIC ---
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        alert("Gunakan 'Add to Home Screen' di iPhone untuk Fullscreen murni.");
      });
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  // --- CART LOGIC ---
  const hasMultipleSizes = (p: any) => p && typeof p.prices === 'object';

  const openModal = (product: any, editData?: any) => {
    if (editData) {
      setSelectedProduct({ ...product, orderId: editData.orderId });
      setCustomQty(editData.quantity);
      setSelectedSize(editData.size);
      setSelectedToppings(editData.toppings || []);
      setIsEditing(true);
    } else {
      setSelectedProduct(product);
      setCustomQty(1);
      setSelectedSize(hasMultipleSizes(product) ? "Small" : "Regular");
      setSelectedToppings([]);
      setIsEditing(false);
    }
  };

  const confirmAddToCart = () => {
    const basePrice = hasMultipleSizes(selectedProduct) ? selectedProduct.prices[selectedSize] : selectedProduct.prices;
    const toppingTotal = selectedToppings.reduce((sum, tName) => {
      const topping = toppingsData.find(td => td.name === tName);
      return sum + (topping ? topping.price : 0);
    }, 0);
    const newUnitPrice = basePrice + toppingTotal;

    setCart(prev => {
      if (isEditing) {
        return prev.map(item => item.orderId === selectedProduct.orderId ? { ...item, size: selectedSize, toppings: selectedToppings, quantity: customQty, unitPrice: newUnitPrice } : item);
      } else {
        const orderId = Date.now();
        return [...prev, { ...selectedProduct, orderId, quantity: customQty, size: selectedSize, toppings: selectedToppings, unitPrice: newUnitPrice }];
      }
    });
    setSelectedProduct(null);
  };

  const updateCartQty = (orderId: number, delta: number) => {
    setCart(prev => prev.map(item => item.orderId === orderId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };

  const totalBill = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <div className="flex h-[100dvh] w-full bg-slate-50 overflow-hidden font-sans text-slate-900 
      /* Penting: Handle Notch iPhone di Landscape */
      pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-[100] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

      {/* --- SIDEBAR KIRI (Navigasi) --- */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white z-[110] transition-transform duration-300 border-r border-slate-100 flex flex-col 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-black text-xl text-orange-500 tracking-tighter">TEKO KOPI</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={20}/></button>
          </div>
          
          <nav className="flex-1 space-y-1">
            <button onClick={() => setActiveCategory("All")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeCategory === "All" ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>
              <LayoutDashboard size={18}/> Menu Utama
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-50 transition-all">
              <Receipt size={18}/> Riwayat
            </button>
          </nav>

          <button className="flex items-center gap-3 px-4 py-3 text-red-400 font-bold text-sm hover:bg-red-50 rounded-xl transition-all mt-auto">
            <LogOut size={18}/> Logout
          </button>
        </div>
      </aside>

      {/* --- AREA TENGAH (Produk) --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <header className="p-4 lg:p-6 space-y-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white border border-slate-100 rounded-xl shadow-sm active:scale-95">
              <Menu size={20}/>
            </button>
            
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Cari menu..." className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20 text-sm" />
            </div>

            <button onClick={toggleFullscreen} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl shadow-sm hover:text-orange-500 transition-colors">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>

            {/* Icon Keranjang Mobile (Hanya muncul jika layar kecil) */}
            <button onClick={() => setIsCartOpen(true)} className="lg:hidden relative p-3 bg-orange-500 text-white rounded-xl shadow-lg active:scale-95">
              <ShoppingCart size={20} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-black">{cart.length}</span>}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-xl text-xs font-black transition-all border-2 ${activeCategory === cat ? 'bg-orange-500 border-orange-500 text-white shadow-md' : 'bg-white text-slate-400 border-white hover:border-slate-100'}`}>
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Grid Produk - Adaptif Landscape */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {products.filter(p => activeCategory === "All" || p.category === activeCategory).map((p) => {
              const displayPrice = typeof p.prices === 'number' ? p.prices : p.prices.Small;
              return (
                <div key={p.id} className="bg-white p-3 rounded-[32px] shadow-sm border border-slate-50 group hover:shadow-lg transition-all flex flex-col">
                  <div className="aspect-square mb-3 rounded-[24px] overflow-hidden bg-slate-100 relative">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1 truncate px-1">{p.name}</h3>
                  <p className="text-orange-500 font-black text-xs mb-3 px-1">Rp {displayPrice.toLocaleString()}</p>
                  <button onClick={() => openModal(p)} className="w-full py-3 rounded-xl font-black text-[10px] bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-500 hover:text-white transition-all active:scale-95 mt-auto">
                    + TAMBAH
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* --- ORDER DETAIL (KANAN) --- 
          Di mode Landscape layar besar (seperti Pro Max landscape), bagian ini akan menetap (Static).
      */}
      <aside className={`fixed lg:static inset-y-0 right-0 w-full sm:w-80 lg:w-96 bg-white border-l border-slate-100 z-[120] transition-transform duration-300 flex flex-col
        ${isCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        
        <div className="h-full flex flex-col pt-[max(0.5rem,env(safe-area-inset-top))]">
          <div className="p-6 flex justify-between items-center">
            <h2 className="font-black text-xl text-slate-800">Detail Pesanan</h2>
            <button onClick={() => setIsCartOpen(false)} className="lg:hidden p-2 text-slate-400 bg-slate-50 rounded-full"><X size={20}/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 space-y-3 scrollbar-hide py-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-200 py-10 opacity-60">
                <ShoppingCart size={40} className="mb-4" />
                <p className="text-xs font-bold text-slate-400">Keranjang Kosong</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.orderId} className="bg-slate-50 p-4 rounded-[24px] border border-slate-100 flex flex-col">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="font-black text-xs text-slate-800 leading-tight mb-1">{item.name}</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 bg-white text-orange-600 text-[8px] font-black rounded border border-orange-50 uppercase">{item.size}</span>
                        {item.toppings.map((t: string) => (
                          <span key={t} className="px-1.5 py-0.5 bg-white text-slate-500 text-[8px] font-bold rounded border border-slate-100 uppercase">+ {t}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => openModal(products.find(p => p.id === item.id), item)} className="p-1.5 text-slate-300 hover:text-orange-500"><Edit3 size={14}/></button>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/40">
                    <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-lg px-2 py-0.5 shadow-sm">
                      <button onClick={() => updateCartQty(item.orderId, -1)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                        {item.quantity === 1 ? <Trash2 size={12}/> : <Minus size={12}/>}
                      </button>
                      <span className="text-xs font-black text-slate-800 w-3 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQty(item.orderId, 1)} className="p-1 text-orange-500"><Plus size={12}/></button>
                    </div>
                    <p className="font-black text-xs text-slate-800 tracking-tight">Rp {(item.unitPrice * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-white border-t border-dashed border-slate-200 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-400 text-[10px]">TOTAL ITEMS</span>
                <span className="font-black text-slate-800 text-xs">{cart.reduce((a, b) => a + b.quantity, 0)} Gelas</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-800 text-sm">TOTAL BAYAR</span>
                <span className="font-black text-xl text-orange-600 tracking-tighter">Rp {totalBill.toLocaleString()}</span>
              </div>
            </div>
            
            <button className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-black text-xs shadow-xl hover:bg-orange-600 transition-all active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none uppercase tracking-widest" disabled={cart.length === 0}>
              Konfirmasi Pesanan
            </button>
          </div>
        </div>
      </aside>

      {/* --- KUSTOM MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full h-[85%] lg:h-auto lg:max-h-[90vh] lg:max-w-md lg:rounded-[40px] rounded-t-[40px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="p-6 flex justify-between items-center border-b border-slate-50">
              <h3 className="font-black text-lg text-slate-800 tracking-tight">{isEditing ? 'Ubah' : 'Kustom'} {selectedProduct.name}</h3>
              <button onClick={() => setSelectedProduct(null)} className="p-2 bg-slate-50 text-slate-400 rounded-full"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {hasMultipleSizes(selectedProduct) && (
                <div>
                  <label className="block font-black text-slate-400 text-[9px] mb-4 uppercase tracking-[0.2em]">Ukuran</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Small", "Big"].map((size) => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`py-4 rounded-2xl font-black text-xs border-2 transition-all ${selectedSize === size ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-50 text-slate-400'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className="block font-black text-slate-400 text-[9px] mb-4 uppercase tracking-[0.2em]">Topping</label>
                <div className="space-y-2">
                  {toppingsData.map((t) => (
                    <div key={t.name} onClick={() => setSelectedToppings(prev => prev.includes(t.name) ? prev.filter(x => x !== t.name) : [...prev, t.name])} 
                      className={`flex justify-between items-center p-4 rounded-2xl cursor-pointer border-2 transition-all ${selectedToppings.includes(t.name) ? 'border-orange-500 bg-orange-50' : 'border-slate-50'}`}>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-slate-700">{t.name}</span>
                        <span className="font-black text-orange-500 text-[9px]">+ Rp {t.price.toLocaleString()}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedToppings.includes(t.name) ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-100 bg-white'}`}>
                        {selectedToppings.includes(t.name) && <Check size={14} strokeWidth={4} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-slate-50/50 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pb-6">
              <button onClick={confirmAddToCart} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black shadow-lg shadow-orange-100 uppercase tracking-widest text-[10px] active:scale-95 transition-all">
                Simpan & Tambahkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}