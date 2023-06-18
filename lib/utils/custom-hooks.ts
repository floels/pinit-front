import { useState, useEffect } from "react";

export const useViewportWidth = () => {
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window width
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};
