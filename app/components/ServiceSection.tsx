'use client';

import { Bolt, Check, Paintbrush, Sparkles, Wrench } from 'lucide-react';

interface Layanan {
  title: string;
  price: number;
  displayPrice: string;
  time: string;
}

interface VespaType {
  name: string;
  multiplier: number;
}

interface AddOn {
  id: string;
  title: string;
  price: number;
}

interface ServiceSectionProps {
  listLayanan: Layanan[];
  selectedLayanan: Layanan | null;
  onSelectLayanan: (item: Layanan) => void;
  listVespa: VespaType[];
  selectedVespa: string | null;
  onSelectVespa: (name: string) => void;
  totalHarga: number;
  optionalAddOns: AddOn[];
  selectedAddOnIds: string[];
  onToggleAddOn: (id: string) => void;
  onBookingClick: () => void;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

const getServiceIcon = (title: string) => {
  switch (title) {
    case 'Servis Rutin':
      return <Sparkles size={18} className="text-orange-500" />;
    case 'Restorasi Total':
      return <Paintbrush size={18} className="text-orange-500" />;
    case 'Custom Build':
      return <Wrench size={18} className="text-orange-500" />;
    case 'Body Repair & Cat':
      return <Paintbrush size={18} className="text-orange-500" />;
    case 'Upgrade Performa':
      return <Bolt size={18} className="text-orange-500" />;
    default:
      return <Sparkles size={18} className="text-orange-500" />;
  }
};

export default function ServiceSection({ listLayanan, selectedLayanan, onSelectLayanan, listVespa, selectedVespa, onSelectVespa, totalHarga, optionalAddOns, selectedAddOnIds, onToggleAddOn, onBookingClick }: ServiceSectionProps) {
  return (
    <section className="px-6 py-8 max-w-5xl mx-auto space-y-10">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-orange-500 font-semibold">Layanan Bengkel</p>
        <h2 className="text-3xl font-semibold text-slate-900">Pilih layanan Vespa dengan cepat dan simpel.</h2>
        <p className="text-sm text-slate-500">Tentukan tipe, paket servis, dan tambahan tanpa ribet. Harga otomatis tampil saat pilihan lengkap.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">1</span>
          <p className="text-sm font-medium text-slate-800">Pilih tipe Vespa</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {listVespa.map((item) => {
            const selected = selectedVespa === item.name;
            return (
              <button
                key={item.name}
                onClick={() => onSelectVespa(item.name)}
                className={`rounded-3xl border p-3 text-left transition ${selected ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-400'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${selected ? 'text-orange-700' : 'text-slate-900'}`}>{item.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.multiplier > 1 ? `+${Math.round((item.multiplier - 1) * 100)}% dari harga dasar` : 'Harga dasar'}</p>
                  </div>
                  <span className="flex h-5 w-5 items-center justify-center text-orange-600">
                    {selected ? <Check size={18} /> : null}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">2</span>
          <p className="text-sm font-medium text-slate-800">Pilih paket layanan</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {listLayanan.map((item) => {
            const selected = selectedLayanan?.title === item.title;
            return (
              <button
                key={item.title}
                onClick={() => onSelectLayanan(item)}
                className={`rounded-3xl border p-3 text-left transition ${selected ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-400'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-orange-500">
                      {getServiceIcon(item.title)}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${selected ? 'text-orange-700' : 'text-slate-900'}`}>{item.title}</p>
                      <p className="text-[10px] text-slate-500">{item.displayPrice}</p>
                    </div>
                  </div>
                  <span className="flex h-5 w-5 items-center justify-center text-orange-600">
                    {selected ? <Check size={18} /> : null}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">3</span>
          <p className="text-sm font-medium text-slate-800">Pilih tambahan</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {optionalAddOns.map((item) => {
            const active = selectedAddOnIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onToggleAddOn(item.id)}
                className={`rounded-3xl border p-3 text-left transition ${active ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-400'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className={`text-xs font-semibold ${active ? 'text-orange-700' : 'text-slate-900'}`}>{item.title}</p>
                    <p className="text-[10px] text-slate-500">+{formatCurrency(item.price)}</p>
                  </div>
                  <span className="flex h-5 w-5 items-center justify-center text-orange-600">
                    {active ? <Check size={18} /> : null}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedVespa && selectedLayanan && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Estimasi Total</p>
              <p className="mt-2 text-3xl font-bold text-orange-400">{formatCurrency(totalHarga)}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onBookingClick}
                className="rounded-3xl bg-orange-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-950 transition hover:bg-orange-400"
              >
                Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
