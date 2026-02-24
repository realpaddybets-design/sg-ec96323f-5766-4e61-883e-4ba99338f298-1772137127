import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, DollarSign, Calendar } from "lucide-react";

export default function Home() {
  return (
    <>
      <SEO
        title="Kelly's Angels Inc. - Bringing Smiles to Children"
        description="Kelly's Angels Inc. helps children and their families in New York's Capital Region smile during difficult times by providing grants and support to those affected by loss."
        image="/og-image.png"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <section className="relative bg-gradient-to-br from-primary/10 via-secondary to-accent/10 section-padding">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-tight">
                  Kelly&apos;s Angels Inc.
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-light">
                  Helping children and their families smile during difficult times
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                    <Link href="/programs">Apply for a Grant</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-lg px-8 border-2">
                    <Link href="/donate">Make a Donation</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="section-padding bg-background">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Founded in memory of Kelly Mulholland, Kelly&apos;s Angels Inc. is a 501(c)(3) nonprofit organization 
                  dedicated to supporting children and families in New York&apos;s Capital Region who have been affected 
                  by the loss of a loved one due to cancer or other illnesses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="card-shadow border-border">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="text-primary" size={32} />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-foreground">Fun Grants</h3>
                    <p className="text-sm text-muted-foreground">
                      Creating joyful memories through tickets to events, theme parks, and special experiences
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-shadow border-border">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                      <Users className="text-accent" size={32} />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-foreground">Angel Aid</h3>
                    <p className="text-sm text-muted-foreground">
                      One-time financial support for families struggling due to loss or healthcare costs
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-shadow border-border">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <DollarSign className="text-primary" size={32} />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-foreground">Scholarships</h3>
                    <p className="text-sm text-muted-foreground">
                      Annual scholarships for college-bound seniors who have persevered through adversity
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-shadow border-border">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                      <Calendar className="text-accent" size={32} />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-foreground">Mother-Lovin&apos; 5K</h3>
                    <p className="text-sm text-muted-foreground">
                      Annual event on Mother&apos;s Day weekend supporting our mission to help families
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="section-padding bg-muted">
            <div className="container">
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 md:p-12 border border-border">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                    100% Volunteer Organization
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Kelly&apos;s Angels Inc. is run entirely by volunteers. Every dollar donated goes directly to helping 
                    children and families in need. Your generosity creates smiles and brings hope during the most 
                    challenging times.
                  </p>
                  <div className="pt-4">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                      <Link href="/donate">Support Our Mission</Link>
                    </Button>
                  </div>
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