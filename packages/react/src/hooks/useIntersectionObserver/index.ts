import { useEffect, useRef, useState } from "react";

export default (options: IntersectionObserverInit) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isElementVisible, setIsElementVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      setIsElementVisible(entry?.isIntersecting ?? false);
    }, options);

    const currentElement = elementRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  return [elementRef, isElementVisible] as const;
};
