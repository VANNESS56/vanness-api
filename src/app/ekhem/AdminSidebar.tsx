"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Ticket, FileText, ArrowLeft, MessageSquareText, History } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/ekhem", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/ekhem/users", label: "Manage User", icon: <Users size={20} /> },
    { href: "/ekhem/history", label: "Riwayat API", icon: <History size={20} /> },
    { href: "/ekhem/tickets", label: "Support Tickets", icon: <MessageSquareText size={20} /> },
    { href: "/ekhem/vouchers", label: "Generate Voucher", icon: <Ticket size={20} /> },
    { href: "/ekhem/laporan", label: "Laporan", icon: <FileText size={20} /> },
  ];

  return (
    <div className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen p-4 flex flex-col">
      <div className="font-bold text-2xl text-[var(--color-primary)] mb-8 px-4 mt-2">
        <AnimatedLogo text="Panness Admin" href="" />
      </div>
      
      <nav className="flex-1 space-y-2">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? "bg-blue-50 text-[var(--color-primary)] font-semibold" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-gray-100 pt-4">
        <Link 
          href="/dashboard"
          className="flex items-center px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <span className="mr-3"><ArrowLeft size={20} /></span>
          Ke Web User
        </Link>
      </div>
    </div>
  );
}
