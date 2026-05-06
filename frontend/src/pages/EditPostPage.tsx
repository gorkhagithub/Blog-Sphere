
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PostForm from "@/components/blog/PostForm";
import { useBlog } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPost, updatePost } = useBlog();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const post = id ? getPost(id) : undefined;

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Redirect if post doesn't exist or user is not the author
  if (!post) {
    return <Navigate to="/dashboard" />;
  }

  if (user.id !== post.author.id) {
    return <Navigate to={`/post/${id}`} />;
  }

  const handleUpdatePost = async (title: string, content: string, thumbnail: string, category: string, tags: string[]) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await updatePost(id, title, content, thumbnail, category, tags);
      navigate(`/post/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-2" 
            onClick={() => navigate(`/post/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Post
          </Button>
          <h1 className="text-3xl font-bold">Edit Post</h1>
        </div>
        
        <PostForm 
          post={post} 
          onSubmit={handleUpdatePost} 
          isSubmitting={isSubmitting}
        />
      </div>
    </Layout>
  );
};

export default EditPostPage;
