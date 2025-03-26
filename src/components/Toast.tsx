import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useAnimationComponents from '@/hooks/useAnimation';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  const { ref, rightControls, rightVariants } = useAnimationComponents();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    show && (
      <motion.div
          ref={ref}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8}}
          animate={rightControls}
          variants={rightVariants}
          className={`flex px-4 fixed bottom-5 right-5 bg-secondaryB min-w-80 h-16 items-center justify-between rounded-md shadow-lg transition-opacity duration-300 ${
            type === 'success' ? 'text-netral' : 'text-destructive'
          }`}
      >
        <span>{message}</span>
        <button onClick={() => { setShow(false); onClose(); }} className="ml-4">
          <X size={20} className="text-netral hover:text-mutted transition" />
        </button>
      </motion.div>
    )
  );
}
