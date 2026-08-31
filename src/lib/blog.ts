import { supabase } from './supabase';
import type { BlogPost } from '@/types/blog';

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }

  return data ? data.map(formatBlogPost) : [];
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }

  return data ? formatBlogPost(data) : null;
}

export async function getAdjacentPosts(currentId: string): Promise<{ prev: BlogPost | null; next: BlogPost | null }> {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching adjacent posts:', error);
    throw error;
  }

  if (!posts) {
    return { prev: null, next: null };
  }

  const formattedPosts = posts.map(formatBlogPost);
  const currentIndex = formattedPosts.findIndex(post => post.id === currentId);

  return {
    prev: currentIndex > 0 ? formattedPosts[currentIndex - 1] : null,
    next: currentIndex < formattedPosts.length - 1 ? formattedPosts[currentIndex + 1] : null
  };
}

function formatBlogPost(post: any): BlogPost {
  return {
    id: post.id,
    title: post.title,
    description: post.description,
    content: post.content,
    imageUrl: post.image_url,
    date: post.date,
    readTime: post.read_time,
    category: post.category,
    tags: post.tags
  };
}