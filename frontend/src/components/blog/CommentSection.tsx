
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Comment } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => Promise<void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  postId, 
  comments, 
  onAddComment 
}) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    if (!user) {
      toast.error("You must be logged in to comment");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddComment(postId, newComment);
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif">Comments</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder={user ? "Add a comment..." : "Log in to comment"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user || isSubmitting}
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!user || !newComment.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      <Separator />

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{comment.author.username}</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
