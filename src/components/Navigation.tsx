import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/who-we-are", label: "Who We Are" },
    { href: "/what-we-do", label: "What We Do" },
    { href: "/programs", label: "Programs" },
    { href: "/podcast", label: "Podcast" },
    { href: "/events", label: "Events" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/donate", label: "Donate" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-24">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative w-20 h-20 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Kelly's Angels Inc."
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-2xl font-heading font-bold text-foreground">Kelly&apos;s Angels Inc.</div>
              <div className="text-sm text-muted-foreground">Bringing Smiles to Children</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md hover:shadow-lg transition-all">
              <Link href="/programs">Apply Now</Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-6 space-y-2 border-t border-border/50 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-4">
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                <Link href="/programs">Apply Now</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}