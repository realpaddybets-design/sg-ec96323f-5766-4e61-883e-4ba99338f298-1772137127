import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, DollarSign, Sparkles } from "lucide-react";

export default function WhatWeDo() {
  return (
    <>
      <SEO
        title="What We Do - Kelly's Angels Inc."
        description="Kelly's Angels Inc. provides grants to children and families in New York's Capital Region affected by loss, including Fun Grants, Angel Aid, Angel Hug, and more."
        image="/og-image.png"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <section className="bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-16 md:py-24">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground">
                  What We Do
                </h1>
                <p className="text-xl text-muted-foreground">
                  Supporting families through grants, events, and compassionate care
                </p>
              </div>
            </div>
          </section>

          <section className="section-padding bg-background">
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    Kelly's Angels Inc. provides grants and support to benefit children in New York's Capital Region 
                    who have been affected by the loss of a parent or sibling to cancer or other illness. Our programs 
                    are designed to bring joy, relief, and hope during the most challenging times.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <Card className="card-shadow border-border">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Heart className="text-primary" size={32} />
                      </div>
                      <CardTitle className="text-2xl font-heading">Fun Grants</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Fun Grants are designed to create joyful memories for children who have lost a loved one. 
                        These grants provide tickets to events, theme parks, Broadway shows, concerts, sporting events, 
                        and other experiences that bring smiles and happiness during difficult times.
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        Examples: Disney World trips, Six Flags passes, concert tickets, special experiences
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="card-shadow border-border">
                    <CardHeader>
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                        <Users className="text-accent" size={32} />
                      </div>
                      <CardTitle className="text-2xl font-heading">Angel Aid</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Angel Aid provides one-time financial support to families struggling due to the loss of a 
                        loved one or overwhelming healthcare costs. This assistance helps cover basic needs, medical 
                        expenses, or other urgent financial burdens during times of crisis.
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        Examples: Medical bills, funeral costs, utility assistance, emergency expenses
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="card-shadow border-border">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="text-primary" size={32} />
                      </div>
                      <CardTitle className="text-2xl font-heading">Angel Hug</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Angel Hug grants provide modest financial support to surviving parents who need a moment of 
                        relief and self-care. These grants can be used for travel, entertainment, pampering, or any 
                        activity that helps parents recharge while caring for their children.
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        Examples: Weekend getaways, spa treatments, date nights, personal respite
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="card-shadow border-border">
                    <CardHeader>
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                        <DollarSign className="text-accent" size={32} />
                      </div>
                      <CardTitle className="text-2xl font-heading">Scholarships</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Our scholarship program supports college-bound seniors at 14 Capital Region high schools who 
                        have persevered through adversity, served others (especially children), and demonstrate 
                        financial need. We honor students who embody Kelly's spirit of compassion and resilience.
                      </p>
                      <Button asChild variant="outline" size="sm" className="mt-2">
                        <Link href="/scholarships">Learn More About Scholarships</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-secondary/30 rounded-lg p-8 border border-border mb-12">
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 text-center">
                    Hugs for Ukraine Campaign
                  </h2>
                  <p className="text-muted-foreground text-center leading-relaxed max-w-3xl mx-auto">
                    Kelly's Angels Inc. extends support to Ukrainian families who have been relocated to New York's 
                    Capital Region. Through our Hugs for Ukraine initiative, we provide one-time grants for children 
                    affected by the ongoing conflict. Families can be nominated through our main application form.
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-heading font-bold text-foreground">
                    Ready to Apply?
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    If you know a family in need, we're here to help. Applications are reviewed by our volunteer 
                    staff, and we work quickly to bring smiles to children during difficult times.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                      <Link href="/programs">Apply for a Grant</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
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