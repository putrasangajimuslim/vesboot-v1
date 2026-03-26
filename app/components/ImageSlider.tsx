'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const images = [
  'https://imgcdn.oto.com/medium/gallery/exterior/87/1113/vespa-primavera-91949.jpg',
  'https://imgcdn.oto.com/large/gallery/exterior/87/1888/vespa-gts-slant-front-view-full-image-280222.jpg'
];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-[1.8rem] bg-slate-100">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full object-cover"
          alt="Vespa Showroom"
        />
      </AnimatePresence>
      
      {/* Label Overlay - Teks Tipis & Clean */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
        <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 md:px-5 md:py-2 rounded-xl shadow-sm border border-white/40">
          <span className="text-[11px] md:text-xs font-medium tracking-widest text-slate-700 uppercase">
            {index === 0 ? "Exterior Before" : "Full Build After"}
          </span>
        </div>
      </div>

      {/* Indikator Slide Minimalis */}
      <div className="absolute bottom-5 right-6 flex gap-1">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-4 bg-blue-600' : 'w-1 bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  );
}