'use client';

import { Bike, Truck, Car } from 'lucide-react';

interface PickupSectionProps {
  alamat: string;
  setAlamat: (value: string) => void;
  waktu: string;
  setWaktu: (value: string) => void;
  selectedArmada: string | null;
  setSelectedArmada: (value: string) => void;
  jamOperasional: string[];
  isPickupValid: boolean;
}

export default function PickupSection({ alamat, setAlamat, waktu, setWaktu, selectedArmada, setSelectedArmada, jamOperasional, isPickupValid }: PickupSectionProps) {
  return (
    <section className="px-6 pt-4 pb-8 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <span className="text-orange-500 font-bold uppercase text-sm tracking-widest">Pick-up Service</span>
        <h2 className="text-3xl md:text-4xl font-extrabold mt-2">Kami Jemput Vespamu 🚚</h2>
        <p className="text-slate-500 mt-3">Tinggal isi detail, kami datang ke lokasi kamu.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl p-6 md:p-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4 min-w-[180px]">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <span className="font-bold text-slate-800">Lokasi Jemput</span>
          </div>
          <div className="flex-1">
            <input
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Masukkan alamat penjemputan"
              className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-orange-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4 min-w-[180px]">
            <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold">2</div>
            <span className="font-bold text-slate-800">Waktu Jemput</span>
          </div>
          <div className="flex-1">
            <select
              value={waktu}
              onChange={(e) => setWaktu(e.target.value)}
              className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-orange-500 outline-none font-semibold"
            >
              <option value="">Pilih jam</option>
              {jamOperasional.map((jam) => (
                <option key={jam} value={jam}>{jam} WIB</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold">3</div>
            <span className="font-bold text-slate-800">Pilih Armada</span>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Motor Towing', icon: Bike, desc: 'Cepat & ringan' },
              { name: 'Pickup L300', icon: Truck, desc: 'Standar aman' },
              { name: 'Blind Van', icon: Car, desc: 'Premium protection' }
            ].map((armada) => {
              const selected = selectedArmada === armada.name;
              const Icon = armada.icon;

              return (
                <div
                  key={armada.name}
                  onClick={() => setSelectedArmada(armada.name)}
                  className={`border-2 rounded-2xl p-5 cursor-pointer transition ${selected ? 'border-orange-600 bg-orange-50 shadow-md' : 'border-slate-200 hover:border-orange-500 hover:shadow-lg'}`}
                >
                  <Icon className="text-orange-600 mb-3" size={26} />
                  <h3 className="font-bold">{armada.name}</h3>
                  <p className="text-sm text-slate-500">{armada.desc}</p>
                  {selected && <div className="mt-3 text-xs font-bold text-orange-600">Dipilih ✓</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">Estimasi konfirmasi dalam <span className="font-bold text-slate-800">5 menit</span></p>
          <button
            disabled={!isPickupValid}
            className={`px-8 py-4 rounded-2xl font-bold transition ${isPickupValid ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            Booking Pickup
          </button>
        </div>
      </div>
    </section>
  );
}
