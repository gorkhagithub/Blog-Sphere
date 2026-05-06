
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="font-medium hover:text-primary transition-colors">
        Home
      </Link>
      {user ? (
        <>
          <Link to="/create" className="font-medium hover:text-primary transition-colors">
            New Post
          </Link>
          <Link to="/dashboard" className="font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
        </>
      ) : null}
    </>
  );

  const AuthButtons = () => (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <span className="hidden md:inline-block text-sm mr-2">
            Welcome, {user.username}
          </span>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </>
      ) : (
        <Button variant="outline" onClick={() => navigate("/auth")} className="ml-4">
          Sign In
        </Button>
      )}
    </div>
  );

  return (
    <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-serif font-bold text-primary">
            BlogSphere
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:block">
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center py-4 border-b">
                <Link to="/" className="text-xl font-serif font-bold text-primary">
                  BlogSphere
                </Link>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </div>

              <nav className="flex flex-col space-y-4 py-6">
                <SheetClose asChild>
                  <Link to="/" className="px-2 py-1 hover:text-primary transition-colors">
                    Home
                  </Link>
                </SheetClose>
                {user && (
                  <>
                    <SheetClose asChild>
                      <Link to="/create" className="px-2 py-1 hover:text-primary transition-colors">
                        New Post
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/dashboard" className="px-2 py-1 hover:text-primary transition-colors">
                        Dashboard
                      </Link>
                    </SheetClose>
                  </>
                )}
              </nav>

              <div className="mt-auto pb-6">
                {user ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Signed in as <strong>{user.username}</strong>
                    </p>
                    <SheetClose asChild>
                      <Button variant="outline" onClick={handleLogout} className="w-full">
                        Log out
                      </Button>
                    </SheetClose>
                  </div>
                ) : (
                  <SheetClose asChild>
                    <Button onClick={() => navigate("/auth")} className="w-full">
                      Sign In
                    </Button>
                  </SheetClose>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
