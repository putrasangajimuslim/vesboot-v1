'use client';

import { type Dispatch, type SetStateAction, type ChangeEvent, type MouseEvent } from 'react';
import { Search, ChevronDown, ShoppingCart } from 'lucide-react';

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

interface ProductPageProps {
  products: Product[];
  filter: string;
  search: string;
  sort: string;
  onFilterChange: Dispatch<SetStateAction<string>>;
  onSearchChange: (value: string) => void;
  onSortChange: Dispatch<SetStateAction<string>>;
  addToCartWithAnimation: (e: MouseEvent<HTMLButtonElement>, product: Product) => void;
}

const categories = ['Semua', 'Mesin', 'Body', 'Kelistrikan', 'Aksesoris', 'Oli & Cairan'];
const sortOptions = ['Terbaru', 'Populer', 'Harga Terendah'];

export default function ProductPage({
  products,
  filter,
  search,
  sort,
  onFilterChange,
  onSearchChange,
  onSortChange,
  addToCartWithAnimation,
}: ProductPageProps) {
  return (
    <section id="produk" className="bg-[#F8FAFC]">
      
      {/* --- 1. BAGIAN HEADER (HILANG SAAT DI-SCROLL) --- */}
      <div className="pt-24 pb-12 px-6">
        <div className="text-center max-w-7xl mx-auto px-4 sm:px-0">
          <span className="inline-flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-orange-600 bg-orange-100 rounded-full font-black">
            SPAREPART & AKSESORIS
          </span>
          <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
            Produk <span className="text-orange-600">Pilihan</span>
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-slate-500 leading-6">
            Part original dan aftermarket premium untuk semua seri Vespa. Kualitas terjamin.
          </p>
        </div>
      </div>

      {/* --- 2. DIV STICKY (MENEMPEL DI ATAS SAAT SCROLL) --- */}
      {/* top-0 karena diasumsikan navbar utama juga sticky, jika tidak, pasang top-0 */}
      {/* background solid agar konten di bawahnya tidak tembus */}
      <div className="sticky top-0 z-30 bg-[#F8FAFC] border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col gap-3">
          
          {/* Baris 1: Search & Sortir */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search Input */}
            <label className="relative flex-grow block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari produk..."
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </label>

            {/* Sort Dropdown */}
            <div className="relative min-w-[160px]">
              <select
                value={sort}
                onChange={(event) => onSortChange(event.target.value)}
                className="w-full appearance-none rounded-full border border-slate-200 bg-white py-3 pl-5 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          {/* Baris 2: Filter Kategori (Scrollable Horizontal) */}
          <div className="overflow-x-auto pb-1 no-scrollbar">
            <div className="flex gap-2.5 min-w-[max-content]">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => onFilterChange(category)}
                  className={`rounded-full px-4 py-2.5 text-xs font-bold transition whitespace-nowrap ${
                    filter === category 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* --- 3. BAGIAN PRODUK (SCROLLABLE) --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="mb-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Menampilkan {products.length} Produk
        </div>

        {/* Grid Produk - Minimalis */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => {
            const discPrice = product.price - (product.price * (product.disc / 100));
            
            return (
              <div 
                key={product.id} 
                className="group flex flex-col bg-white border border-slate-100 rounded-3xl p-3 transition-all duration-300 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5"
              >
                {/* Gambar Produk */}
                <div className="relative aspect-square rounded-2xl bg-slate-50 overflow-hidden mb-3.5">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-white/20 opacity-60" />
                  
                  {product.badge && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="bg-orange-600 text-[9px] font-black text-white px-2.5 py-1 rounded-full uppercase tracking-tighter">
                        {product.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Produk */}
                <div className="flex-grow px-1">
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest leading-none">
                      {product.category}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 leading-none">
                      {product.stock}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                </div>

                {/* Harga & Tombol */}
                <div className="mt-4 px-1 flex items-end justify-between gap-3">
                  <div>
                    {product.disc > 0 && (
                      <p className="text-[10px] text-slate-400 line-through font-medium leading-none mb-1">
                        Rp {product.price.toLocaleString()}
                      </p>
                    )}
                    <p className="text-sm font-black text-slate-950 leading-none">
                      Rp {discPrice.toLocaleString()}
                    </p>
                  </div>
                  
                  <button 
                    onClick={(e) => addToCartWithAnimation(e, product)}
                    className="flex-shrink-0 bg-slate-900 text-white p-2.5 rounded-xl transition-all hover:bg-orange-600 active:scale-95"
                    aria-label={`Tambah ${product.name} ke keranjang`}
                  >
                    <ShoppingCart size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}