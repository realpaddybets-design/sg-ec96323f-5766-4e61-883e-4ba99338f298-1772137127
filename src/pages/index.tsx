import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, DollarSign, Calendar, Sparkles, HandHeart } from "lucide-react";

export default function Home() {
  return (
    <>
      <SEO
        title="Kelly's Angels Inc. - Bringing Smiles to Children"
        description="Kelly's Angels Inc. helps children and their families in New York's Capital Region smile during difficult times by providing grants and support to those affected by loss."
        image="/og-image.png"
      />
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10"></div>
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
            
            <div className="relative container section-padding">
              <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
                <div className="relative w-64 h-64 mx-auto mb-6 animate-scale-in">
                  <Image
                    src="/kalogo.webp"
                    alt="Kelly's Angels Inc."
                    fill
                    className="object-contain drop-shadow-xl"
                    priority
                  />
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-tight">
                  Kelly&apos;s Angels Inc.
                </h1>
                
                <p className="text-2xl md:text-3xl text-muted-foreground font-light max-w-3xl mx-auto">
                  Helping children and their families <span className="text-gradient font-semibold">smile</span> during difficult times
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all">
                    <Link href="/programs">Apply for a Grant</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all">
                    <Link href="/donate">Make a Donation</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="section-padding bg-gradient-to-br from-secondary/30 via-white to-muted/30">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center mb-16 space-y-6 animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Heart className="text-primary" size={32} fill="currentColor" />
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground">
                  Our Mission
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Founded in memory of Kelly Mulholland, Kelly&apos;s Angels Inc. is a <strong className="text-foreground">501(c)(3) nonprofit</strong> organization 
                  dedicated to supporting children and families in New York&apos;s Capital Region who have been affected 
                  by the loss of a loved one due to cancer or other illnesses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Sparkles,
                    title: "Fun Grants",
                    description: "Creating joyful memories through tickets to events, theme parks, and special experiences",
                    color: "primary"
                  },
                  {
                    icon: HandHeart,
                    title: "Angel Aid",
                    description: "One-time financial support for families struggling due to loss or healthcare costs",
                    color: "accent"
                  },
                  {
                    icon: DollarSign,
                    title: "Scholarships",
                    description: "Annual scholarships for college-bound seniors who have persevered through adversity",
                    color: "primary"
                  },
                  {
                    icon: Calendar,
                    title: "Mother-Lovin' 5K",
                    description: "Annual event on Mother's Day weekend supporting our mission to help families",
                    color: "accent"
                  }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card key={index} className="card-shadow border-border/50 hover:border-primary/30 transition-all duration-500 group" style={{ animationDelay: `${index * 100}ms` }}>
                      <CardContent className="p-8 text-center space-y-4">
                        <div className={`w-16 h-16 bg-${item.color}/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className={`text-${item.color}`} size={32} />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="section-padding bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-2xl border-primary/20 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                  <CardContent className="relative p-10 md:p-16 text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-full mb-4">
                      <Users className="text-accent" size={40} />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
                      100% Volunteer Organization
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                      Kelly&apos;s Angels Inc. is run entirely by volunteers. <strong className="text-foreground">Every dollar donated</strong> goes directly to helping 
                      children and families in need. Your generosity creates smiles and brings hope during the most 
                      challenging times.
                    </p>
                    <div className="pt-6">
                      <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-all">
                        <Link href="/donate">Support Our Mission</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}