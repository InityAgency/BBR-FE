"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface AuthAwareLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export default function AuthAwareLink({ 
  href, 
  children, 
  className, 
  onClick, 
  target, 
  rel 
}: AuthAwareLinkProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Ako je link ka registraciji i korisnik je već logovan
    if (href.includes('/register') && isAuthenticated && user) {
      e.preventDefault();
      
      // Redirektuj na odgovarajući dashboard na osnovu role-a
      const targetPath = user.role.name === "developer"
        ? '/developer/dashboard'
        : user.role.name === "buyer"
          ? '/buyer/dashboard'
          : '/';
      
      router.push(targetPath);
      return;
    }

    // Ako postoji custom onClick handler, pozovi ga
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
} 