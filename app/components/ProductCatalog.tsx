'use client';

import { type Dispatch, type SetStateAction, type MouseEvent } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

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

interface ProductCatalogProps {
  filtered: Product[];
  filter: string;
  onFilterChange: Dispatch<SetStateAction<string>>;
  emblaRef: any;
  emblaApi: any;
  addToCartWithAnimation: (e: MouseEvent<HTMLButtonElement>, product: Product) => void;
}

export default function ProductCatalog({ filtered, filter, onFilterChange, emblaRef, emblaApi, addToCartWithAnimation }: ProductCatalogProps) {
  const categories = ["Semua", "Oli", "Aksesoris", "Knalpot"];

  return (
    <section className="pt-16 pb-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-2">
              Pilihan <span className="text-orange-600">Slay</span>
            </h2>
            <p className="text-slate-500">Upgrade performa dan visual Vespamu sekarang.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onFilterChange(cat)}
                className={`px-6 py-2 cursor-pointer rounded-full text-sm font-bold whitespace-nowrap transition ${filter === cat ? 'bg-slate-900 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 pb-6 items-stretch">
              {filtered.map((p) => {
                const discPrice = p.price - (p.price * ((p.disc || 0) / 100));

                return (
                  <div
                    key={p.id}
                    className="group w-[280px] md:w-[300px] flex-shrink-0 bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="relative h-52 bg-slate-100 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-100 group-hover:scale-110 transition duration-500" />
                      {p.label && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-white text-[10px] font-bold rounded-full">
                          {p.label}
                        </div>
                      )}
                      {p.disc > 0 && (
                        <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow">
                          -{p.disc}%
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button className="bg-white text-black px-4 py-2 rounded-xl font-bold">Lihat Detail</button>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <h4 className="font-bold text-lg leading-snug group-hover:text-orange-600 transition">{p.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{p.category}</p>
                      </div>
                      <div className="mt-4">
                        {p.disc > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="font-black text-orange-600 text-lg">Rp {discPrice.toLocaleString()}</span>
                            <span className="text-slate-400 text-xs line-through">Rp {p.price.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="font-black text-slate-900 text-lg">Rp {p.price.toLocaleString()}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => addToCartWithAnimation(e, p)}
                        className="mt-4 w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition cursor-pointer"
                      >
                        <ShoppingCart size={18} />
                        Tambah ke Keranjang
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {filtered.length > 2 && (
            <>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={() => emblaApi?.scrollPrev()}
                  className="ml-2 p-3 bg-white cursor-pointer shadow-xl rounded-full hover:bg-orange-600 hover:text-white transition"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={() => emblaApi?.scrollNext()}
                  className="mr-2 p-3 bg-white shadow-xl rounded-full hover:bg-orange-600 hover:text-white transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
