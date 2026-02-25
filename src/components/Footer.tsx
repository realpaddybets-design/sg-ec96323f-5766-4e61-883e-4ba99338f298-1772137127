import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-muted via-secondary to-muted border-t border-border/50">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative w-16 h-16">
                <Image
                  src="/logo.png"
                  alt="Kelly's Angels Inc."
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-xl font-heading font-bold text-foreground">Kelly&apos;s Angels Inc.</div>
                <div className="text-sm text-muted-foreground">501(c)(3) Nonprofit</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Dedicated to helping children and families smile during difficult times. Founded in memory of Kelly Mulholland.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Heart size={14} className="text-primary" fill="currentColor" />
              © {new Date().getFullYear()} Kelly&apos;s Angels Inc. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-base font-heading font-bold text-foreground mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/who-we-are" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                  Who We Are
                </Link>
              </li>
              <li>
                <Link href="/what-we-do" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                  What We Do
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                  Programs & Applications
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                  Mother-Lovin&apos; 5K
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                  Scholarships
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-heading font-bold text-foreground mb-6">Contact</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Mailing Address</p>
                  <p>P.O. Box 2034</p>
                  <p>Wilton, NY 12831</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail size={18} className="mt-0.5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Get in Touch</p>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs leading-relaxed">
                  <strong className="text-foreground">100% Volunteer Organization</strong><br />
                  Every donation directly supports children and families in need.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            {" | "}
            <Link href="/staff/login" className="hover:text-primary transition-colors">
              Staff Login
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}