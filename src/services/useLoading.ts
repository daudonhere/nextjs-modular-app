import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const useLoading = () => {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);
        window.addEventListener('beforeunload', handleStart);
        window.addEventListener('load', handleComplete);
        return () => {
            window.removeEventListener('beforeunload', handleStart);
            window.removeEventListener('load', handleComplete);
        };
    }, [pathname]);

    return loading;
};

export default useLoading;
