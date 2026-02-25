import React, { useState } from "react";
import Link from "next/link";
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
    <nav className="bg-white/95 backdrop-blur-sm border-b border-border/30 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-20 relative">
          {/* Centered Organization Name */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center group">
            <div className="text-2xl font-serif font-bold text-foreground tracking-wide group-hover:text-primary transition-colors">
              Kelly&apos;s Angels Inc.
            </div>
            <div className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
              Bringing Smiles to Children
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden lg:flex items-center space-x-1 ml-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary/30 rounded-md transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:bg-secondary/50 rounded-lg transition-colors ml-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-1 border-t border-border/30 animate-fade-in">
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
            <div className="px-4 pt-2">
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