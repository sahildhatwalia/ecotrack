import React from 'react';

const AdBanner = ({ type = 'horizontal', className = '' }) => {
  const ads = [
    {
      id: 1,
      title: 'Switch to Solar',
      desc: 'Get 30% off on first installation. Go Green Today!',
      brand: 'SunPower',
      cta: 'Learn More',
      color: 'from-emerald-500 to-teal-600',
      logo: '☀️',
      image: '/eco-hero.png'
    },
    {
      id: 2,
      title: 'Electric Car Sale',
      desc: 'Join the revolution. Tesla Model 3 starting at $35k.',
      brand: 'Tesla',
      cta: 'View Store',
      color: 'from-slate-700 to-slate-900',
      logo: '⚡',
      image: '/ev-ad.png'
    },
    {
      id: 3,
      title: 'Plant a Tree',
      desc: 'For every $1, we plant one tree in the Amazon.',
      brand: 'OneTreePlanted',
      cta: 'Donate Now',
      color: 'from-green-600 to-emerald-800',
      logo: '🌳',
      image: '/hero.png'
    }
  ];

  const randomAd = ads[Math.floor(Math.random() * ads.length)];

  if (type === 'sidebar') {
    return (
      <div className={`mt-8 bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 ${className}`}>
        <div className="bg-slate-50 px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
          Sponsored
        </div>
        <div 
          className="p-6 min-h-[300px] flex flex-col justify-end relative overflow-hidden text-white"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.95) 50%, rgba(15, 23, 42, 0.3) 100%), url(${randomAd.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-4 border border-white/10 shadow-inner">
              {randomAd.logo}
            </div>
            <h4 className="font-extrabold text-lg mb-2 tracking-tight leading-snug">{randomAd.title}</h4>
            <p className="text-xs text-slate-200 opacity-90 mb-6 leading-relaxed font-semibold">{randomAd.desc}</p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{randomAd.brand}</span>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-wider hover-shimmer">
                {randomAd.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch ${className}`}>
      <div className="bg-slate-50 flex items-center justify-center px-4 md:px-3 py-2 md:py-0 border-b md:border-b-0 md:border-r border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest md:[writing-mode:vertical-lr] md:rotate-180">
          Sponsored
        </span>
      </div>
      <div 
        className="flex-1 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden min-h-[160px]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 40%, rgba(15, 23, 42, 0.6) 100%), url(${randomAd.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-white/10 shadow-inner">
            {randomAd.logo}
          </div>
          <div>
            <h4 className="font-extrabold text-2xl mb-1.5 tracking-tight">{randomAd.title}</h4>
            <p className="text-sm text-slate-200 leading-snug max-w-md font-semibold">{randomAd.desc}</p>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2 relative z-10 shrink-0">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl active:scale-95 transition-all tracking-wider text-xs uppercase hover-shimmer">
                {randomAd.cta}
            </button>
            <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{randomAd.brand}</span>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
