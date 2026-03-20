export default function BengkelPage() {
  return (
    <main className="pt-32 pb-20 bg-slate-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-3">
            Bengkel Partner VESBOOTH
          </h1>

          <p className="text-slate-500 max-w-xl">
            Temukan bengkel partner terpercaya untuk servis dan pemasangan
            produk Vesbooth di kota Anda.
          </p>
        </div>

        {/* GRID BENGKEL */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* CARD BENGKEL */}
          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">

            <h3 className="font-black text-lg mb-2">
              Vesbooth Garage Jakarta
            </h3>

            <p className="text-sm text-slate-500 mb-4">
              Jl. Sudirman No.12 Jakarta
            </p>

            <div className="flex justify-between items-center">

              <span className="text-orange-600 font-bold text-sm">
                Buka 09:00 - 18:00
              </span>

              <button className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
                Lihat Lokasi
              </button>

            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">

            <h3 className="font-black text-lg mb-2">
              Vesbooth Garage Bandung
            </h3>

            <p className="text-sm text-slate-500 mb-4">
              Jl. Dago No.45 Bandung
            </p>

            <div className="flex justify-between items-center">

              <span className="text-orange-600 font-bold text-sm">
                Buka 09:00 - 17:00
              </span>

              <button className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
                Lihat Lokasi
              </button>

            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">

            <h3 className="font-black text-lg mb-2">
              Vesbooth Garage Surabaya
            </h3>

            <p className="text-sm text-slate-500 mb-4">
              Jl. Ahmad Yani No.21 Surabaya
            </p>

            <div className="flex justify-between items-center">

              <span className="text-orange-600 font-bold text-sm">
                Buka 10:00 - 19:00
              </span>

              <button className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
                Lihat Lokasi
              </button>

            </div>
          </div>

        </div>

      </div>

    </main>
  )
}