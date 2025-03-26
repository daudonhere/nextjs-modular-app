import { useEffect } from "react";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const useAnimationComponents = () => {
  const popupControls = useAnimation();
  const fadeControls = useAnimation();
  const leftControls = useAnimation();
  const rightControls = useAnimation();
  const bottomControls = useAnimation();

  const [ref, inView] = useInView({ threshold: 0.1 });

  const popupVariants = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.5 },
  };

  const fadeVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const leftVariants = {
    visible: { x: 0, opacity: 1 },
    hidden: { x: "-100%", opacity: 0 },
  };

  const rightVariants = {
    visible: { x: 0, opacity: 1 },
    hidden: { x: "100%", opacity: 0 },
  };

  const bottomVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: "100%", opacity: 0 },
  };

  useEffect(() => {
    if (inView) {
      popupControls.start("visible");
      fadeControls.start("visible");
      leftControls.start("visible");
      rightControls.start("visible");
      bottomControls.start("visible");
    } else {
      popupControls.start("hidden");
      fadeControls.start("hidden");
      leftControls.start("hidden");
      rightControls.start("hidden");
      bottomControls.start("hidden");
    }
  }, [inView, popupControls, fadeControls, leftControls, rightControls, bottomControls]);

  return {
    ref,
    popupControls,
    fadeControls,
    leftControls,
    rightControls,
    bottomControls,
    popupVariants,
    fadeVariants,
    leftVariants,
    rightVariants,
    bottomVariants,
  };
};

export default useAnimationComponents;