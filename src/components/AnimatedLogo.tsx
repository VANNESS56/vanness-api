"use client";

import Image from "next/image";
import Link from "next/link";

interface AnimatedLogoProps {
  href?: string;
  className?: string;
  text?: string; // Kept for backwards compatibility but not used
}

export default function AnimatedLogo({ href = "/dashboard", className = "", text = "PannessAPI" }: AnimatedLogoProps) {
  const content = (
    <div className={`relative flex items-center hover:scale-105 transition-transform duration-300 ${className}`}>
      <Image
        src="/logo.png"
        alt="Panness API Logo"
        width={200}
        height={80}
        className="object-contain w-auto h-12 md:h-14"
        priority
      />
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
