import type { BlogPost } from '@/types/blog';
import frontMatter from 'front-matter';

const blogFiles = import.meta.glob('@/content/blog/*.md', { query: '?raw', import: 'default', eager: true });

function getAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];
  
  for (const path in blogFiles) {
    const rawContent = blogFiles[path] as string;
    const { attributes, body } = frontMatter<any>(rawContent);
    posts.push({
      id: attributes.id,
      title: attributes.title,
      description: attributes.excerpt || '',
      content: body || '',
      imageUrl: attributes.imageUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80',
      date: attributes.created_at || new Date().toISOString(),
      readTime: '5 мин',
      category: attributes.category || 'Статьи',
      tags: attributes.tags || []
    });
  }
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return getAllBlogPosts();
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const posts = getAllBlogPosts();
  return posts.find(p => p.id === id) || null;
}

export async function getAdjacentPosts(currentId: string): Promise<{ prev: BlogPost | null; next: BlogPost | null }> {
  const posts = getAllBlogPosts();
  const currentIndex = posts.findIndex(post => post.id === currentId);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
    next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
  };
}