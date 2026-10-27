import React, { useEffect, useRef, useState } from 'react';

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  delay?: number;
  as?: React.ElementType;
  once?: boolean;
  children?: React.ReactNode;
}

/**
 * Fades and lifts children into view when they enter the viewport.
 * One IntersectionObserver per element; reduced motion is handled in CSS.
 */
export const Reveal: React.FC<RevealProps> = ({
  delay = 0,
  as = 'div',
  once = true,
  className = '',
  style,
  children,
  ...rest
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};
