import { useEffect, useState } from 'react';
import Layout from '../layouts/layout';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { BiDislike, BiLike, BiComment } from 'react-icons/bi';
import { UserApi } from '../service/UserApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setUser } from '../redux/store';
import { toast } from 'react-toastify';

// Define interfaces
interface Comment {
  id: string;
  comment: string;
  user: {
    id: string;
    name: string;
  };
  created_at: string;
}

interface News {
  id: string;
  title: string;
  description: string;
  image?: string;
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  comments: Comment[];
  user_has_liked?: boolean;
  user_has_disliked?: boolean;
}

const NewsList = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState<Record<string, boolean>>({});
  const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({});
  const [dislikeLoading, setDislikeLoading] = useState<Record<string, boolean>>({});
  
  const user = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const userData = await UserApi.getUser();
      dispatch(setUser(userData.user));
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await UserApi.getNews();
      if (response) {
        // Enhance news items with user interaction status
        
        setNews(response);
      } else {
        setError('No news found.');
      }
    } catch (err) {
      setError('Error fetching news. Please try again.');
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && token !== 'false' && !user) {
      fetchUser();
    }
  }, [token, user]);

  useEffect(() => {
    fetchNews();
  }, [user]);

  const handleLike = async (id: string) => {
    if (!user) {
      toast.error('Please login to like news');
      return;
    }
  
    setLikeLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      const newsItem = news.find(item => item.id === id);
      const isAlreadyLiked = newsItem?.user_has_liked;
      const isAlreadyDisliked = newsItem?.user_has_disliked;
  
      // Optimistic update
      setNews(prevNews =>
        prevNews.map(item => {
          if (item.id !== id) return item;
          
          return {
            ...item,
            likes_count: isAlreadyLiked ? item.likes_count - 1 : item.likes_count + 1,
            dislikes_count: isAlreadyDisliked ? item.dislikes_count - 1 : item.dislikes_count,
            user_has_liked: !isAlreadyLiked,
            user_has_disliked: false
          };
        })
      );
  
      // API call to your existing endpoint
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/news/${id}/${user.id}/like`,
        {}, // Empty body as per your existing API
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
    } catch (err) {
      // Revert on error
      const newsItem = news.find(item => item.id === id);
      setNews(prevNews =>
        prevNews.map(item => {
          if (item.id !== id) return item;
          return {
            ...item,
            likes_count: newsItem?.likes_count || 0,
            dislikes_count: newsItem?.dislikes_count || 0,
            user_has_liked: newsItem?.user_has_liked,
            user_has_disliked: newsItem?.user_has_disliked
          };
        })
      );
      toast.error('Failed to update like');
    } finally {
      setLikeLoading(prev => ({ ...prev, [id]: false }));
    }
  };
  
  const handleDislike = async (id: string) => {
    if (!user) {
      toast.error('Please login to dislike news');
      return;
    }
  
    setDislikeLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      const newsItem = news.find(item => item.id === id);
      const isAlreadyDisliked = newsItem?.user_has_disliked;
      const isAlreadyLiked = newsItem?.user_has_liked;
  
      // Optimistic update
      setNews(prevNews =>
        prevNews.map(item => {
          if (item.id !== id) return item;
          
          return {
            ...item,
            dislikes_count: isAlreadyDisliked ? item.dislikes_count - 1 : item.dislikes_count + 1,
            likes_count: isAlreadyLiked ? item.likes_count - 1 : item.likes_count,
            user_has_disliked: !isAlreadyDisliked,
            user_has_liked: false
          };
        })
      );
  
      // API call to your existing endpoint
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/news/${id}/${user.id}/dislike`,
        {}, // Empty body as per your existing API
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
    } catch (err) {
      // Revert on error
      const newsItem = news.find(item => item.id === id);
      setNews(prevNews =>
        prevNews.map(item => {
          if (item.id !== id) return item;
          return {
            ...item,
            likes_count: newsItem?.likes_count || 0,
            dislikes_count: newsItem?.dislikes_count || 0,
            user_has_liked: newsItem?.user_has_liked,
            user_has_disliked: newsItem?.user_has_disliked
          };
        })
      );
      toast.error('Failed to update dislike');
    } finally {
      setDislikeLoading(prev => ({ ...prev, [id]: false }));
    }
  };
  const handleComment = async (id: string, comment: string) => {
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setCommentLoading(prev => ({ ...prev, [id]: true }));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/news/${id}/${user.id}/comment`, 
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNews(prevNews =>
        prevNews.map(item =>
          item.id === id
            ? {
                ...item,
                comments_count: item.comments_count + 1,
                comments: [
                  {
                    id: response.data.id,
                    comment: comment,
                    user: {
                      id: user.id,
                      name: user.name || 'Anonymous'
                    },
                    created_at: new Date().toISOString()
                  },
                  ...item.comments
                ]
              }
            : item
        )
      );
    } catch (err) {
      toast.error('Failed to post comment');
      console.error('Error commenting on the news item:', err);
    } finally {
      setCommentLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto min-h-screen p-4 md:p-6">
        <h1 className="text-3xl text-custom-green font-bold text-center mb-8">
          Latest News
        </h1>

        {loading ? (
          <div className="w-full flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-custom-green" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : news.length > 0 ? (
            <div className="space-y-6">
            {news.map((item) => (
              <div
              key={item.id}
              className="bg-white w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
              {item.image && (
                <img
                src={`${import.meta.env.VITE_BACKEND_URL}${item.image}`}
                alt="Reclamation"
                className="w-full h-80 mt-2 rounded-md object-cover"
                onError={(e) => {
                // Fallback in case the image fails to load
                (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              )}
              <div className="p-6">
                <h2 className="font-semibold text-xl text-custom-green mb-2 line-clamp-2">
                {item.title}
                </h2>
                <p className="text-gray-700 mb-4 line-clamp-3">
                {item.description}
                </p>
                
                <div className="flex items-center justify-between border-t border-b border-gray-100 py-3">
                <button
                  onClick={() => handleLike(item.id)}
                  disabled={likeLoading[item.id]}
                  className={`flex items-center gap-1 ${item.user_has_liked  ? 'text-green-600' : 'text-gray-500 hover:text-green-500'}`}
                >
                  {likeLoading[item.id] ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                  <BiLike className="w-5 h-5" />
                  )}
                  <span>{item.likes_count}</span>
                </button>
                
                <button
                  onClick={() => handleDislike(item.id)}
                  disabled={dislikeLoading[item.id]}
                  className={`flex items-center gap-1 ${item.user_has_disliked ? 'text-red-600' : 'text-gray-500 hover:text-red-500'}`}
                >
                  {dislikeLoading[item.id] ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                  <BiDislike className="w-5 h-5" />
                  )}
                  <span>{item.dislikes_count}</span>
                </button>
                
                
                </div>
                
                <div className="mt-4">
                <form
                  onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const commentInput = form.elements.namedItem('comment') as HTMLInputElement;
                  handleComment(item.id, commentInput.value);
                  form.reset();
                  }}
                  className="flex gap-2"
                >
                  <input
                  type="text"
                  name="comment"
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-green focus:border-transparent"
                  disabled={commentLoading[item.id]}
                  />
                  <button
                  type="submit"
                  disabled={commentLoading[item.id]}
                  className="px-3 py-2 bg-custom-green text-white rounded-md hover:bg-green-600 disabled:bg-gray-300"
                  >
                  {commentLoading[item.id] ? 'Posting...' :<> <BiComment className="w-5 h-5" />
                  <span>{item.comments_count}</span></>}
                  </button>
                </form>
                
                {item.comments.length > 0 && (
                  <div className="mt-4 space-y-3 max-h-40 overflow-y-auto">
                  {item.comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-800">{comment.user.name}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{comment.comment}</p>
                    </div>
                  ))}
                  </div>
                )}
                </div>
              </div>
              </div>
            ))}
            </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No news available at the moment.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NewsList;