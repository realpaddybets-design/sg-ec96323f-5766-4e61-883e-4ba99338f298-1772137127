import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Podcast as PodcastIcon, ExternalLink, Heart } from "lucide-react";

export default function Podcast() {
  const platforms = [
    { name: "Apple Podcasts", url: "#", color: "bg-purple-500" },
    { name: "Spotify", url: "#", color: "bg-green-500" },
    { name: "Google Podcasts", url: "#", color: "bg-blue-500" },
    { name: "Other Platforms", url: "#", color: "bg-gray-500" },
  ];

  return (
    <>
      <SEO
        title="The Up Beat Podcast - Kelly's Angels Inc."
        description="Listen to The Up Beat podcast for hope and inspiration. Stories from families dealing with loss and adversity, available on all major podcast platforms."
        image="/og-image.png"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <section className="bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-16 md:py-24">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                    <PodcastIcon className="text-white" size={40} />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground">
                  The Up Beat Podcast
                </h1>
                <p className="text-xl text-muted-foreground">
                  Hope and inspiration for families dealing with loss and adversity
                </p>
              </div>
            </div>
          </section>

          <section className="section-padding bg-background">
            <div className="container">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-6 text-center">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    The Up Beat podcast offers hope, inspiration, and real stories from families who have faced loss 
                    and adversity. Hosted by Mark Mulholland, founder of Kelly's Angels Inc., each episode features 
                    candid conversations with individuals who have found strength, resilience, and moments of joy 
                    during life's most challenging times.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Whether you're navigating grief, supporting a loved one, or simply looking for uplifting stories 
                    of perseverance, The Up Beat provides a community of understanding and encouragement.
                  </p>
                </div>

                <Card className="card-shadow border-border">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
                      Listen Now
                    </h2>
                    <p className="text-muted-foreground text-center mb-6">
                      The Up Beat is available on all major podcast platforms:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {platforms.map((platform) => (
                        <Button
                          key={platform.name}
                          asChild
                          variant="outline"
                          size="lg"
                          className="w-full hover:bg-secondary"
                        >
                          <a href={platform.url} target="_blank" rel="noopener noreferrer">
                            <div className={`w-3 h-3 rounded-full ${platform.color} mr-3`} />
                            {platform.name}
                            <ExternalLink className="ml-auto h-4 w-4" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 border border-border">
                  <div className="text-center space-y-4">
                    <Heart className="mx-auto text-primary" size={48} />
                    <h3 className="text-2xl font-heading font-bold text-foreground">
                      Have a Story to Share?
                    </h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      If you or someone you know has a story of resilience, hope, or perseverance through loss, 
                      we'd love to hear from you. The Up Beat is always looking for guests who can inspire others 
                      with their journey.
                    </p>
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 mt-4">
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Learn more about Kelly's Angels Inc. and our mission
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="outline" size="lg">
                      <Link href="/who-we-are">Who We Are</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/what-we-do">What We Do</Link>
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