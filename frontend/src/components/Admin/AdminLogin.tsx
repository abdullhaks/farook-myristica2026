import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, message } from 'antd';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { request } from '../../services/apiClient';
import { useAdminStore } from '../../store/useAdminStore';

const BackgroundOrbs = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 100, 0],
        y: [0, -50, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      style={{ willChange: "transform" }}
      className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[80px] md:blur-[120px]"
    />
    <motion.div
      animate={{
        scale: [1, 1.5, 1],
        x: [0, -100, 0],
        y: [0, 100, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ willChange: "transform" }}
      className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] md:blur-[150px]"
    />
     <motion.div
      animate={{
        scale: [1, 1.3, 1],
        x: [0, 50, 0],
        y: [0, 50, 0],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      style={{ willChange: "transform" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[70px] md:blur-[100px]"
    />
  </div>
));

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setLogin = useAdminStore((state) => state.setLogin);
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      message.error('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const res = await request('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (res.success) {
        message.success(res.message || 'Logged in successfully');
        setLogin(res.admin, res.access_token, res.refresh_token);
        navigate('/home');
      }
    } catch (error: any) {
      message.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white selection:bg-green-500/30 selection:text-white relative overflow-hidden font-sans">
      <BackgroundOrbs />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/10 backdrop-blur-xl md:backdrop-blur-3xl relative z-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex flex-col mx-4"
      >
        {/* Glow effect behind the card */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        <div className="text-center mb-10 flex flex-col items-center relative z-20">
          <motion.div 
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="w-20 h-20 rounded-[1.25rem] bg-zinc-950/50 border border-white/10 flex items-center justify-center mb-6 shadow-inner backdrop-blur-md overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src="/Myristica_Icon.png" 
              alt="Myristica Logo" 
              className="h-12 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] relative z-10"
            />
          </motion.div>
          
          <h1 className="font-serif italic text-4xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 mb-3">
            Myristica
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-green-500/50"></div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-green-400/90">
              Admin Portal
            </span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-green-500/50"></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-20">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-green-400 transition-colors z-10">
                <UserOutlined />
              </div>
              <input
                type="text"
                placeholder="User name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-950/50 border border-white/10 text-white placeholder-zinc-500 h-14 rounded-2xl pl-12 pr-4 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 hover:bg-zinc-900/80 transition-all duration-300 shadow-inner"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-green-400 transition-colors z-10">
                <LockOutlined />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950/50 border border-white/10 text-white placeholder-zinc-500 h-14 rounded-2xl pl-12 pr-12 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 hover:bg-zinc-900/80 transition-all duration-300 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors focus:outline-none z-10"
              >
                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full !bg-gradient-to-r !from-green-600 !to-emerald-500 hover:!from-green-500 hover:!to-emerald-400 !text-white !border-none h-14 text-sm font-bold tracking-[0.2em] rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all duration-300 overflow-hidden relative group flex items-center justify-center"
            >
              <span className="relative z-10">{loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}</span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
