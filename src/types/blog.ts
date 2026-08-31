export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  date: string;
  readTime: number;
  category: 'excursions' | 'culture' | 'tips' | 'food';
  tags: string[];
}