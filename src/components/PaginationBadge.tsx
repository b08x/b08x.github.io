import React from 'react';

interface PaginationBadgeProps {
  current: number;
  total: number;
}

const PaginationBadge: React.FC<PaginationBadgeProps> = ({ current, total }) => {
  return (
    <div className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-50">
      <div className="border border-white/20 bg-black/40 backdrop-blur-md px-4 py-2 rounded-sm font-mono text-[10px] md:text-xs tracking-widest text-white/60 uppercase flex items-center gap-3">
        <span className="text-white/40">SLIDE_STDS</span>
        <div className="w-[1px] h-3 bg-white/10" />
        <span className="text-white">{current} / {total}</span>
      </div>
    </div>
  );
};

export default PaginationBadge;
