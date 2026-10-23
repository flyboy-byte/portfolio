import { useEffect, useRef, useState } from "react";

// True while the referenced element is on (or within `margin` of) the screen.
// Used to pause WebGL canvases that are scrolled out of view.
export const useInView = (margin = "200px") => {
  const ref = useRef(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return [ref, inView];
};
