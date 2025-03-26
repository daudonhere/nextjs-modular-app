import { motion } from "framer-motion";
import { ThreeDot } from "react-loading-indicators";

interface LoadingComponentProps {
  isLoading: boolean;
}

export default function LoadingComponent({ isLoading }: LoadingComponentProps) {

  return (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ pointerEvents: isLoading ? "auto" : "none" }}
        >
            <ThreeDot color="#2641de" size="medium" />
        </motion.div>
  );
}