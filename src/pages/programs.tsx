import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ApplicationForm } from "@/components/ApplicationForm";
import { funGrantSchema, angelAidSchema, angelHugSchema, hugsForUkraineSchema } from "@/lib/applicationSchema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, DollarSign, Sparkles, Globe } from "lucide-react";

export default function Programs() {
  return (
    <>
      <SEO
        title="Programs & Applications - Kelly's Angels Inc."
        description="Apply for Fun Grants, Angel Aid, Angel Hug, or Hugs for Ukraine programs. We help children and families in NY's Capital Region affected by loss."
      />

      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
        <Navigation />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
                Our Grant Programs
              </h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Kelly's Angels offers several grant programs to support children and families in New York's Capital
                Region who have been affected by loss. Select a program below to learn more and apply.
              </p>
            </div>

            {/* Application Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="fun_grant">Fun Grant</TabsTrigger>
                <TabsTrigger value="angel_aid">Angel Aid</TabsTrigger>
                <TabsTrigger value="angel_hug">Angel Hug</TabsTrigger>
                <TabsTrigger value="hugs_for_ukraine">Hugs for Ukraine</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="card-shadow hover:scale-[1.02] transition-transform">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Heart className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl">Fun Grant</CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        Creating joyful memories for children who have lost a parent or sibling
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">
                        Provides experiences like tickets to sporting events, theme parks, Broadway shows, or other
                        activities that bring smiles during difficult times.
                      </p>
                      <p className="text-sm font-semibold text-primary">Typical Range: $100 - $5,000</p>
                    </CardContent>
                  </Card>

                  <Card className="card-shadow hover:scale-[1.02] transition-transform">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl">Angel Aid</CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        Financial support for families struggling with expenses after loss
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">
                        One-time grants to help with overwhelming medical bills, funeral costs, or daily living expenses
                        for families adjusting to life after losing a loved one.
                      </p>
                      <p className="text-sm font-semibold text-primary">Typical Range: $500 - $10,000</p>
                    </CardContent>
                  </Card>

                  <Card className="card-shadow hover:scale-[1.02] transition-transform">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl">Angel Hug</CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        Self-care support for surviving parents and guardians
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">
                        Modest grants for surviving parents to take care of themselves—travel, entertainment, pampering,
                        or simple breaks that help during the grieving process.
                      </p>
                      <p className="text-sm font-semibold text-primary">Typical Range: Up to $500</p>
                    </CardContent>
                  </Card>

                  <Card className="card-shadow hover:scale-[1.02] transition-transform">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl">Hugs for Ukraine</CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        Supporting Ukrainian families relocated to the Capital Region
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">
                        One-time grants for children in Ukrainian families who have been relocated to New York's Capital
                        Region, helping them adjust to their new lives.
                      </p>
                      <p className="text-sm font-semibold text-primary">Typical Range: $100 - $2,000</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-lg text-primary mb-2">Ready to Apply?</h3>
                  <p className="text-gray-700">
                    Select a program tab above to complete the application form. All applications are reviewed by our
                    volunteer staff, and we typically respond within 5-7 business days.
                  </p>
                </div>
              </TabsContent>

              {/* Fun Grant Application */}
              <TabsContent value="fun_grant">
                <ApplicationForm
                  type="fun_grant"
                  schema={funGrantSchema}
                  title="Fun Grant Application"
                  description="Help us create joyful memories for your child. Tell us about an experience or activity that would bring smiles during this difficult time."
                />
              </TabsContent>

              {/* Angel Aid Application */}
              <TabsContent value="angel_aid">
                <ApplicationForm
                  type="angel_aid"
                  schema={angelAidSchema}
                  title="Angel Aid Application"
                  description="Apply for financial assistance to help with overwhelming expenses after loss. We're here to support your family during this challenging time."
                />
              </TabsContent>

              {/* Angel Hug Application */}
              <TabsContent value="angel_hug">
                <ApplicationForm
                  type="angel_hug"
                  schema={angelHugSchema}
                  title="Angel Hug Application"
                  description="Surviving parents need care too. Apply for a modest grant to help you recharge and take care of yourself during the grieving process."
                />
              </TabsContent>

              {/* Hugs for Ukraine Application */}
              <TabsContent value="hugs_for_ukraine">
                <ApplicationForm
                  type="hugs_for_ukraine"
                  schema={hugsForUkraineSchema}
                  title="Hugs for Ukraine Application"
                  description="Supporting Ukrainian children and families who have been relocated to New York's Capital Region."
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}