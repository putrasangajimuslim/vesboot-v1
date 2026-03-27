import { useState, useRef } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, Clock, Zap, Wrench, Truck, Bike, Car, MapPin, Check, ChevronRight, ChevronLeft, ShoppingBag, CreditCard, ShoppingCart, Search, Trash2, Plus, Minus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const cartIconRef = useRef<HTMLDivElement>(null);

    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

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

    interface NavbarProps {
        cartItems: CartItem[];
    }

    const totalQty = cartItems.length;
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

    const updateQty = (id: number, delta: number) => {
        setCartItems(prev => prev.map(item => {
        if (item.id === id) {
            const newQty = Math.max(0, item.qty + delta);
            return { ...item, qty: newQty };
        }
        return item;
        }).filter(item => item.qty > 0));
    };

    return (
        <>  
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
        </>
    );
}