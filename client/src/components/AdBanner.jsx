import React from 'react';

const AdBanner = ({ type = 'horizontal', className = '' }) => {
  const ads = [
    {
      id: 1,
      title: 'Switch to Solar',
      desc: 'Get 30% off on first installation. Go Green Today!',
      brand: 'SunPower',
      cta: 'Learn More',
      color: 'from-orange-400 to-orange-600',
      logo: '☀️'
    },
    {
      id: 2,
      title: 'Electric Car Sale',
      desc: 'Join the revolution. Tesla Model 3 starting at $35k.',
      brand: 'Tesla',
      cta: 'View Store',
      color: 'from-slate-700 to-slate-900',
      logo: '⚡'
    },
    {
      id: 3,
      title: 'Plant a Tree',
      desc: 'For every $1, we plant one tree in the Amazon.',
      brand: 'OneTreePlanted',
      cta: 'Donate Now',
      color: 'from-emerald-700 to-teal-800',
      logo: '🌳'
    }
  ];

  const randomAd = ads[Math.floor(Math.random() * ads.length)];

  if (type === 'sidebar') {
    return (
      <div className={`mt-8 bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 ${className}`}>
        <div className="bg-neutral-50 px-4 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100">
          Sponsored
        </div>
        <div className={`p-6 bg-gradient-to-br ${randomAd.color} text-white`}>
          <div className="text-3xl mb-4">{randomAd.logo}</div>
          <h4 className="font-bold text-lg mb-2">{randomAd.title}</h4>
          <p className="text-sm opacity-80 mb-6 leading-relaxed">{randomAd.desc}</p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-tighter opacity-60">{randomAd.brand}</span>
            <button className="bg-white text-neutral-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">
              {randomAd.cta}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col md:flex-row items-stretch ${className}`}>
      <div className="bg-neutral-50 flex items-center justify-center px-4 md:px-2 py-2 md:py-0 border-b md:border-b-0 md:border-r border-neutral-100">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest md:[writing-mode:vertical-lr] md:rotate-180">
          Sponsored
        </span>
      </div>
      <div className={`flex-1 p-6 bg-gradient-to-r ${randomAd.color} text-white flex flex-col md:flex-row items-center justify-between gap-6`}>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shrink-0">
            {randomAd.logo}
          </div>
          <div>
            <h4 className="font-bold text-xl mb-1">{randomAd.title}</h4>
            <p className="text-sm opacity-80 leading-snug max-w-md">{randomAd.desc}</p>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
            <button className="bg-white text-neutral-900 px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-neutral-50 active:scale-95 transition-all">
                {randomAd.cta}
            </button>
            <span className="text-[10px] font-bold tracking-tighter opacity-60 uppercase">{randomAd.brand}</span>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
