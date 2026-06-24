export const getDestinationImage = (dest) => {
  if (!dest) return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200';
  const query = dest.toLowerCase();

  if (query.includes('china') || query.includes('beijing') || query.includes('shanghai') || query.includes('hong kong')) {
    return 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200';
  }
  if (query.includes('japan') || query.includes('tokyo') || query.includes('kyoto') || query.includes('osaka')) {
    return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200';
  }
  if (query.includes('france') || query.includes('paris')) {
    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200';
  }
  if (query.includes('italy') || query.includes('rome') || query.includes('venice') || query.includes('florence') || query.includes('amalfi')) {
    return 'https://images.unsplash.com/photo-1529260839382-3f772127ef71?q=80&w=1200';
  }
  if (query.includes('united states') || query.includes('usa') || query.includes('new york') || query.includes('california')) {
    return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200';
  }
  if (query.includes('united kingdom') || query.includes('uk') || query.includes('london')) {
    return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200';
  }
  if (query.includes('australia') || query.includes('sydney') || query.includes('melbourne')) {
    return 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1200';
  }
  if (query.includes('india') || query.includes('mumbai') || query.includes('delhi') || query.includes('taj mahal')) {
    return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200';
  }
  if (query.includes('egypt') || query.includes('cairo')) {
    return 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1200';
  }
  if (query.includes('turkey') || query.includes('istanbul') || query.includes('cappadocia')) {
    return 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200';
  }
  if (query.includes('greece') || query.includes('santorini') || query.includes('athens')) {
    return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200';
  }
  if (query.includes('spain') || query.includes('madrid') || query.includes('barcelona')) {
    return 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1200';
  }
  if (query.includes('switzerland') || query.includes('zurich') || query.includes('swiss')) {
    return 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200';
  }
  if (query.includes('singapore')) {
    return 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1200';
  }
  if (query.includes('thailand') || query.includes('bangkok') || query.includes('phuket')) {
    return 'https://images.unsplash.com/photo-1528181304800-2f12585c7240?q=80&w=1200';
  }
  if (query.includes('indonesia') || query.includes('bali')) {
    return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200';
  }
  if (query.includes('iceland') || query.includes('reykjavik')) {
    return 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?q=80&w=1200';
  }
  return `https://loremflickr.com/1600/900/${encodeURIComponent(dest.split(',')[0].trim())}`;
};

export const isDefaultImage = (url) => {
  if (!url) return true;
  return url.includes('photo-1469854523086') || url.includes('photo-1488646953014');
};
