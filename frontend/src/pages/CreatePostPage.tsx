
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PostForm from "@/components/blog/PostForm";
import { useBlog } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const CreatePostPage: React.FC = () => {
  const { createPost } = useBlog();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }

  const handleCreatePost = async (title: string, content: string, thumbnail: string, category: string, tags: string[]) => {
    setIsSubmitting(true);
    try {
      await createPost(title, content, thumbnail, category, tags);
      navigate("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a New Post</h1>
        <PostForm 
          onSubmit={handleCreatePost} 
          isSubmitting={isSubmitting}
        />
      </div>
    </Layout>
  );
};

export default CreatePostPage;
