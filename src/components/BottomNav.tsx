"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/osint", label: "Osint", icon: Search },
  { href: "/dashboard/whatsapp-panel", label: "WA Panel", icon: MessageCircle },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
            style={{ position: "relative" }}
          >
            {/* Sliding top indicator */}
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-6 h-[3px] bg-emerald-500 rounded-b-md"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                style={{ translateX: "-50%" }}
              />
            )}
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} className="relative z-10" />
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
