import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Programs() {
  return (
    <>
      <SEO
        title="Programs & Applications - Kelly's Angels Inc."
        description="Apply for Fun Grants, Angel Aid, Angel Hug, or nominate a family for support. Kelly's Angels Inc. is here to help children and families in need."
        image="/og-image.png"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <section className="bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-16 md:py-24">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground">
                  Programs & Applications
                </h1>
                <p className="text-xl text-muted-foreground">
                  Apply for grants to help children and families smile during difficult times
                </p>
              </div>
            </div>
          </section>

          <section className="section-padding bg-background">
            <div className="container">
              <div className="max-w-4xl mx-auto space-y-12">
                <Alert className="border-primary/50 bg-primary/5">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <AlertDescription className="text-foreground">
                    <strong>Application Database Coming Soon:</strong> We're currently upgrading our application system 
                    to better serve families in need. In the meantime, you can still apply by contacting us directly 
                    at the mailing address below or through our temporary form. All applications are reviewed by our 
                    volunteer staff.
                  </AlertDescription>
                </Alert>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-foreground mb-6 text-center">
                      Available Grant Programs
                    </h2>
                    <p className="text-muted-foreground text-center mb-8">
                      Select the program that best fits your needs. All programs are designed to help children and 
                      families in New York's Capital Region affected by loss or illness.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="card-shadow border-border hover:border-primary transition-colors">
                      <CardHeader>
                        <CardTitle className="text-xl font-heading">Fun Grants</CardTitle>
                        <CardDescription>
                          Tickets to events, theme parks, and experiences that create joyful memories
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          For children who have lost a loved one and need opportunities to smile and enjoy life.
                        </p>
                        <Button className="w-full bg-primary hover:bg-primary/90" disabled>
                          <FileText className="mr-2 h-4 w-4" />
                          Apply for Fun Grant (Coming Soon)
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="card-shadow border-border hover:border-accent transition-colors">
                      <CardHeader>
                        <CardTitle className="text-xl font-heading">Angel Aid</CardTitle>
                        <CardDescription>
                          One-time financial support for families facing hardship
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Emergency assistance for medical bills, funeral costs, or urgent expenses.
                        </p>
                        <Button className="w-full bg-accent hover:bg-accent/90" disabled>
                          <FileText className="mr-2 h-4 w-4" />
                          Apply for Angel Aid (Coming Soon)
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="card-shadow border-border hover:border-primary transition-colors">
                      <CardHeader>
                        <CardTitle className="text-xl font-heading">Angel Hug</CardTitle>
                        <CardDescription>
                          Support for surviving parents who need self-care and relief
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Modest grants for travel, entertainment, or pampering to help parents recharge.
                        </p>
                        <Button className="w-full bg-primary hover:bg-primary/90" disabled>
                          <FileText className="mr-2 h-4 w-4" />
                          Apply for Angel Hug (Coming Soon)
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="card-shadow border-border hover:border-accent transition-colors">
                      <CardHeader>
                        <CardTitle className="text-xl font-heading">Hugs for Ukraine</CardTitle>
                        <CardDescription>
                          Support for Ukrainian families relocated to the Capital Region
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          One-time grants for children affected by the ongoing conflict. Nominate a family in need.
                        </p>
                        <Button className="w-full bg-accent hover:bg-accent/90" disabled>
                          <FileText className="mr-2 h-4 w-4" />
                          Nominate a Family (Coming Soon)
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-8 border border-border">
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-4 text-center">
                    How to Apply
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="text-center">
                      While we finalize our new application system, please contact us directly:
                    </p>
                    <div className="bg-white rounded-lg p-6 border border-border">
                      <p className="font-semibold text-foreground mb-2">Mailing Address:</p>
                      <p>Kelly's Angels Inc.</p>
                      <p>P.O. Box 2034</p>
                      <p>Wilton, NY 12831</p>
                    </div>
                    <p className="text-sm text-center">
                      All applications are reviewed by our volunteer staff. We work to respond quickly to help 
                      families in need.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Looking for scholarship information?
                  </p>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/scholarships">View Scholarship Program</Link>
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