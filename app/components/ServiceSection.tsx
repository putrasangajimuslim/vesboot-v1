'use client';

import { Check } from 'lucide-react';

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

export default function ServiceSection({ listLayanan, selectedLayanan, onSelectLayanan, listVespa, selectedVespa, onSelectVespa, totalHarga, optionalAddOns, selectedAddOnIds, onToggleAddOn, onBookingClick }: ServiceSectionProps) {
  return (
    <section className="px-6 pt-4 pb-8 max-w-7xl mx-auto">
      <div className="mb-10 md:mb-12">
        <span className="text-orange-500 font-bold uppercase text-sm">Layanan Bengkel</span>
        <h2 className="text-4xl font-bold mt-2">
          Titip Vespamu, <br /><span className="text-orange-600">Kami Urus Semuanya</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mt-3">Pilih paket servis dan tipe motor yang cocok, kami akan atur jadwalnya secara otomatis.</p>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
          <span className="font-black text-orange-500">1.</span>
          <span>Tipe Vespa</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listVespa.map((item) => {
            const selected = selectedVespa === item.name;
            return (
              <button
                key={item.name}
                onClick={() => onSelectVespa(item.name)}
                className={`rounded-3xl border p-5 text-left transition ${selected ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-slate-200 bg-white hover:border-orange-300'} `}
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className={`text-base font-semibold ${selected ? 'text-orange-700' : 'text-slate-900'}`}>{item.name}</h4>
                  {selected && <Check className="text-orange-600" size={20} />}
                </div>
                <p className="mt-3 text-sm text-slate-500">{item.multiplier > 1 ? `+${Math.round((item.multiplier - 1) * 100)}% dari harga dasar` : 'Harga dasar'}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
          <span className="font-black text-orange-500">2.</span>
          <span>Pilih Layanan</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listLayanan.map((item) => {
            const selected = selectedLayanan?.title === item.title;
            return (
              <button
                key={item.title}
                onClick={() => onSelectLayanan(item)}
                className={`rounded-3xl border p-5 text-left transition ${selected ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-slate-200 bg-white hover:border-orange-300'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className={`text-lg font-bold ${selected ? 'text-orange-700' : 'text-slate-900'}`}>{item.title}</h3>
                  {selected && <Check className="text-orange-600" size={20} />}
                </div>
                <p className="mt-3 text-sm text-slate-500">{item.displayPrice}</p>
                <p className="mt-3 text-sm text-slate-400">{item.title === 'Servis Rutin' ? 'Cakupan penuh mulai pengecekan, oli, dan setelan.' : item.title === 'Restorasi Total' ? 'Renovasi detail dengan upgrades kualitas tinggi.' : item.title === 'Custom Build' ? 'Modifikasi sesuai gaya dan performa kamu.' : item.title === 'Body Repair & Cat' ? 'Perbaikan bodi plus pengecatan profesional.' : item.title === 'Upgrade Performa' ? 'Maksimalkan tenaga dan respons mesin.' : 'Perbaikan kelistrikan dan sistem motor.'}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
          <span className="font-black text-orange-500">3.</span>
          <span>Tambahan (Opsional)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {optionalAddOns.map((item) => {
            const active = selectedAddOnIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onToggleAddOn(item.id)}
                className={`rounded-3xl border p-5 text-left transition ${active ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-slate-200 bg-white hover:border-orange-300'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className={`text-sm font-semibold ${active ? 'text-orange-700' : 'text-slate-900'}`}>{item.title}</h4>
                  {active && <Check className="text-orange-600" size={18} />}
                </div>
                <p className="mt-3 text-sm text-slate-500">+{formatCurrency(item.price)}</p>
              </button>
            );
          })}
        </div>
      </div>

      {selectedVespa && selectedLayanan && (
        <div className="mb-8">
          <div className="rounded-[2.25rem] border border-slate-800 bg-slate-900/95 p-5 shadow-2xl shadow-slate-950/30 sm:p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-slate-400">
                  Estimasi Total
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-[0.35em] mb-1">{selectedVespa}</p>
                  <h3 className="text-2xl font-black text-white sm:text-3xl">{selectedLayanan.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Estimasi biaya untuk layanan {selectedLayanan.title} pada tipe Vespa {selectedVespa}. Harga akan menyesuaikan dengan pilihan armada dan jadwal Anda.</p>
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-slate-950 border border-slate-800 p-5 text-white shadow-[0_24px_64px_-24px_rgba(15,23,42,0.8)] sm:p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total estimasi biaya</p>
                <p className="mt-4 text-3xl font-black text-orange-400 sm:text-4xl">{formatCurrency(totalHarga)}</p>
                <button
                  onClick={onBookingClick}
                  className="mt-5 w-full rounded-3xl bg-orange-500 px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-950 transition hover:bg-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-300"
                >
                  Booking Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
