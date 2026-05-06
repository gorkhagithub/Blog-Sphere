
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
