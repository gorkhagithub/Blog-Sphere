
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto pt-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? "Welcome Back" : "Join BlogSphere"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin 
              ? "Sign in to your account to continue" 
              : "Create an account to start sharing your thoughts"
            }
          </p>
        </div>
        
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </Layout>
  );
};

export default AuthPage;
