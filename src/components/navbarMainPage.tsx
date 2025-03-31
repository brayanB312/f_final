"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white text-black shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="#main_section" className="flex items-center text-xl space-x-4 font-bold text-black no-underline">
            <Image src="/logo.png" alt="Logo" width={40} height={40}/>
            <span>FamilyShare</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
