"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Receipt, Search, Trash2, Menu, X, 
  ShoppingCart, Plus, Minus, Edit3, Check, LogOut,
  Maximize, Minimize, Droplets, IceCream, StickyNote
} from 'lucide-react';

// --- DATA PRODUK ---
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
  const [selectedSugar, setSelectedSugar] = useState<string>("Normal");
  const [selectedIce, setSelectedIce] = useState<string>("Normal");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [orderNote, setOrderNote] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => alert("Gunakan 'Add to Home Screen' untuk Fullscreen murni."));
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  const hasMultipleSizes = (p: any) => p && typeof p.prices === 'object';

  const openModal = (product: any, editData?: any) => {
    if (editData) {
      setSelectedProduct({ ...product, orderId: editData.orderId });
      setCustomQty(editData.quantity);
      setSelectedSize(editData.size);
      setSelectedSugar(editData.sugar || "Normal");
      setSelectedIce(editData.ice || "Normal");
      setSelectedToppings(editData.toppings || []);
      setOrderNote(editData.note || "");
      setIsEditing(true);
    } else {
      setSelectedProduct(product);
      setCustomQty(1);
      setSelectedSize(hasMultipleSizes(product) ? "Small" : "Regular");
      setSelectedSugar("Normal");
      setSelectedIce("Normal");
      setSelectedToppings([]);
      setOrderNote("");
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

    const orderData = {
      ...selectedProduct,
      orderId: isEditing ? selectedProduct.orderId : Date.now(),
      quantity: customQty,
      size: selectedSize,
      sugar: selectedSugar,
      ice: selectedIce,
      toppings: selectedToppings,
      note: orderNote,
      unitPrice: newUnitPrice
    };

    setCart(prev => isEditing ? prev.map(item => item.orderId === orderData.orderId ? orderData : item) : [...prev, orderData]);
    setSelectedProduct(null);
  };

  const updateCartQty = (orderId: number, delta: number) => {
    setCart(prev => prev.map(item => item.orderId === orderId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };

  const totalBill = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <div className="flex h-[100dvh] w-full bg-slate-50 overflow-hidden font-sans text-slate-900 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]">
      
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-[100] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

      {/* --- SIDEBAR KIRI --- */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white z-[110] border-r flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex flex-col h-full">
          <h1 className="font-black text-2xl text-[#4D3C2A] mb-8 tracking-tighter">Kasir Mini</h1>
          <nav className="flex-1 space-y-1">
            <button onClick={() => setActiveCategory("All")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${activeCategory === "All" ? 'bg-[#4D3C2A] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>
              <LayoutDashboard size={18}/> Menu Utama
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-50">
              <Receipt size={18}/> Riwayat
            </button>
          </nav>
          <button className="flex items-center gap-3 px-4 py-3 text-red-400 font-bold text-sm hover:bg-red-50 rounded-xl mt-auto">
            <LogOut size={18}/> Logout
          </button>
        </div>
      </aside>

      {/* --- AREA TENGAH --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <header className="p-4 lg:p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white border rounded-xl shadow-sm"><Menu size={20}/></button>
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Cari menu..." className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-none shadow-sm text-sm focus:ring-2 focus:ring-[#4D3C2A]/20 outline-none" />
            </div>
            <button onClick={toggleFullscreen} className="p-3 bg-white border text-slate-400 rounded-xl shadow-sm hover:text-[#4D3C2A] transition-colors">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-xl text-xs font-black border-2 whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-[#4D3C2A] border-[#4D3C2A] text-white shadow-md' : 'bg-white text-slate-400 border-white hover:border-slate-100'}`}>
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.filter(p => activeCategory === "All" || p.category === activeCategory).map((p) => {
              const displayPrice = typeof p.prices === 'number' ? p.prices : p.prices.Small;
              return (
                <div key={p.id} className="bg-white p-3 rounded-[32px] shadow-sm border border-slate-50 flex flex-col hover:shadow-lg transition-all">
                  <div className="aspect-square mb-3 rounded-[24px] overflow-hidden bg-slate-100"><img src={p.image} className="w-full h-full object-cover" alt="" /></div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1 truncate">{p.name}</h3>
                  <p className="text-[#4D3C2A] font-black text-xs mb-3">Rp {displayPrice.toLocaleString()}</p>
                  <button onClick={() => openModal(p)} className="w-full py-3 rounded-xl font-black text-[10px] bg-[#4D3C2A]/5 text-[#4D3C2A] border border-[#4D3C2A]/10 hover:bg-[#4D3C2A] hover:text-white transition-all">+ TAMBAH</button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* --- ORDER DETAIL (FONT DIPERBESAR) --- */}
      <aside className={`fixed lg:static inset-y-0 right-0 w-full sm:w-80 lg:w-96 bg-white border-l z-[120] transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="font-black text-xl text-slate-800 uppercase tracking-tight">Detail Pesanan</h2>
            <button onClick={() => setIsCartOpen(false)} className="lg:hidden p-2 text-slate-400 bg-slate-50 rounded-full"><X size={20}/></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 space-y-4 py-6 scrollbar-hide">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-200 opacity-60"><ShoppingCart size={40} className="mb-4" /><p className="text-sm font-bold text-slate-400">Keranjang Kosong</p></div>
            ) : (
              cart.map((item) => (
                <div key={item.orderId} className="bg-slate-50 p-5 rounded-[28px] border border-slate-100 flex flex-col shadow-sm">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      {/* Nama Menu diperbesar ke text-sm/base */}
                      <p className="font-black text-sm text-slate-800 leading-tight mb-2 uppercase">{item.name}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {/* Badge diperjelas */}
                        <span className="px-2 py-0.5 bg-white text-[#4D3C2A] text-[10px] font-black rounded-lg border border-[#4D3C2A]/20 uppercase">{item.size}</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100 uppercase">{item.sugar} Sugar</span>
                        <span className="px-2 py-0.5 bg-cyan-50 text-cyan-600 text-[10px] font-black rounded-lg border border-cyan-100 uppercase">{item.ice} Ice</span>
                      </div>
                      {item.toppings.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.toppings.map((t: string) => (<span key={t} className="text-[10px] font-bold text-slate-500 bg-white px-1.5 rounded border border-slate-100">+ {t}</span>))}
                        </div>
                      )}
                      {item.note && <p className="text-[11px] text-[#4D3C2A]/70 mt-2 font-medium italic bg-[#4D3C2A]/5 p-2 rounded-lg leading-relaxed">"{item.note}"</p>}
                    </div>
                    <button onClick={() => openModal(products.find(p => p.id === item.id), item)} className="p-2 text-slate-300 hover:text-[#4D3C2A] hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"><Edit3 size={16}/></button>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200/60">
                    <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-3 py-1 shadow-sm">
                      <button onClick={() => updateCartQty(item.orderId, -1)} className="text-slate-400 hover:text-red-500">{item.quantity === 1 ? <Trash2 size={14}/> : <Minus size={14}/>}</button>
                      <span className="text-sm font-black text-slate-800 w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQty(item.orderId, 1)} className="text-[#4D3C2A]"><Plus size={14}/></button>
                    </div>
                    {/* Harga Per Item diperbesar */}
                    <p className="font-black text-sm text-slate-800">Rp {(item.unitPrice * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-6 bg-white border-t border-dashed border-slate-200 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between items-center"><span className="font-black text-slate-400 text-[11px] uppercase tracking-wider">Total Items</span><span className="font-black text-slate-800 text-sm">{cart.reduce((a, b) => a + b.quantity, 0)} Gelas</span></div>
              <div className="flex justify-between items-center pt-2"><span className="font-black text-slate-800 text-base">TOTAL BAYAR</span><span className="font-black text-2xl text-[#4D3C2A] tracking-tighter">Rp {totalBill.toLocaleString()}</span></div>
            </div>
            <button className="w-full py-4 bg-[#4D3C2A] text-white rounded-[24px] font-black text-sm shadow-xl shadow-[#4D3C2A]/20 hover:brightness-110 transition-all active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 uppercase tracking-widest" disabled={cart.length === 0}>Konfirmasi Pesanan</button>
          </div>
        </div>
      </aside>

      {/* --- KUSTOM MODAL (FONT DIPERBESAR) --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-4">
          <div className="bg-white w-full h-[90%] lg:h-auto lg:max-h-[90vh] lg:max-w-md lg:rounded-[40px] rounded-t-[40px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-7 flex justify-between items-center border-b">
              <div>
                {/* Judul Modal diperbesar */}
                <h3 className="font-black text-xl text-slate-800 leading-tight">{isEditing ? 'Ubah Pesanan' : 'Kustomisasi Menu'}</h3>
                <p className="text-[#4D3C2A] font-bold text-sm mt-1">{selectedProduct.name}</p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:text-red-500"><X size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-7 space-y-8 scrollbar-hide">
              {/* Ukuran diperbesar */}
              {hasMultipleSizes(selectedProduct) && (
                <section>
                  <label className="block font-black text-slate-500 text-xs mb-4 uppercase tracking-[0.15em]">Pilih Ukuran Gelas</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Small", "Big"].map((size) => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`py-4 rounded-2xl font-black text-sm border-2 transition-all ${selectedSize === size ? 'border-[#4D3C2A] bg-[#4D3C2A]/5 text-[#4D3C2A] shadow-sm' : 'border-slate-50 text-slate-400 hover:border-slate-200'}`}>{size}</button>
                    ))}
                  </div>
                </section>
              )}

              {/* Gula & Es diperbesar */}
              <div className="grid grid-cols-2 gap-6 border-y border-slate-100 py-8">
                <section>
                  <label className="flex items-center gap-2 font-black text-slate-500 text-xs mb-4 uppercase tracking-widest"><Droplets size={14} className="text-blue-400"/> Gula</label>
                  <div className="flex flex-col gap-3">
                    {["Normal", "Less"].map((s) => (
                      <button key={s} onClick={() => setSelectedSugar(s)} className={`py-3.5 px-4 rounded-xl font-black text-xs border-2 text-left flex justify-between items-center ${selectedSugar === s ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-400'}`}>{s} {selectedSugar === s && <Check size={16} strokeWidth={4}/>}</button>
                    ))}
                  </div>
                </section>
                <section>
                  <label className="flex items-center gap-2 font-black text-slate-500 text-xs mb-4 uppercase tracking-widest"><IceCream size={14} className="text-cyan-400"/> Es</label>
                  <div className="flex flex-col gap-3">
                    {["Normal", "Less"].map((i) => (
                      <button key={i} onClick={() => setSelectedIce(i)} className={`py-3.5 px-4 rounded-xl font-black text-xs border-2 text-left flex justify-between items-center ${selectedIce === i ? 'border-cyan-500 bg-cyan-50 text-cyan-600' : 'border-slate-50 text-slate-400'}`}>{i} {selectedIce === i && <Check size={16} strokeWidth={4}/>}</button>
                    ))}
                  </div>
                </section>
              </div>
              
              {/* Topping diperbesar */}
              <section>
                <label className="block font-black text-slate-500 text-xs mb-4 uppercase tracking-widest">Topping Tambahan</label>
                <div className="space-y-3">
                  {toppingsData.map((t) => (
                    <div key={t.name} onClick={() => setSelectedToppings(prev => prev.includes(t.name) ? prev.filter(x => x !== t.name) : [...prev, t.name])} className={`flex justify-between items-center p-4 rounded-2xl cursor-pointer border-2 transition-all ${selectedToppings.includes(t.name) ? 'border-[#4D3C2A] bg-[#4D3C2A]/5' : 'border-slate-50 hover:border-slate-200'}`}>
                      <div className="flex flex-col">
                        <span className="font-black text-sm text-slate-700">{t.name}</span>
                        <span className="font-black text-[#4D3C2A] text-[11px] mt-0.5">+ Rp {t.price.toLocaleString()}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedToppings.includes(t.name) ? 'bg-[#4D3C2A] border-[#4D3C2A] text-white' : 'border-slate-100 bg-white'}`}>{selectedToppings.includes(t.name) && <Check size={14} strokeWidth={4} />}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Catatan diperbesar */}
              <section className="pb-4">
                <label className="flex items-center gap-2 font-black text-slate-500 text-xs mb-4 uppercase tracking-widest"><StickyNote size={14}/> Catatan</label>
                <textarea 
                  value={orderNote} 
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Ketik catatan di sini..."
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-[#4D3C2A]/40 min-h-[100px] transition-all"
                />
              </section>
            </div>

            <div className="p-7 border-t bg-white sticky bottom-0">
              <button onClick={confirmAddToCart} className="w-full py-5 bg-[#4D3C2A] text-white rounded-[24px] font-black shadow-xl uppercase tracking-widest text-xs active:scale-95 transition-all">Simpan Pesanan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}