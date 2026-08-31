export const excursionGallery = [
  "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&q=80",
];

export const getRandomGalleryImages = (count: number = 4): string[] => {
  const shuffled = [...excursionGallery].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};