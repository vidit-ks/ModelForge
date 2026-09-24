import React, { useState } from "react";
import { X, Lock, Mail, User, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/common/Toast";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp, isSupabaseConfigured } = useAuth();
  const { addToast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
        addToast("Account created successfully! Welcome to ModelForge.", "success");
      } else {
        await signIn(email, password);
        addToast("Signed in successfully. Ready to experiment!", "success");
      }
      closeAuthModal();
    } catch (err) {
      addToast(err.message || "Authentication failed. Check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDemo = () => {
    addToast("Entered Developer Sandbox Mode.", "info");
    closeAuthModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-[#0b1120] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden glass-panel"
        >
          {/* Subtle Top Accent Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-[#1D63FF] via-[#FFCE32] to-[#1D63FF] rounded-full blur-xs" />

          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1D63FF]/30 to-[#FFCE32]/30 border border-[#FFCE32]/30 mb-3 shadow-lg">
              <Sparkles className="w-6 h-6 text-[#FFCE32]" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isSignUp ? "Create ModelForge Account" : "Access AI Studio"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Save experiments, build multi-node workflows, and track latency metrics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Alex Rivera"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@lab.ai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1D63FF] to-[#1447b8] hover:from-[#2568ff] hover:to-[#174ec7] text-white text-sm font-semibold shadow-lg shadow-[#1D63FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? "Initialize Account" : "Sign In to Studio"}</span>
                  <ArrowRight className="w-4 h-4 text-[#FFCE32]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGuestDemo}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#FFCE32]" />
              <span>Continue in Instant Guest Sandbox Mode</span>
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-slate-400 hover:text-[#FFCE32] transition-colors"
              >
                {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
