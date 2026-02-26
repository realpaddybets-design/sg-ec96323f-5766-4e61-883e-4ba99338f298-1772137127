import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, DollarSign, Sparkles, GraduationCap } from "lucide-react";

export default function About() {
  return (
    <>
      <SEO
        title="About Us - Kelly's Angels Inc."
        description="Learn about Kelly Mulholland's legacy and how Kelly's Angels Inc. supports children and families in New York's Capital Region through grants, scholarships, and compassionate care."
        image="/og-image.png"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 py-20 md:py-32">
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-900 leading-tight">
                      Bringing Smiles During Life's Hardest Moments
                    </h1>
                    <p className="text-xl text-gray-700 leading-relaxed">
                      Kelly's Angels Inc. honors the legacy of Kelly Mulholland by supporting children 
                      and families in New York's Capital Region who face loss due to cancer or illness.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                        <Link href="/programs">Apply for Support</Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href="/donate">Donate Now</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                    {/* Photo Placeholder: Kelly's photo or family photo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                      <div className="text-center p-8">
                        <Heart className="w-24 h-24 text-purple-600 mx-auto mb-4" fill="currentColor" />
                        <p className="text-lg text-purple-900 font-semibold">Photo: Kelly Mulholland</p>
                        <p className="text-sm text-purple-700">1970-2007</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="py-20 bg-white">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">Our Story</h2>
                  <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p>
                      Kelly's Angels Inc. was founded by <strong>WNYT-TV anchor Mark Mulholland</strong> in 
                      loving memory of his wife, <strong>Kelly Mulholland</strong>, who passed away from cancer 
                      in 2007 at age 37.
                    </p>
                    <p>
                      Kelly was a devoted wife, mother, and elementary school teacher with a profound passion 
                      for helping children. Her warmth and compassion inspired everyone who knew her. Even during 
                      her battle with illness, Kelly's focus remained on bringing joy to others.
                    </p>
                    <p>
                      In her memory, Mark established this 501(c)(3) nonprofit to continue Kelly's mission of 
                      supporting children and families facing devastating loss.
                    </p>
                  </div>
                  <div className="relative h-[350px] rounded-xl overflow-hidden shadow-xl">
                    {/* Photo Placeholder: Mark and Kelly or family photo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <div className="text-center p-6">
                        <Users className="w-20 h-20 text-purple-600 mx-auto mb-3" />
                        <p className="text-purple-900 font-semibold">Photo: Kelly & Mark Mulholland</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="text-white" size={24} fill="currentColor" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-purple-900 mb-3">Our Mission</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          Kelly's Angels Inc. provides grants and support to children in New York's Capital Region 
                          affected by the loss of a parent or sibling to cancer or illness. We strive to bring 
                          smiles during the most challenging times, creating joyful memories and offering hope.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-center text-gray-700 leading-relaxed">
                    <strong>100% Volunteer-Run Organization:</strong> Every dollar donated goes directly to helping 
                    children and families. Our dedicated team of community volunteers share Kelly's vision of 
                    compassionate care and support.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What We Do Section */}
          <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="container">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">How We Help</h2>
                  <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                    Our programs bring joy, relief, and hope to children and families during their most difficult times.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Fun Grants */}
                  <Card className="hover:shadow-xl transition-shadow border-purple-200">
                    <CardHeader>
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <Heart className="text-purple-600" size={32} />
                      </div>
                      <CardTitle className="text-2xl text-purple-900">Fun Grants</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-700">
                        Create joyful memories through tickets to theme parks, concerts, sporting events, 
                        Broadway shows, and special experiences.
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        Examples: Disney World trips, Six Flags passes, concert tickets
                      </p>
                    </CardContent>
                  </Card>

                  {/* Angel Aid */}
                  <Card className="hover:shadow-xl transition-shadow border-pink-200">
                    <CardHeader>
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="text-pink-600" size={32} />
                      </div>
                      <CardTitle className="text-2xl text-purple-900">Angel Aid</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-700">
                        One-time financial support for families struggling with loss or overwhelming healthcare 
                        costs, covering basic needs and urgent expenses.
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        Examples: Medical bills, funeral costs, utility assistance
                      </p>
                    </CardContent>
                  </Card>

                  {/* Angel Hug */}
                  <Card className="hover:shadow-xl transition-shadow border-purple-200">
                    <CardHeader>
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="text-purple-600" size={32} />
                      </div>
                      <CardTitle className="text-2xl text-purple-900">Angel Hug</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-700">
                        Support for surviving parents who need self-care and respite while caring for their 
                        children during difficult times.
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        Examples: Weekend getaways, spa treatments, personal respite
                      </p>
                    </CardContent>
                  </Card>

                  {/* Scholarships */}
                  <Card className="hover:shadow-xl transition-shadow border-pink-200">
                    <CardHeader>
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                        <GraduationCap className="text-pink-600" size={32} />
                      </div>
                      <CardTitle className="text-2xl text-purple-900">Scholarships</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-700">
                        Support college-bound seniors at 14 Capital Region high schools who have persevered 
                        through adversity and served others.
                      </p>
                      <Button asChild variant="outline" size="sm" className="mt-2">
                        <Link href="/scholarships">Learn More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Hugs for Ukraine */}
                <Card className="mt-12 bg-blue-50 border-blue-200">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-purple-900 mb-4">Hugs for Ukraine</h3>
                    <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
                      We extend support to Ukrainian families relocated to New York's Capital Region, providing 
                      one-time grants for children affected by the ongoing conflict.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Impact Stats Section */}
          <section className="py-20 bg-white">
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">Our Impact</h2>
                  <p className="text-xl text-gray-700">Making a difference, one smile at a time</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <Card className="text-center border-purple-200">
                    <CardContent className="p-8">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="text-purple-600" size={40} />
                      </div>
                      <p className="text-4xl font-bold text-purple-900 mb-2">[X]</p>
                      <p className="text-gray-600">Families Helped</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center border-pink-200">
                    <CardContent className="p-8">
                      <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="text-pink-600" size={40} />
                      </div>
                      <p className="text-4xl font-bold text-purple-900 mb-2">$[X]</p>
                      <p className="text-gray-600">In Grants Awarded</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center border-purple-200">
                    <CardContent className="p-8">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="text-purple-600" size={40} />
                      </div>
                      <p className="text-4xl font-bold text-purple-900 mb-2">[X]</p>
                      <p className="text-gray-600">Scholarships Awarded</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                  {/* Photo Placeholder: Event photo or grant recipient photo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Heart className="w-24 h-24 text-purple-600 mx-auto mb-4" fill="currentColor" />
                      <p className="text-xl text-purple-900 font-semibold">Photo: Event or Grant Recipients</p>
                      <p className="text-gray-700 mt-2">Community coming together to help families</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold">Join Us in Making a Difference</h2>
                <p className="text-xl opacity-90 leading-relaxed">
                  Whether you need support or want to help others, Kelly's Angels is here. Together, 
                  we can bring smiles to children during their most challenging times.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                    <Link href="/programs">Apply for a Grant</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link href="/volunteer-opportunities">Volunteer</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link href="/donate">Donate Today</Link>
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