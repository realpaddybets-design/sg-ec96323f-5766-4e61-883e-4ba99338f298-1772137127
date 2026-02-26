import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ApplicationForm } from "@/components/ApplicationForm";
import { funGrantSchema, angelAidSchema, angelHugSchema, hugsForUkraineSchema } from "@/lib/applicationSchema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, DollarSign, Sparkles, Globe, CheckCircle2, FileText, Send } from "lucide-react";

type GrantType = "fun_grant" | "angel_aid" | "angel_hug" | "hugs_for_ukraine";

export default function Grants() {
  const [selectedGrant, setSelectedGrant] = useState<GrantType | null>(null);

  const grantTypes = [
    {
      id: "fun_grant" as GrantType,
      icon: Heart,
      title: "Fun Grant",
      description: "Create joyful memories through experiences",
      range: "$100 - $5,000",
      schema: funGrantSchema,
      color: "primary"
    },
    {
      id: "angel_aid" as GrantType,
      icon: DollarSign,
      title: "Angel Aid",
      description: "Financial support for families after loss",
      range: "$500 - $10,000",
      schema: angelAidSchema,
      color: "accent"
    },
    {
      id: "angel_hug" as GrantType,
      icon: Sparkles,
      title: "Angel Hug",
      description: "Self-care support for surviving parents",
      range: "Up to $500",
      schema: angelHugSchema,
      color: "primary"
    },
    {
      id: "hugs_for_ukraine" as GrantType,
      icon: Globe,
      title: "Hugs for Ukraine",
      description: "Support for Ukrainian families in the Capital Region",
      range: "$100 - $2,000",
      schema: hugsForUkraineSchema,
      color: "accent"
    }
  ];

  const selectedGrantData = grantTypes.find(g => g.id === selectedGrant);

  return (
    <>
      <SEO
        title="Apply for Grants - Kelly's Angels Inc."
        description="Apply for Fun Grants, Angel Aid, Angel Hug, or Hugs for Ukraine. We help children and families in NY's Capital Region affected by loss."
      />

      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
        <Navigation />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {!selectedGrant ? (
              <>
                {/* Header */}
                <div className="text-center mb-12 max-w-3xl mx-auto">
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
                    Apply for a Grant
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Kelly's Angels provides financial support to children and families in New York's Capital Region 
                    who have been affected by loss. Select a grant type below to begin your application.
                  </p>
                </div>

                {/* Grant Selection Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                  {grantTypes.map((grant) => {
                    const Icon = grant.icon;
                    return (
                      <Card 
                        key={grant.id} 
                        className="card-shadow hover:border-primary/30 transition-all cursor-pointer group"
                        onClick={() => setSelectedGrant(grant.id)}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-12 h-12 bg-${grant.color}/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <Icon className={`text-${grant.color}`} size={24} />
                            </div>
                            <CardTitle className="text-2xl">{grant.title}</CardTitle>
                          </div>
                          <CardDescription className="text-base">
                            {grant.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-semibold text-primary mb-4">Typical Range: {grant.range}</p>
                          <Button className="w-full bg-primary hover:bg-primary/90">
                            Apply for {grant.title}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Application Process */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center text-foreground mb-8">How It Works</h2>
                  <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {[
                      { icon: FileText, title: "1. Choose a Grant", desc: "Select the grant type that best fits your needs" },
                      { icon: Send, title: "2. Submit Application", desc: "Fill out the simple online form with your story" },
                      { icon: CheckCircle2, title: "3. We Review & Respond", desc: "Our team reviews and responds within 5-7 business days" }
                    ].map((step, idx) => {
                      const StepIcon = step.icon;
                      return (
                        <div key={idx} className="text-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <StepIcon className="text-primary" size={32} />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Eligibility */}
                <Card className="mb-16 max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl">Eligibility Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                      <p>Child or family member resides in New York's Capital Region (Albany, Rensselaer, Saratoga, Schenectady, Warren, Washington counties)</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                      <p>Child has lost a parent or sibling to cancer or other illness, or family is dealing with ongoing healthcare challenges</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                      <p>For Hugs for Ukraine: Ukrainian family relocated to the Capital Region</p>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQs */}
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold text-center text-foreground mb-8">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-left">How long does the application process take?</AccordionTrigger>
                      <AccordionContent>
                        Our volunteer board reviews applications as they come in. You can typically expect a response within 5-7 business days. In urgent situations, please note that in your application and we'll do our best to expedite the review.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-left">Can I apply for multiple grant types?</AccordionTrigger>
                      <AccordionContent>
                        Yes! Families can apply for different grant types based on their needs. For example, you might apply for Angel Aid for medical bills and a Fun Grant for an experience. Each application is reviewed separately.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-left">What information do I need to provide?</AccordionTrigger>
                      <AccordionContent>
                        The application asks for basic contact information, details about your situation, and what you're requesting support for. We understand this can be difficult to share, and our team reviews every application with compassion and confidentiality.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-left">Is my information kept confidential?</AccordionTrigger>
                      <AccordionContent>
                        Absolutely. All applications are reviewed only by our board members and kept strictly confidential. We will never share your personal information without your explicit consent.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-left">What if my application is not approved?</AccordionTrigger>
                      <AccordionContent>
                        We wish we could help everyone who applies, but our resources are limited. If your application isn't approved, we'll do our best to provide information about other local resources that might be able to help. You're also welcome to reapply in the future if circumstances change.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* CTA */}
                <div className="mt-16 text-center p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Choose a grant type above to get started. Our team is here to help bring smiles during difficult times.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Questions? <Link href="/contact" className="text-primary hover:underline font-medium">Contact us</Link> and we'll be happy to help.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Application Form View */}
                <div className="max-w-3xl mx-auto">
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedGrant(null)}
                    className="mb-6"
                  >
                    ← Back to Grant Selection
                  </Button>
                  
                  <ApplicationForm
                    type={selectedGrant}
                    schema={selectedGrantData!.schema}
                    title={`${selectedGrantData!.title} Application`}
                    description={selectedGrantData!.description}
                  />
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}