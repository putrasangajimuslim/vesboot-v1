"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, Receipt, Search, Trash2, Menu, X, 
  ShoppingCart, Plus, Minus, Edit3, Check, LogOut
} from 'lucide-react';

// --- DATA PRODUK ---
const products = [
  { id: 1, name: "Milk Tea", category: "Thai Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: { Small: 8000, Big: 12000 } },
  { id: 2, name: "Matcha", category: "Thai Series", image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=400&h=400&fit=crop", prices: { Small: 9000, Big: 13000 } },
  { id: 1, name: "Green Tea", category: "Thai Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: { Small: 9000, Big: 13000 } },
  { id: 1, name: "Milo GreenTea", category: "Thai Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: { Small: 12000, Big: 17000 } },
  { id: 1, name: "Choco GreenTea", category: "Thai Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: { Small: 12000, Big: 17000 } },
  { id: 1, name: "Ovaltine GreenTea", category: "Thai Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: { Small: 8000, Big: 12000 } },
  { id: 1, name: "Thai Tea", category: "Thai Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: { Small: 8000, Big: 12000 } },
  { id: 1, name: "Milo Thai Tea", category: "Thai Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: { Small: 11000, Big: 16000 } },
  { id: 1, name: "Choco Thai Tea", category: "Thai Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: { Small: 11000, Big: 16000 } },
  { id: 1, name: "Ovaltine Thai Tea", category: "Thai Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: { Small: 11000, Big: 16000 } },
  { id: 5, name: "Choco Dark", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 5, name: "Choco Milo", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 5, name: "Choco Oreo", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 5, name: "Choco Royal", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 5, name: "Choco Cookies", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 5, name: "Choco Chees", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 5, name: "Choco Almond", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 5, name: "Choco Caramel", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 5, name: "Choco Ovaltine", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 5, name: "Choco Hazelnut", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 5, name: "Choco Tiramisu", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 5, name: "Choco Silverqueen", category: "Official Chocolate", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: { Small: 14000, Big: 14000 } },
  { id: 6, name: "Mango Yakult", category: "Yakult Series", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop", prices: 15000 },
  { id: 7, name: "Lychee Yakult", category: "Yakult Series", image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=400&h=400&fit=crop", prices: 15000 },
  { id: 8, name: "Stawberry Yakult", category: "Yakult Series", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&h=400&fit=crop", prices: 15000 },
  { id: 9, name: "Peach Yakult", category: "Yakult Series", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&h=400&fit=crop", prices: 15000 },
];

const toppingsData = [
  { name: "Popping Boba", price: 4000 },
  { name: "Oreo", price: 2000 },
  { name: "Boba", price: 2000 },
  { name: "Creamcheese", price: 4000 },
  { name: "Coconut Jelly", price: 3000 },
];

const categories = ["All", "Espresso", "Thai Series", "Yakult Series", "NgeTeh", "Smoothies", "Fruit", "Official Chocolate", "Fresh Milk Brown Sugar", "Coffe"];

export default function TekoKopiFinal() {
  const [cart, setCart] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [customQty, setCustomQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("Small");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const hasMultipleSizes = (product: any) => product && typeof product.prices === 'object';

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
        const sortedToppings = [...selectedToppings].sort();
        const existingIdx = prev.findIndex(item => item.id === selectedProduct.id && item.size === selectedSize && JSON.stringify([...item.toppings].sort()) === JSON.stringify(sortedToppings));
        if (existingIdx > -1) {
          const newCart = [...prev];
          newCart[existingIdx].quantity += customQty;
          return newCart;
        } else {
          const orderId = Date.now();
          return [...prev, { ...selectedProduct, orderId, quantity: customQty, size: selectedSize, toppings: selectedToppings, unitPrice: newUnitPrice }];
        }
      }
    });
    setSelectedProduct(null);
  };

  const updateCartQty = (orderId: number, delta: number) => {
    setCart(prev => prev.map(item => item.orderId === orderId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };

  const totalBill = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* --- LEFT SIDEBAR --- */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white z-[70] transition-transform duration-300 border-r ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8 px-2">
            <h1 className="font-black text-2xl text-orange-500 tracking-tighter">TEKO KOPI</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={20}/></button>
          </div>
          <nav className="flex-1 space-y-1">
            <button onClick={() => setActiveCategory("All")} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeCategory === "All" ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
              <LayoutDashboard size={20}/> Menu Utama
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"><Receipt size={20}/> History</button>
          </nav>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        <header className="p-4 lg:p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white border rounded-2xl shadow-sm"><Menu size={24}/></button>
            <div className="flex-1 max-w-lg relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input type="text" placeholder="Cari menu..." className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <button onClick={() => setIsCartOpen(true)} className="lg:hidden relative p-3.5 bg-orange-500 text-white rounded-2xl shadow-lg">
              <ShoppingCart size={22} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-black">{cart.length}</span>}
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100'}`}>
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {products.filter(p => activeCategory === "All" || p.category === activeCategory).map((p) => {
              const displayPrice = typeof p.prices === 'number' ? p.prices : p.prices.Small;
              return (
                <div key={p.id} className="bg-white p-3 lg:p-4 rounded-[32px] shadow-sm border border-slate-50 group hover:shadow-md transition-all">
                  <div className="aspect-square mb-4 rounded-[24px] overflow-hidden bg-slate-100">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm lg:text-base truncate px-1">{p.name}</h3>
                  <p className="text-orange-500 font-black text-xs lg:text-sm mb-4 px-1">Rp {displayPrice.toLocaleString()}</p>
                  <button onClick={() => openModal(p)} className="w-full py-3.5 rounded-2xl font-black text-xs lg:text-sm bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-500 hover:text-white transition-all active:scale-95">
                    + TAMBAH
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* --- PERBAIKAN ORDER DETAIL (KANAN) --- */}
      <aside className={`fixed lg:static inset-y-0 right-0 w-full sm:w-85 lg:w-96 bg-white border-l z-[80] transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        {/* Container Utama menggunakan Flex Column h-full */}
        <div className="h-full flex flex-col">
          
          {/* Header (Fixed) */}
          <div className="p-6 lg:p-8 flex justify-between items-center border-b lg:border-none">
            <div>
              <h2 className="font-black text-2xl text-slate-800 tracking-tight">Order Detail</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Meja #01 • Kasir 01</p>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="lg:hidden p-2 text-slate-400 bg-slate-50 rounded-full"><X size={24}/></button>
          </div>
          
          {/* List Pesanan (Scrollable & Flex Grow) */}
          <div className="flex-1 overflow-y-auto px-6 lg:px-8 space-y-4 scrollbar-hide py-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-200 opacity-60">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart size={40} />
                </div>
                <p className="font-bold text-sm text-slate-400">Belum ada pesanan</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.orderId} className="bg-slate-50 p-4 rounded-[24px] border border-slate-100 hover:border-orange-200 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[13px] text-slate-800 leading-tight truncate">{item.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.size !== "Regular" && (
                          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[8px] font-black rounded uppercase">{item.size}</span>
                        )}
                        {item.toppings.map((t: string) => (
                          <span key={t} className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[8px] font-bold rounded uppercase">+ {t}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => openModal(products.find(p => p.id === item.id), item)} className="p-1.5 text-slate-300 hover:text-orange-500 transition-all"><Edit3 size={14}/></button>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/50">
                    <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-lg p-0.5 shadow-sm">
                      <button onClick={() => updateCartQty(item.orderId, -1)} className="p-1 text-slate-400 hover:bg-slate-50 rounded-md">
                        {item.quantity === 1 ? <Trash2 size={12} className="text-red-400"/> : <Minus size={12}/>}
                      </button>
                      <span className="text-xs font-black w-3 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQty(item.orderId, 1)} className="p-1 text-orange-500 hover:bg-orange-50 rounded-md"><Plus size={12}/></button>
                    </div>
                    <p className="font-black text-sm text-slate-800 tracking-tight">Rp {(item.unitPrice * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Billing (Fixed di bawah dengan gradien jika perlu) */}
          <div className="p-6 lg:p-8 bg-white border-t border-dashed space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                <span>Total Item</span>
                <span>{cart.reduce((a, b) => a + b.quantity, 0)} Gelas</span>
              </div>
              <div className="flex justify-between items-center px-1 py-1">
                <span className="font-black text-slate-800 text-xs">TOTAL BAYAR</span>
                <span className="font-black text-2xl text-orange-600 tracking-tighter">Rp {totalBill.toLocaleString()}</span>
              </div>
            </div>
            
            <button className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-black shadow-xl shadow-slate-200 hover:bg-orange-600 transition-all active:scale-95 disabled:bg-slate-100 disabled:text-slate-300" disabled={cart.length === 0}>
              KONFIRMASI PESANAN
            </button>
          </div>
        </div>
      </aside>

      {/* --- KUSTOM MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full h-full lg:h-auto lg:max-h-[85vh] lg:max-w-md lg:rounded-[32px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-6 flex justify-between items-center bg-white border-b border-slate-50">
              <h3 className="font-black text-xl text-slate-800">{isEditing ? 'Ubah Pesanan' : 'Kustom Minuman'}</h3>
              <button onClick={() => setSelectedProduct(null)} className="p-2 bg-slate-50 text-slate-400 rounded-full"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {hasMultipleSizes(selectedProduct) && (
                <div>
                  <label className="block font-black text-slate-400 text-[10px] mb-4 uppercase tracking-[0.2em]">Ukuran</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Small", "Big"].map((size) => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`py-5 rounded-[20px] font-black border-2 transition-all ${selectedSize === size ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block font-black text-slate-400 text-[10px] mb-4 uppercase tracking-[0.2em]">Topping</label>
                <div className="space-y-2 pb-4">
                  {toppingsData.map((t) => (
                    <div key={t.name} onClick={() => setSelectedToppings(prev => prev.includes(t.name) ? prev.filter(x => x !== t.name) : [...prev, t.name])} className={`flex justify-between items-center p-4 rounded-[20px] cursor-pointer border-2 transition-all ${selectedToppings.includes(t.name) ? 'border-orange-500 bg-orange-50' : 'border-slate-50'}`}>
                      <div className="flex flex-col">
                        <span className="font-bold text-[13px] text-slate-700">{t.name}</span>
                        <span className="font-black text-orange-500 text-[10px]">+ Rp {t.price.toLocaleString()}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${selectedToppings.includes(t.name) ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-200 bg-white'}`}>
                        {selectedToppings.includes(t.name) && <Check size={14} strokeWidth={4} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-slate-50">
              <button onClick={confirmAddToCart} className="w-full py-4 bg-orange-500 text-white rounded-[18px] font-black shadow-lg shadow-orange-100 uppercase tracking-widest text-xs">
                {isEditing ? 'Simpan Perubahan' : 'Selesai & Tambahkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}