
import React from "react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import { useBlog } from "@/contexts/BlogContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { posts, isLoading } = useBlog();
  const { user } = useAuth();

  return (
    <Layout>
      <section className="mb-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Welcome to BlogSphere</h1>
          <p className="text-xl text-muted-foreground mb-8">
            A place to share your thoughts, ideas, and stories with the world
          </p>
          {user ? (
            <Button asChild size="lg">
              <Link to="/create">Write a New Post</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link to="/auth">Sign in to Start Writing</Link>
            </Button>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Latest Posts</h2>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts available. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Index;
