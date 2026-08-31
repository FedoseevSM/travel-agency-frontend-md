import React, { useState, useEffect } from 'react';
import { HeaderBackground } from '@/components/layout/HeaderBackground';
import { Clock, Calendar, Tag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { getBlogPosts } from '@/lib/blog';
import { useTranslation } from 'react-i18next';

const categories = [
  { id: 'all', label: 'all' },
  { id: 'excursions', label: 'excursions' },
  { id: 'culture', label: 'culture' },
  { id: 'tips', label: 'tips' },
  { id: 'food', label: 'food' },
] as const;

const Blog: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-darkest pt-20 md:pt-24 relative">
        <HeaderBackground height="30vh" />
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-center items-center py-12">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce [animation-delay:-.3s]" />
                <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce [animation-delay:-.5s]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ocean-darkest pt-20 md:pt-24 relative">
        <HeaderBackground height="30vh" />
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-12">
              <p className="text-ocean-light text-lg">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-darkest pt-20 md:pt-24 relative">
      <HeaderBackground height="30vh" />
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('blog.title')}
            </h1>
            <p className="text-ocean-light text-lg mb-12">
              {t('blog.subtitle')}
            </p>

            {/* Search and Filters */}
            <div className="mb-12 space-y-6">
              {/* Search */}
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('blog.search.placeholder')}
                  className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-3
                           text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                           focus:ring-ocean-deep focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-ocean-deep text-white'
                        : 'bg-white/10 text-ocean-light hover:bg-white/20'
                    }`}
                  >
                    {t(`blog.categories.${category.label}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Posts */}
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-ocean-light text-lg">
                  {t('blog.search.notFound')}
                </p>
                <p className="text-ocean-light text-sm mt-2">
                  {t('blog.search.tryAgain')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="aspect-[4/3] md:aspect-auto">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-3">
            {post.title}
          </h2>
          <p className="text-ocean-light mb-4">
            {post.description}
          </p>
          
          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-ocean-light mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.date).toLocaleDateString('ru-RU')}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {post.readTime} {t('blog.readTime')}
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center px-3 py-1 bg-white/10 rounded-full text-sm text-ocean-light"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </div>
            ))}
          </div>
          
          <Link
            to={`/blog/${post.id}`}
            className="inline-flex items-center text-ocean hover:text-white transition-colors"
          >
            {t('blog.readMore')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;