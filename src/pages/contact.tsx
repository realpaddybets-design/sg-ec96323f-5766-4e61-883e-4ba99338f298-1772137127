import React from "react";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Heart } from "lucide-react";

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact Us - Kelly's Angels Inc."
        description="Get in touch with Kelly's Angels Inc. We're here to help children and families in New York's Capital Region."
        image="/og-image.png"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <section className="bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-16 md:py-24">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground">
                  Contact Us
                </h1>
                <p className="text-xl text-muted-foreground">
                  We&apos;re here to help
                </p>
              </div>
            </div>
          </section>

          <section className="section-padding bg-background">
            <div className="container">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Kelly&apos;s Angels Inc. is run entirely by volunteers who are passionate about helping children 
                    and families during difficult times. We do our best to respond to all inquiries as quickly as possible.
                  </p>
                </div>

                <Card className="card-shadow border-border">
                  <CardContent className="p-8 md:p-12 space-y-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail size={32} className="text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-heading font-bold text-foreground">Mailing Address</h3>
                        <p className="text-muted-foreground">
                          For applications, donations, or general inquiries, please write to:
                        </p>
                        <div className="pl-4 border-l-2 border-primary/30 text-muted-foreground">
                          <p className="font-medium">Kelly&apos;s Angels Inc.</p>
                          <p>P.O. Box 2034</p>
                          <p>Wilton, NY 12831</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin size={32} className="text-accent" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-heading font-bold text-foreground">Service Area</h3>
                        <p className="text-muted-foreground">
                          We serve children and families in <strong className="text-foreground">New York&apos;s Capital Region</strong>, 
                          including Saratoga, Albany, Schenectady, Rensselaer, and surrounding counties.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart size={32} className="text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-heading font-bold text-foreground">About Response Times</h3>
                        <p className="text-muted-foreground">
                          As an all-volunteer organization, we aim to respond to all inquiries within 5-7 business days. 
                          For urgent grant requests, please mark your correspondence as &quot;Urgent&quot; and we will 
                          prioritize your request.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-secondary/30 rounded-lg p-6 border border-border text-center">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">501(c)(3) Tax Status:</strong> Kelly&apos;s Angels Inc. is a registered 
                    nonprofit organization. All donations are tax-deductible to the fullest extent allowed by law.
                  </p>
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