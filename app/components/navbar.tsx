import { useState, type RefObject } from 'react';
import { Menu, X, Zap, Truck, Bike, Car, Check, ChevronRight, ShoppingCart, Plus, Minus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface NavbarProps {
  items: CartItem[];
  cartIconRef: RefObject<HTMLDivElement | null>;
  updateQty: (id: number, delta: number) => void;
  onOpenTrackingModal: () => void;
}

export default function Navbar({ items, cartIconRef, updateQty, onOpenTrackingModal }: NavbarProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalQty = items.length;
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <nav className="fixed w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-orange-200">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900">VESBOOTH</h1>
        </div>

        <div className="hidden md:flex gap-8 font-bold text-slate-500 text-sm">
          {[
            { label: 'Home', href: '/' },
            { label: 'Produk', href: '/produk' },
            { label: 'Bengkel', href: '/#bengkel' },
            { label: 'Gallery', href: '/gallery' }
          ].map((link) => (
            <a key={link.label} href={link.href} className="hover:text-orange-600 transition">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
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
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="fixed top-[85px] right-6 w-80 bg-white shadow-2xl rounded-[2rem] p-6 z-[90]"
                >
                  {totalQty === 0 ? (
                    <p className="text-slate-400 font-bold text-center py-10">Keranjang masih kosong.</p>
                  ) : (
                    <>
                      <p className="font-black text-sm mb-4">({totalQty}) produk yang dipilih</p>
                      <div className="space-y-4 mb-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm font-bold pb-2">
                            <div className="flex flex-col">
                              <span>{item.name}</span>
                              <span className="text-orange-600">Rp {item.price.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateQty(item.id, -1)} className="p-1 bg-slate-100 rounded-lg cursor-pointer">
                                <Minus size={14} />
                              </button>
                              <span>{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="p-1 bg-slate-100 rounded-lg cursor-pointer">
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 font-black flex justify-between text-lg">
                        <span>Total</span>
                        <span>Rp {totalPrice.toLocaleString()}</span>
                      </div>
                      <button className="w-full mt-4 bg-orange-600 text-white py-3 rounded-2xl font-black cursor-pointer">
                        Checkout Sekarang
                      </button>
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

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-slate-200 p-6 flex flex-col gap-4 shadow-xl font-bold"
          >
            {[
              { label: 'Home', href: '/' },
              { label: 'Produk', href: '/produk' },
              { label: 'Bengkel', href: '/#bengkel' },
              { label: 'Gallery', href: '/gallery' },
              { label: 'Blog', href: '/#blog' },
              { label: 'Kontak', href: '/#kontak' }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-700 hover:text-orange-600 py-2"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 block">
                Quick Access
              </span>
              <button
                onClick={() => {
                  onOpenTrackingModal();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2 text-white bg-slate-900 px-6 py-5 rounded-2xl font-black"
              >
                <div className="flex items-center gap-3"> Lacak Status Servis</div>
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
