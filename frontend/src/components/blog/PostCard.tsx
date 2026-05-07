
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Post, useBlog } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { likePost } = useBlog();
  const { user } = useAuth();
  
  // Get a truncated version of the content for the card preview
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likePost(post.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/post/${post.id}`} className="block flex-1">
        {post.thumbnail && (
          <div className="w-full h-48 overflow-hidden">
            <img 
              src={post.thumbnail} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
              {post.category || "General"}
            </span>
          </div>
          <CardTitle className="text-2xl line-clamp-2">{post.title}</CardTitle>
          <CardDescription>
            By {post.author.username} • {format(new Date(post.createdAt), "MMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">
            {truncateContent(post.content.replace(/[#*`_~>\[\]\(\)]/g, ''))}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <MessageCircle size={18} />
              <span className="text-sm">{post.comments.length}</span>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm">
            <span>Read More</span>
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default PostCard;
