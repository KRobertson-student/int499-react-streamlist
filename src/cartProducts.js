const productImage = (title, subtitle, accent, background) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
      <rect width="320" height="220" rx="18" fill="${background}" />
      <rect x="40" y="38" width="240" height="144" rx="18" fill="#ffffff" stroke="${accent}" stroke-width="4" />
      <rect x="66" y="68" width="188" height="18" rx="9" fill="${accent}" opacity="0.9" />
      <rect x="66" y="106" width="136" height="12" rx="6" fill="#94a3b8" />
      <rect x="66" y="132" width="92" height="12" rx="6" fill="#cbd5e1" />
      <rect x="214" y="120" width="40" height="32" rx="8" fill="${accent}" opacity="0.18" />
      <path d="M224 136h20M234 126v20" stroke="${accent}" stroke-width="6" stroke-linecap="round" />
      <text x="160" y="202" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" font-weight="800" fill="#172033">${title}</text>
      <text x="160" y="27" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="${accent}">${subtitle}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const products = [
  {
    id: 1,
    category: 'subscription',
    service: 'Basic Subscription',
    serviceInfo: 'For one user',
    price: 4.99,
    img: productImage('Basic', 'Subscription', '#1267ce', '#eaf3ff'),
  },
  {
    id: 2,
    category: 'subscription',
    service: 'Gold Subscription',
    serviceInfo: 'Share with family',
    price: 9.99,
    img: productImage('Gold', 'Subscription', '#b7791f', '#fff7ed'),
  },
  {
    id: 3,
    category: 'subscription',
    service: 'Premium Subscription',
    serviceInfo: 'Share with the world',
    price: 12.99,
    img: productImage('Premium', 'Subscription', '#047857', '#ecfdf5'),
  },
  {
    id: 4,
    category: 'subscription',
    service: 'Social Media Sharing Subscription',
    serviceInfo: 'Share your list',
    price: 2.99,
    img: productImage('Social', 'Sharing', '#7c3aed', '#f5f3ff'),
  },
  {
    id: 5,
    category: 'accessory',
    service: 'EZ Tech T-Shirt',
    serviceInfo: 'Show your list to the world',
    price: 25.99,
    img: productImage('T-Shirt', 'Accessory', '#db2777', '#fdf2f8'),
  },
  {
    id: 6,
    category: 'accessory',
    service: 'EZ Techplosion',
    serviceInfo: 'Share your list with all',
    price: 25.99,
    img: productImage('Techplosion', 'Accessory', '#ea580c', '#fff7ed'),
  },
  {
    id: 7,
    category: 'accessory',
    service: 'EZ Techmerizing',
    serviceInfo: 'Techmerize your friends',
    price: 25.99,
    img: productImage('Techmerizing', 'Accessory', '#0f766e', '#f0fdfa'),
  },
  {
    id: 8,
    category: 'accessory',
    service: 'EZ Tech Case',
    serviceInfo: 'Mesmerize your friends',
    price: 20.99,
    img: productImage('Case', 'Accessory', '#475569', '#f8fafc'),
  },
];

export default products;
