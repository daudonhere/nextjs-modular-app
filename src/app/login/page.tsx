'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useStatusStore } from '@/store/useStatusStore';
import LoadingComponent from '@/components/Loading';
import Toast from '@/components/Toast';
import Spinner from '@/components/Spinner';
import GridMotion from '@/components/GridMotion';
import { motion } from 'framer-motion';
import useAnimationComponents from '@/services/useAnimation';

const items = [
  'TYPESCRIPT', 'MODULAR', 'https://www.svgrepo.com/show/374032/reactjs.svg', 'PYTHON', 'ENGINE',
  'TYPESCRYPT', 'MODULAR', 'https://www.svgrepo.com/show/373554/django.svg', 'TYPESCRYPT',
  'https://www.svgrepo.com/show/374032/reactjs.svg', 'PYTHON', 'ENGINE', 'https://www.svgrepo.com/show/373554/django.svg',
  'TYPESCRYPT', 'MODLAR', 'https://www.svgrepo.com/show/373554/django.svg', 'ENGINE',
  'https://www.svgrepo.com/show/374032/reactjs.svg', 'https://www.svgrepo.com/show/373554/django.svg',
  'MODULAR', 'PYTHON', 'ENGINE', 'https://www.svgrepo.com/show/374032/reactjs.svg', 'TYPESCRYPT'
];

export default function LoginScreen() {
  const router = useRouter();
  const { trigerLogin, isAuthenticated } = useAuthStore();
  const { isLoading, setLoading, isError } = useStatusStore();
  const [loadingButton, setLoadingButton] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { ref, fadeControls, fadeVariants, bottomControls, bottomVariants } = useAnimationComponents();

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        setLoading(true);
        setTimeout(() => router.push("/"), 1000);
      }, 1500);
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingButton(true);
    if (!username || !password) {
      setToast({ message: 'Username and password must be provided!', type: 'error' });
      setLoadingButton(false);
      return;
    }
    await trigerLogin(username, password);
    const authState = useAuthStore.getState();
    if (authState.isAuthenticated) {
      setToast({ message: 'Login Success', type: 'success' });
      setLoadingButton(false);
      setTimeout(() => {
        setLoading(true);
        setTimeout(() => router.push("/"), 1000);
        setLoading(false);
      }, 1500);
    } else {
      setToast({ message: isError || 'Invalid username or password', type: 'error' });
      setLoadingButton(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 1 }}
      animate={fadeControls}
      variants={fadeVariants}
      className="relative flex flex-col items-center justify-center min-h-screen p-4 text-netral font-roboto font-semibold"
    >
      <GridMotion items={items} />
      <div className="absolute flex flex-1 w-full h-full bg-black/70 backdrop-blur-md z-10" />
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1.5 }}
        animate={bottomControls}
        variants={bottomVariants}
        className="absolute w-full max-w-md bg-secondaryB p-8 rounded-xl shadow-lg z-20"
      >
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <LoadingComponent isLoading={isLoading} />
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full p-3 rounded-md bg-background text-netral focus:outline-none focus:ring-1 focus:ring-secondary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 pr-10 rounded-md bg-background text-netral focus:outline-none focus:ring-1 focus:ring-secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-netral"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loadingButton}
            className="w-full bg-success hover:bg-successH text-netral py-2 rounded-lg font-semibold transition"
          >
            {loadingButton ? <Spinner /> : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-netral">
          Don't have an account ? <a href="/register" className="text-success hover:underline">Register</a>
        </p>
      </motion.div>
    </motion.div>
  );
}