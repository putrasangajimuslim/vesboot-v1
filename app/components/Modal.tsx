'use client';

import { type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, children, className = '' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div className={`bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh] ${className}`} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
