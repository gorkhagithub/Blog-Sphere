import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import api from "../api/axios";

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
  likes: number;
  comments: Comment[];
  liked?: boolean;
}

interface BlogContextType {
  posts: Post[];
  userPosts: Post[];
  isLoading: boolean;
  createPost: (title: string, content: string, thumbnail?: string, category?: string, tags?: string[]) => Promise<void>;
  updatePost: (id: string, title: string, content: string, thumbnail?: string, category?: string, tags?: string[]) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  getPost: (id: string) => Post | undefined;
  fetchPosts: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/blogs');
      if (res.data.success) {
        const mappedPosts = res.data.data.map((blog: any) => ({
          id: blog._id,
          title: blog.title,
          content: blog.content,
          thumbnail: blog.thumbnail,
          category: blog.category,
          tags: blog.tags,
          author: {
            id: blog.author._id,
            username: blog.author.name,
            profilePicture: blog.author.profilePicture,
          },
          createdAt: blog.createdAt,
          likes: blog.likes.length,
          liked: user ? blog.likes.includes(user.id) : false,
          comments: [] // We'll fetch comments separately or update backend to populate
        }));
        setPosts(mappedPosts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter posts by the current user
  const userPosts = posts.filter(post => 
    user && post.author.id === user.id
  );

  const createPost = async (title: string, content: string, thumbnail?: string, category = "General", tags: string[] = []) => {
    if (!user) {
      toast.error("You must be logged in to create a post");
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post('/blogs', { title, content, thumbnail, category, tags });
      if (res.data.success) {
        toast.success("Post created successfully!");
        fetchPosts(); // Refresh list
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create post");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async (id: string, title: string, content: string, thumbnail?: string, category?: string, tags?: string[]) => {
    if (!user) {
      toast.error("You must be logged in to update a post");
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.put(`/blogs/${id}`, { title, content, thumbnail, category, tags });
      if (res.data.success) {
        toast.success("Post updated successfully!");
        fetchPosts();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update post");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete a post");
      return;
    }

    try {
      setIsLoading(true);
      await api.delete(`/blogs/${id}`);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      toast.success("Post deleted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete post");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const likePost = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to like a post");
      return;
    }

    try {
      const res = await api.put(`/blogs/${id}/like`);
      if (res.data.success) {
        const updatedLikes = res.data.data; // array of user ids
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === id) {
              return { 
                ...post, 
                likes: updatedLikes.length,
                liked: updatedLikes.includes(user.id)
              };
            }
            return post;
          })
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to like post");
      throw error;
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) {
      toast.error("You must be logged in to comment");
      return;
    }

    try {
      const res = await api.post(`/blogs/${postId}/comments`, { content });
      if (res.data.success) {
        const newComment = res.data.data;
        const mappedComment = {
          id: newComment._id,
          content: newComment.content,
          author: {
            id: newComment.author._id,
            username: newComment.author.name,
            profilePicture: newComment.author.profilePicture,
          },
          createdAt: newComment.createdAt
        };
        
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, comments: [...(post.comments || []), mappedComment] } 
              : post
          )
        );
        toast.success("Comment added!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add comment");
      throw error;
    }
  };

  const getPost = (id: string) => {
    return posts.find(post => post.id === id);
  };

  return (
    <BlogContext.Provider value={{ 
      posts, 
      userPosts,
      isLoading, 
      createPost, 
      updatePost, 
      deletePost, 
      likePost, 
      addComment,
      getPost,
      fetchPosts
    }}>
      {children}
    </BlogContext.Provider>
  );
};
