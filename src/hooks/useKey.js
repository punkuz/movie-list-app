import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(() => {
    function cb(e) {
      if (e.key === key) action();
    }
    document.addEventListener("keydown", cb);
    return () => {
      document.removeEventListener("keydown", cb);
    };
  }, [key, action]);
}