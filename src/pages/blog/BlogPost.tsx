import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeaderBackground } from '@/components/layout/HeaderBackground';
import { BlogPost } from '@/types/blog';
import { getBlogPostById, getAdjacentPosts } from '@/lib/blog';
import { useTranslation } from 'react-i18next';

const BlogPostPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [adjacentPosts, setAdjacentPosts] = useState<{ prev: BlogPost | null; next: BlogPost | null }>({
    prev: null,
    next: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      
      try {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        const [postData, adjacentPostsData] = await Promise.all([
          getBlogPostById(id),
          getAdjacentPosts(id)
        ]);
        setPost(postData);
        setAdjacentPosts(adjacentPostsData);
      } catch (err) {
        setError('Failed to load blog post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-darkest pt-20 md:pt-24 relative">
        <HeaderBackground height="40vh" />
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

  if (error || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-ocean-darkest pt-20 md:pt-24 relative">
      <HeaderBackground height="40vh" />
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/blog" className="inline-flex items-center text-ocean-light hover:text-white mb-8">
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('blog.backToBlog')}
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {post.title}
              </h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-ocean-light mb-8">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(post.date).toLocaleDateString('ru-RU')}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {post.readTime} {t('blog.readTime')}
                </div>
              </div>

              {/* Featured Image */}
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden mb-8">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
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
            </div>

            {/* Content */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <div className="prose prose-invert prose-ocean max-w-none">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <React.Fragment key={index}>
                    {paragraph.startsWith('#') ? (
                      <h2 className="text-2xl font-bold text-white mb-4 mt-8">
                        {paragraph.replace('# ', '')}
                      </h2>
                    ) : paragraph.startsWith('- ') ? (
                      <ul className="list-disc list-inside mb-4 text-ocean-light">
                        {paragraph.split('\n').map((item, i) => (
                          <li key={i} className="mb-2">{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-ocean-light mb-4">{paragraph}</p>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-4">
              {adjacentPosts.prev && (
                <Link
                  to={`/blog/${adjacentPosts.prev.id}`}
                  className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center text-ocean-light mb-2">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <span className="text-sm">{t('blog.prevPost')}</span>
                  </div>
                  <h3 className="text-white font-medium line-clamp-2 group-hover:text-ocean-light transition-colors">
                    {adjacentPosts.prev.title}
                  </h3>
                </Link>
              )}
              
              {adjacentPosts.next && (
                <Link
                  to={`/blog/${adjacentPosts.next.id}`}
                  className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors ml-auto text-right"
                >
                  <div className="flex items-center justify-end text-ocean-light mb-2">
                    <span className="text-sm">{t('blog.nextPost')}</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                  <h3 className="text-white font-medium line-clamp-2 group-hover:text-ocean-light transition-colors">
                    {adjacentPosts.next.title}
                  </h3>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;