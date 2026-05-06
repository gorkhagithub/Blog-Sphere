
import React from "react";
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto pt-8 pb-6">
      <Separator />
      <div className="container mx-auto px-4 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-xl font-serif font-bold text-primary">BlogSphere</p>
            <p className="text-sm text-muted-foreground">Share your thoughts with the world</p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} BlogSphere. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
