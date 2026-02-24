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
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl text-white font-heading font-bold">KA</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-heading font-bold text-foreground">Kelly&apos;s Angels</div>
              <div className="text-xs text-muted-foreground">Bringing Smiles to Children</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/programs">Apply Now</Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 text-foreground hover:bg-secondary rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Button asChild className="w-full bg-accent hover:bg-accent/90">
                <Link href="/programs">Apply Now</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}