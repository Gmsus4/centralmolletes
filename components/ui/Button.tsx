import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  url?: string | undefined;
  title?: string | ReactNode;  
  isFilled?: boolean;         
  className?: string;
  children?: ReactNode;
  size?: 'default' | 'min'
  target?: "_self" | "_blank"
  rel?: string  
}

export const Button = ({ url = "#", title, rel, target = "_self", isFilled = true, children, size = "default", className = ''}: ButtonProps) => {
  const content = children || title || 'Button';
  const baseStyles = `inline-flex items-center justify-center rounded-radius ${size === "default" ? "px-6 py-2.5" : "px-4 py-1"}  font-medium text-center transition-all duration-100 ease-out hover:scale-x-[0.98] active:scale-[0.95]`;

  const filledStyles = `bg-transparent text-bg-dark outline-1 outline-bg-dark`;

  const outlinedStyles = `bg-brand-primary text-bg-dark hover:bg-brand-primary-hover`;

  const variantClass = isFilled ? filledStyles : outlinedStyles;


  return (
     
    <Link
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      href={url}
      className={`${baseStyles} ${variantClass} ${className}`}
      aria-label={!title && !children ? "botón" : undefined}
    >
      {content}
    </Link>
  );
};