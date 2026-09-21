"use client";

import { Orbitron } from "next/font/google";
import { TypeAnimation } from "react-type-animation";
import Link from "next/link";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700", "900"] });

interface AnimatedLogoProps {
  href?: string;
  className?: string;
  text?: string;
}

export default function AnimatedLogo({ href = "/dashboard", className = "", text = "PannessAPI" }: AnimatedLogoProps) {
  const content = (
    <div className={`${orbitron.className} tracking-widest ${className}`}>
      <TypeAnimation
        sequence={[
          text,
          3000, 
          '', 
          500,
        ]}
        wrapper="span"
        cursor={true}
        repeat={Infinity}
      />
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
