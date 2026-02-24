import React from "react";
import Link from "next/link";
import { Heart, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Heart className="text-white" size={20} fill="currentColor" />
              </div>
              <div className="text-lg font-heading font-bold text-foreground">Kelly&apos;s Angels Inc.</div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              A 501(c)(3) nonprofit organization dedicated to helping children and families smile during difficult times.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Kelly&apos;s Angels Inc. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/who-we-are" className="text-muted-foreground hover:text-primary transition-colors">
                  Who We Are
                </Link>
              </li>
              <li>
                <Link href="/what-we-do" className="text-muted-foreground hover:text-primary transition-colors">
                  What We Do
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-muted-foreground hover:text-primary transition-colors">
                  Programs & Applications
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-muted-foreground hover:text-primary transition-colors">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Mailing Address</p>
                  <p>P.O. Box 2034</p>
                  <p>Wilton, NY 12831</p>
                </div>
              </div>
              <div>
                <p className="text-xs">
                  Kelly&apos;s Angels Inc. is an all-volunteer organization. 100% of donations directly support children and families in need.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            {" | "}
            <Link href="/staff-login" className="hover:text-primary transition-colors">
              Staff Login
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}