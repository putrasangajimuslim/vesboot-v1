'use client';

export default function TestimonialSection() {
  const reviews = [
    { name: 'Rizal A.', vespa: 'Vespa PX 125', text: 'Restorasi PX-ku selesai sempurna. Setiap detail diperhatiin, beneran worth it banget!', initial: 'RA' },
    { name: 'Dinda S.', vespa: 'Vespa GTS 150', text: 'Servis rutin di sini selalu oke. Mekaniknya jujur, harganya transparan. Pokoknya recommended!', initial: 'DS' },
    { name: 'Bagas K.', vespa: 'Vespa Primavera', text: 'Custom build pertamaku sukses. Konsepnya dieksekusi persis seperti yang gue mau. Grazie!', initial: 'BK' }
  ];

  return (
    <section className="px-6 py-20 bg-white max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-1 rounded-full bg-orange-50 text-orange-600 font-bold text-xs uppercase tracking-widest mb-4">Pelanggan Bicara</div>
        <h2 className="text-4xl font-bold">Kata Mereka Soal <span className="text-orange-600">VesBooth</span></h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((review, i) => (
          <div key={i} className="p-8 rounded-3xl border border-slate-200 hover:shadow-xl transition-all bg-white">
            <div className="text-orange-400 mb-4 text-lg">★★★★★</div>
            <p className="text-slate-600 mb-8 italic">"{review.text}"</p>
            <div className="flex items-center gap-4 border-t pt-6">
              <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">{review.initial}</div>
              <div>
                <h4 className="font-bold text-slate-800">{review.name}</h4>
                <p className="text-xs text-slate-400">{review.vespa}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
