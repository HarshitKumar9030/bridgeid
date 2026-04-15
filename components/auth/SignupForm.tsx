"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";

export function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email && password) {
      try {
        const createRes = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }) });

        const data = await createRes.json();

        if (!createRes.ok) {
          setError(data.message || "Error creating account.");
          return;
        }

        const res = await signIn("credentials", {
          username,
          password,
          redirect: false });
    
        if (res?.error) {
          setError("Error logging in after creation.");
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        setError("Network error occurred.");
      }
    } else {
      setError("Please complete all fields");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-muted/10 p-10 sm:p-14 rounded-[2rem] w-full max-w-[600px] md:max-w-2xl relative z-10 backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-white/5 rounded-[2rem] pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold mb-3 tracking-tight text-foreground">
          Join the <span className="font-serif italic text-accent pr-2">network</span>.
        </h2>
        <p className="text-muted-foreground text-lg mb-10 text-balance">
          Start establishing verifiable trust structures in seconds.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <input
              type="text"
              className="w-full bg-white/5 rounded-2xl px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all font-medium text-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div>
            <input
              type="email"
              className="w-full bg-white/5 rounded-2xl px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all font-medium text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full bg-white/5 rounded-2xl px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all font-medium text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          {error && <p className="text-secondary text-sm mt-1 px-2 font-medium">{error}</p>}
          
          <button
            type="submit"
            className="mt-6 w-full bg-accent text-accent-foreground font-semibold py-4 rounded-2xl hover:opacity-90 transition-opacity flex justify-center items-center gap-2 group text-lg"
          >
            Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="relative flex items-center py-8">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm font-medium">Or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-white/5 text-foreground font-semibold py-4 rounded-2xl hover:bg-white/10 transition-colors flex justify-center items-center gap-3 text-lg"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#F8F9FA"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#F8F9FA"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#F8F9FA"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#F8F9FA"/>
          </svg>
          Google
        </button>

        <p className="text-center text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:text-accent transition-colors underline underline-offset-4 decoration-accent/30 hover:decoration-accent">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
}


