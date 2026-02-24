import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Heart, CheckCircle, ExternalLink } from "lucide-react";

export default function Scholarships() {
  const eligibleSchools = [
    "Ballston Spa High School",
    "Burnt Hills-Ballston Lake High School",
    "Galway High School",
    "Mechanicville High School",
    "Saratoga Springs High School",
    "Schuylerville High School",
    "Shenendehowa High School",
    "South Glens Falls High School",
    "Stillwater High School",
    "And other Capital Region schools"
  ];

  return (
    <>
      <SEO
        title="Scholarships - Kelly's Angels Inc."
        description="Annual scholarships for college-bound seniors in New York's Capital Region who have persevered through adversity and served others."
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
                    <GraduationCap className="text-white" size={40} />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground">
                  Scholarship Program
                </h1>
                <p className="text-xl text-muted-foreground">
                  Supporting students who have persevered through adversity
                </p>
              </div>
            </div>
          </section>

          <section className="section-padding bg-background">
            <div className="container">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Kelly&apos;s Angels Inc. awards annual scholarships to college-bound high school seniors 
                    in New York&apos;s Capital Region who have demonstrated resilience in the face of adversity, 
                    a commitment to serving others (especially children), and financial need.
                  </p>
                  <p className="text-muted-foreground">
                    These scholarships honor Kelly Mulholland&apos;s legacy of compassion and dedication to helping children.
                  </p>
                </div>

                <Card className="card-shadow border-border">
                  <CardContent className="p-8 md:p-12 space-y-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="text-primary" size={32} />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                        Eligibility Criteria
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-foreground">High School Senior</p>
                          <p className="text-sm text-muted-foreground">
                            Must be a graduating senior from one of our eligible Capital Region high schools
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-foreground">Perseverance Through Adversity</p>
                          <p className="text-sm text-muted-foreground">
                            Have overcome significant personal challenges, hardship, or loss
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-foreground">Service to Others</p>
                          <p className="text-sm text-muted-foreground">
                            Demonstrated commitment to serving others, especially children and families in need
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-foreground">Financial Need</p>
                          <p className="text-sm text-muted-foreground">
                            Demonstrate financial need for college or post-secondary education
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-foreground">College-Bound</p>
                          <p className="text-sm text-muted-foreground">
                            Planning to attend a college, university, or accredited post-secondary institution
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-secondary/30 rounded-lg p-8 border border-border">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-4 text-center">
                    Eligible High Schools
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    Students from the following Capital Region high schools are eligible to apply:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {eligibleSchools.map((school, index) => (
                      <div key={index} className="flex items-center space-x-2 text-muted-foreground">
                        <span className="text-primary text-lg">•</span>
                        <span>{school}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="card-shadow border-border bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardContent className="p-8 md:p-12 space-y-6 text-center">
                    <h3 className="text-2xl font-heading font-bold text-foreground">
                      How to Apply
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                      Applications are typically available in the spring through your high school guidance office. 
                      Scholarship recipients are announced before graduation. For specific application details and 
                      deadlines, please check with your school counselor or visit our scholarship portal.
                    </p>
                    <div className="pt-4">
                      <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                        <a 
                          href="https://scholarship.kellysangelsinc.org" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Visit Scholarship Portal
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If you have questions, please contact your school guidance office or reach out to 
                      Kelly&apos;s Angels Inc. through our mailing address.
                    </p>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Learn more about our other programs
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="outline" size="lg">
                      <Link href="/programs">View All Programs</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
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