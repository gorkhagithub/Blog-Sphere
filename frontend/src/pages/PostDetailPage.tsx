
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Heart, Edit, Trash, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useBlog } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import CommentSection from "@/components/blog/CommentSection";
import { Separator } from "@/components/ui/separator";
import MDEditor from '@uiw/react-md-editor';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPost, likePost, deletePost, addComment } = useBlog();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const post = id ? getPost(id) : undefined;

  if (!post) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      await deletePost(id);
      navigate("/dashboard");
    } finally {
      setIsDeleting(false);
    }
  };

  const isAuthor = user && user.id === post.author.id;

  return (
    <Layout>
      <article className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          asChild 
          className="mb-6"
        >
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
          </Link>
        </Button>
        
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">
              By {post.author.username} • {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </div>
            {isAuthor && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <Link to={`/edit/${post.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your post. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
        
        {post.thumbnail && (
          <img src={post.thumbnail} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-xl mb-8" />
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {post.category || "General"}
          </span>
          {post.tags && post.tags.map(tag => (
            <span key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="blog-content prose prose-invert max-w-none pb-8" data-color-mode="light">
          <MDEditor.Markdown source={post.content} style={{ whiteSpace: 'pre-wrap', backgroundColor: 'transparent', color: 'inherit' }} />
        </div>
        
        <div className="flex items-center space-x-2 mb-8">
          <Button 
            variant={post.liked ? "default" : "outline"} 
            size="sm" 
            onClick={() => likePost(post.id)}
            disabled={!user}
            className={post.liked ? "bg-primary/20 hover:bg-primary/30 text-primary" : ""}
          >
            <Heart className={`mr-2 h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
            {post.likes} {post.likes === 1 ? "Like" : "Likes"}
          </Button>
        </div>
        
        <Separator className="my-8" />
        
        <CommentSection 
          postId={post.id} 
          comments={post.comments} 
          onAddComment={addComment}
        />
      </article>
    </Layout>
  );
};

export default PostDetailPage;
