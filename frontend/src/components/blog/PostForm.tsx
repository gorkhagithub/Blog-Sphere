import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MDEditor from '@uiw/react-md-editor';
import { Post } from "@/contexts/BlogContext";
import api from "@/api/axios";
import { toast } from "sonner";

interface PostFormProps {
  post?: Post;
  onSubmit: (title: string, content: string, thumbnail: string, category: string, tags: string[]) => Promise<void>;
  isSubmitting: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ post, onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [category, setCategory] = useState(post?.category || "General");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [thumbnail, setThumbnail] = useState(post?.thumbnail || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({ title: "", content: "" });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
      setTags(post.tags.join(", "));
      setThumbnail(post.thumbnail || "");
    }
  }, [post]);

  const validate = (): boolean => {
    const newErrors = { title: "", content: "" };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!content || !content.trim()) {
      newErrors.content = "Content is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingImage(true);
      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        setThumbnail(res.data.url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
    await onSubmit(title, content, thumbnail, category, tagsArray);
  };

  return (
    <Card className="w-full" data-color-mode="light">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{post ? "Edit Post" : "Create New Post"}</CardTitle>
          <CardDescription>
            {post 
              ? "Update your blog post" 
              : "Share your thoughts and ideas with the community"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Technology, Lifestyle"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. react, programming, web"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="thumbnail" className="text-sm font-medium">Thumbnail Image</label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
            {uploadingImage && <p className="text-sm text-muted-foreground">Uploading image...</p>}
            {thumbnail && (
              <div className="mt-2">
                <img src={thumbnail} alt="Thumbnail preview" className="w-full max-w-sm rounded-md" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">Content (Markdown supported)</label>
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              height={400}
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting || uploadingImage}>
            {isSubmitting 
              ? post ? "Updating..." : "Creating..." 
              : post ? "Update Post" : "Create Post"
            }
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PostForm;
