import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options: IntersectionObserverInit) => {
  const elementReference = useRef<HTMLDivElement>(null);
  const [isElementVisible, setIsElementVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      setIsElementVisible(entry?.isIntersecting ?? false);
    }, options);

    const currentElement = elementReference.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  return [elementReference, isElementVisible] as const;
};
