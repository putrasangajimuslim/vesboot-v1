'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const images = [
  'https://imgcdn.oto.com/medium/gallery/exterior/87/1113/vespa-primavera-91949.jpg', // Ganti dengan path gambar Anda
  'https://imgcdn.oto.com/large/gallery/exterior/87/1888/vespa-gts-slant-front-view-full-image-280222.jpg'
];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Otomatis ganti setiap 3 detik
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-[1.8rem]">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
          alt="Vespa Showroom"
        />
      </AnimatePresence>
      
      {/* Label Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-4 py-2 rounded-full font-bold text-sm">
        {index === 0 ? "Exterior Before" : "Full Build After"}
      </div>
    </div>
  );
}