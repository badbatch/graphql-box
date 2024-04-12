import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = <E extends HTMLElement>(options: IntersectionObserverInit) => {
  const elementRef = useRef<E>(null);
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
