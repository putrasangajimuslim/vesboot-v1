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
    <section id="produk" className="pt-24 pb-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="sticky top-[85px] z-30 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 shadow-sm pb-4 mb-4">
          <div className="text-center mb-8 pt-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-orange-600 bg-orange-100 rounded-full font-black">
              SPAREPART & AKSESORIS
            </span>
            <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
              Produk <span className="text-orange-600">Pilihan</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm text-slate-500 leading-7">
              Part original dan aftermarket premium untuk semua seri Vespa. Kualitas terjamin, harga bersahabat.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <label className="relative w-full md:max-w-md block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
                placeholder="Cari produk..."
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>

            <div className="w-full md:max-w-xs">
              <label className="block text-xs font-bold uppercase tracking-[0.35em] text-slate-500 mb-2">
                Urutkan
              </label>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => onSortChange(event.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4 overflow-x-auto pb-2 no-scrollbar">
            <div className="flex gap-3 min-w-[max-content]">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => onFilterChange(category)}
                  className={`rounded-full px-5 py-2 text-xs font-bold transition whitespace-nowrap ${filter === category ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4 text-sm text-slate-500">
          Menampilkan {products.length} produk. Geser kategori ke samping untuk menemukan filter yang sesuai.
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            const discPrice = product.price - (product.price * (product.disc / 100));
            return (
              <div key={product.id} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-xl">
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100" />
                  {product.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-orange-600 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white font-black shadow-lg">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col h-full justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.35em] text-orange-600 font-bold">{product.category}</span>
                    <h3 className="mt-4 text-lg font-black text-slate-900 leading-tight">{product.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{product.description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      {product.disc > 0 ? (
                        <>
                          <p className="text-lg font-black text-orange-600">Rp {discPrice.toLocaleString()}</p>
                          <p className="text-[11px] text-slate-400 line-through">Rp {product.price.toLocaleString()}</p>
                        </>
                      ) : (
                        <p className="text-lg font-black text-slate-900">Rp {product.price.toLocaleString()}</p>
                      )}
                      <p className="mt-1 text-[10px] text-slate-400 uppercase tracking-[0.35em]">{product.stock}</p>
                    </div>
                    <button
                      onClick={(e) => addToCartWithAnimation(e, product)}
                      className="rounded-full bg-slate-900 p-3 text-white transition hover:bg-orange-600"
                      aria-label={`Tambah ${product.name} ke keranjang`}
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
