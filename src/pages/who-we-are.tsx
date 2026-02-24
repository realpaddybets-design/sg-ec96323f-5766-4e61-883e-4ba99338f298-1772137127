import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function WhoWeAre() {
  return (
    <>
      <SEO
        title="Who We Are - Kelly's Angels Inc."
        description="Learn about Kelly Mulholland's legacy and how Kelly's Angels Inc. was founded to honor her memory by helping children and families during difficult times."
        image="/og-image.png"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <section className="bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-16 md:py-24">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground">
                  Who We Are
                </h1>
                <p className="text-xl text-muted-foreground">
                  A legacy of love, compassion, and helping children smile
                </p>
              </div>
            </div>
          </section>

          <section className="section-padding bg-background">
            <div className="container">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="prose prose-lg max-w-none">
                  <div className="flex items-center justify-center mb-8">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                      <Heart className="text-white" size={40} fill="currentColor" />
                    </div>
                  </div>

                  <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-6">
                    Kelly's Story
                  </h2>

                  <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <p>
                      Kelly's Angels Inc. was founded by WNYT-TV anchor and reporter <strong>Mark Mulholland</strong> in loving memory 
                      of his late wife, <strong>Kelly Mulholland</strong>, who passed away from cancer in 2007 at the age of 37.
                    </p>

                    <p>
                      Kelly was a devoted wife, mother, and elementary school teacher who had a profound passion for helping children. 
                      Her warmth, compassion, and dedication to making a difference in young lives inspired everyone who knew her. 
                      Even during her own battle with illness, Kelly's focus remained on bringing joy to others, especially children.
                    </p>

                    <p>
                      In her memory, Mark established Kelly's Angels Inc. as a 501(c)(3) nonprofit organization to continue Kelly's 
                      mission of supporting children and families in New York's Capital Region who are facing the devastating loss 
                      of a loved one due to cancer or other illnesses.
                    </p>

                    <p>
                      Today, Kelly's Angels Inc. is an <strong>all-volunteer organization</strong> run by a dedicated team of community 
                      members who share Kelly's vision. Every dollar donated goes directly toward helping children and families smile 
                      during their most difficult times—creating joyful memories, providing financial support, and offering hope 
                      during periods of grief and hardship.
                    </p>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-8 border border-border">
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-4 text-center">
                    Our Mission
                  </h3>
                  <p className="text-lg text-muted-foreground text-center leading-relaxed">
                    Kelly's Angels Inc. provides grants and support to benefit children in New York's Capital Region 
                    who have been affected by the loss of a parent or sibling to cancer or other illness. We strive 
                    to bring smiles to children during the most challenging times of their lives.
                  </p>
                </div>

                <div className="text-center pt-6">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link href="/what-we-do">Learn What We Do</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}