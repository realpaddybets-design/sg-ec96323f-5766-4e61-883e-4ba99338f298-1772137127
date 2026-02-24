import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, DollarSign, Users, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Donate() {
  return (
    <>
      <SEO
        title="Donate - Kelly's Angels Inc."
        description="Support Kelly's Angels Inc. - a 501(c)(3) nonprofit. 100% of donations go directly to helping children and families in need."
        image="/og-image.png"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <section className="bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-16 md:py-24">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center">
                    <Heart className="text-white" size={40} fill="currentColor" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground">
                  Make a Donation
                </h1>
                <p className="text-xl text-muted-foreground">
                  Every dollar brings smiles to children during difficult times
                </p>
              </div>
            </div>
          </section>

          <section className="section-padding bg-background">
            <div className="container">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="bg-primary/5 rounded-lg p-8 border-2 border-primary/20">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <Users className="text-white" size={32} />
                      </div>
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-foreground">
                      100% Volunteer Organization
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                      Kelly&apos;s Angels Inc. is run entirely by volunteers. <strong className="text-foreground">Every single dollar</strong> you 
                      donate goes directly to helping children and families in need. No overhead, no administrative fees—just 
                      pure support for those facing the most difficult times of their lives.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Kelly&apos;s Angels Inc. is a registered 501(c)(3) nonprofit organization. Your donation is tax-deductible.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
                    Your Impact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="card-shadow border-border text-center">
                      <CardHeader>
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="text-primary" size={32} />
                        </div>
                        <CardTitle className="text-lg font-heading">Fun Grants</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Create joyful memories through tickets to theme parks, concerts, and special events
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="card-shadow border-border text-center">
                      <CardHeader>
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Heart className="text-accent" size={32} />
                        </div>
                        <CardTitle className="text-lg font-heading">Angel Aid</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Provide emergency financial support for families facing medical bills or urgent expenses
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="card-shadow border-border text-center">
                      <CardHeader>
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <DollarSign className="text-primary" size={32} />
                        </div>
                        <CardTitle className="text-lg font-heading">Scholarships</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Help college-bound students who have persevered through adversity achieve their dreams
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card className="card-shadow border-border">
                  <CardContent className="p-8 md:p-12 space-y-6">
                    <h3 className="text-2xl font-heading font-bold text-foreground text-center mb-6">
                      How to Donate
                    </h3>

                    <Alert className="border-primary/50 bg-primary/5">
                      <Heart className="h-5 w-5 text-primary" />
                      <AlertDescription className="text-foreground">
                        <strong>Stripe Integration Coming Soon:</strong> We&apos;re upgrading our donation system 
                        to accept online payments through Stripe. In the meantime, you can donate by mail.
                      </AlertDescription>
                    </Alert>

                    <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail size={24} className="text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-heading font-semibold text-foreground">Donate by Mail</h4>
                          <p className="text-sm text-muted-foreground">
                            Make checks payable to <strong className="text-foreground">Kelly&apos;s Angels Inc.</strong> and mail to:
                          </p>
                          <div className="pl-4 border-l-2 border-primary/30 text-muted-foreground">
                            <p>Kelly&apos;s Angels Inc.</p>
                            <p>P.O. Box 2034</p>
                            <p>Wilton, NY 12831</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-4">
                      <Button size="lg" className="bg-primary hover:bg-primary/90" disabled>
                        Donate Online (Coming Soon)
                      </Button>
                      <p className="text-xs text-muted-foreground mt-3">
                        Secure online donations powered by Stripe will be available soon
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg p-8 border border-border">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-heading font-bold text-foreground">
                      Other Ways to Support
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-3xl mx-auto">
                      <div className="text-left space-y-2">
                        <h4 className="font-heading font-semibold text-foreground">Join the Mother-Lovin&apos; 5K</h4>
                        <p className="text-sm text-muted-foreground">
                          Participate in our annual event on Mother&apos;s Day weekend. Registration fees support our programs.
                        </p>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/events">Learn More</Link>
                        </Button>
                      </div>
                      <div className="text-left space-y-2">
                        <h4 className="font-heading font-semibold text-foreground">Volunteer Your Time</h4>
                        <p className="text-sm text-muted-foreground">
                          Help with events, fundraising, or administrative tasks. Every hour makes a difference.
                        </p>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/contact">Contact Us</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Questions about donating or our programs?
                  </p>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/contact">Get in Touch</Link>
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