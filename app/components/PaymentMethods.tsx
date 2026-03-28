'use client';

export default function PaymentMethods() {
  return (
    <section className="px-6 py-10 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h4 className="font-bold text-slate-800 text-sm">Metode Pembayaran</h4>
          <p className="text-xs text-slate-500">Transaksi aman & terpercaya.</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
          <span className="font-black text-xl tracking-tighter" style={{ color: '#0060AA' }}>BCA</span>
          <span className="font-black text-xl tracking-tighter" style={{ color: '#F68B1F' }}>BNI</span>
          <span className="font-bold text-white px-2 py-0.5 rounded text-xs tracking-wider" style={{ backgroundColor: '#4E2A84' }}>OVO</span>
          <span className="font-black text-lg tracking-tighter" style={{ color: '#00ADEF' }}>GoPay</span>
          <div className="border border-slate-300 px-2 py-0.5 rounded shadow-sm">
            <span className="font-black text-black text-xs tracking-tighter uppercase">QRIS</span>
          </div>
          <span className="font-bold text-lg tracking-tighter" style={{ color: '#005197' }}>mandiri</span>
        </div>
      </div>
    </section>
  );
}
