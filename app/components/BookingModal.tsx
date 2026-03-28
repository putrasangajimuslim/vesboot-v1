'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Clock, CreditCard, X } from 'lucide-react';
import Modal from './Modal';

interface Layanan {
  title: string;
  price: number;
  displayPrice: string;
  time: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPayDP: boolean;
  selectedLayanan: Layanan | null;
  totalHarga: number;
  jamOperasional: string[];
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

export default function BookingModal({ isOpen, onClose, isPayDP, selectedLayanan, totalHarga, jamOperasional }: BookingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-black text-2xl text-slate-900">Form Booking</h3>
                <p className="text-slate-500 text-sm">Tentukan jadwal kedatanganmu.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nama</label>
                    <input type="text" placeholder="Budi" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">WhatsApp</label>
                    <input type="tel" placeholder="0812..." className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Hari Kedatangan</label>
                    <input type="date" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Jam Datang</label>
                    <div className="relative">
                      <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none appearance-none">
                        {jamOperasional.map((jam) => (
                          <option key={jam} value={jam}>{jam} WIB</option>
                        ))}
                      </select>
                      <Clock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>

                {isPayDP && selectedLayanan && (
                  <div className="bg-orange-50 border-2 border-orange-100 rounded-3xl p-5 mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-orange-800">{selectedLayanan.title}</span>
                      <span className="text-[10px] font-black bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full uppercase">DP 40%</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
                      <div className="pb-3 sm:pb-0 border-b sm:border-none border-orange-200">
                        <p className="text-[10px] text-orange-600 font-bold uppercase">Bayar Sekarang</p>
                        <p className="text-2xl font-black text-orange-700">{formatCurrency(totalHarga * 0.4)}</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Sisa Pelunasan</p>
                        <p className="text-sm font-bold text-slate-600">{formatCurrency(totalHarga * 0.6)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-orange-600 transition flex items-center justify-center gap-3">
                    {isPayDP ? (
                      <>
                        <CreditCard size={20} />
                        Bayar DP Sekarang
                      </>
                    ) : (
                      'Konfirmasi Booking'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}
