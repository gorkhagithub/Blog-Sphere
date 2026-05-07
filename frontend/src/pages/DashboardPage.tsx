
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash, MessageCircle, Plus } from "lucide-react";
import { useBlog } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Navigate } from "react-router-dom";
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

const DashboardPage: React.FC = () => {
  const { userPosts, deletePost } = useBlog();
  const { user } = useAuth();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <p className="text-muted-foreground">Manage your posts and content</p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/create">
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="posts">Your Posts</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            {userPosts.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/30">
                <h3 className="text-xl font-medium mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start sharing your thoughts by creating your first post
                </p>
                <Button asChild>
                  <Link to="/create">
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Post
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {userPosts.map(post => (
                  <Card key={post.id}>
                    <CardHeader>
                      <CardTitle>
                        <Link 
                          to={`/post/${post.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        Published on {format(new Date(post.createdAt), "MMMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">
                        {post.content.substring(0, 150)}
                        {post.content.length > 150 ? "..." : ""}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex space-x-4">
                        <div className="flex items-center text-muted-foreground">
                          <MessageCircle className="mr-1 h-4 w-4" /> {post.comments.length}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
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
                                onClick={() => deletePost(post.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Overview</CardTitle>
                  <CardDescription>Summary of your blog activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Posts</p>
                      <p className="text-3xl font-bold">{userPosts.length}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Comments</p>
                      <p className="text-3xl font-bold">
                        {userPosts.reduce((sum, post) => sum + post.comments.length, 0)}
                      </p>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardPage;
