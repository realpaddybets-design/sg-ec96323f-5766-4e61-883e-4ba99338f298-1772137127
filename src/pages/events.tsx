import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Heart } from "lucide-react";

export default function Events() {
  return (
    <>
      <SEO
        title="Events - Kelly's Angels Inc."
        description="Join us for the Mother-Lovin' 5K and other events supporting children and families in New York's Capital Region."
        image="/og-image.png"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <section className="bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-16 md:py-24">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground">
                  Events
                </h1>
                <p className="text-xl text-muted-foreground">
                  Join us in supporting children and families in need
                </p>
              </div>
            </div>
          </section>

          <section className="section-padding bg-background">
            <div className="container">
              <div className="max-w-5xl mx-auto space-y-12">
                <Card className="card-shadow border-border overflow-hidden">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:p-12 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                        <Heart className="text-white" size={40} fill="currentColor" />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                      Mother-Lovin&apos; 5K
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Our signature annual event held on Mother&apos;s Day weekend to honor all mothers 
                      and support children who have lost a parent or sibling to illness.
                    </p>
                  </div>
                  
                  <CardContent className="p-8 md:p-12 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="text-primary" size={32} />
                        </div>
                        <h3 className="font-heading font-semibold text-foreground mb-2">When</h3>
                        <p className="text-muted-foreground">
                          Mother&apos;s Day Weekend
                          <br />
                          <span className="text-sm">(Typically early May)</span>
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapPin className="text-accent" size={32} />
                        </div>
                        <h3 className="font-heading font-semibold text-foreground mb-2">Where</h3>
                        <p className="text-muted-foreground">
                          New York&apos;s Capital Region
                          <br />
                          <span className="text-sm">(Location details TBA)</span>
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="text-primary" size={32} />
                        </div>
                        <h3 className="font-heading font-semibold text-foreground mb-2">Who</h3>
                        <p className="text-muted-foreground">
                          All ages welcome
                          <br />
                          <span className="text-sm">Runners, walkers, families</span>
                        </p>
                      </div>
                    </div>

                    <div className="prose prose-lg max-w-none">
                      <h3 className="text-2xl font-heading font-bold text-foreground mb-4">About the Event</h3>
                      <div className="space-y-4 text-muted-foreground">
                        <p>
                          The Mother-Lovin&apos; 5K is more than just a race—it&apos;s a celebration of mothers, 
                          families, and the strength of our community. Every registration and donation helps Kelly&apos;s 
                          Angels Inc. provide grants to children who have experienced the loss of a loved one or are 
                          facing serious health challenges.
                        </p>
                        <p>
                          Whether you&apos;re a seasoned runner or prefer a leisurely walk, everyone is welcome to 
                          participate and support our mission. The event features a family-friendly atmosphere with 
                          activities for all ages.
                        </p>
                        <p>
                          <strong className="text-foreground">100% of proceeds</strong> go directly to helping children 
                          and families in need through our Fun Grants, Angel Aid, and other support programs.
                        </p>
                      </div>
                    </div>

                    <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                      <h4 className="text-xl font-heading font-bold text-foreground mb-3 text-center">
                        How to Participate
                      </h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span><strong>Register as a runner or walker</strong> – Individual and team options available</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span><strong>Volunteer</strong> – Help make the event a success</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span><strong>Sponsor</strong> – Support the event through corporate or individual sponsorship</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span><strong>Donate</strong> – Can&apos;t attend? You can still support our mission</span>
                        </li>
                      </ul>
                    </div>

                    <div className="text-center space-y-4">
                      <p className="text-muted-foreground font-medium">
                        Registration details will be announced closer to the event date
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-primary hover:bg-primary/90" disabled>
                          Register for 5K (Coming Soon)
                        </Button>
                        <Button asChild size="lg" variant="outline">
                          <Link href="/donate">Donate Now</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Want to learn more about our programs?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="outline" size="lg">
                      <Link href="/programs">View Programs</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/who-we-are">Our Story</Link>
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