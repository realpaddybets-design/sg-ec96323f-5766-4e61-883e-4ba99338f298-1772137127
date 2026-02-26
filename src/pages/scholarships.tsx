import { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ApplicationForm } from "@/components/ApplicationForm";
import { scholarshipSchema } from "@/lib/applicationSchema";
import { CheckCircle2, Calendar, Award, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScholarshipsPage() {
  const [showApplication, setShowApplication] = useState(false);

  return (
    <>
      <SEO
        title="Academic Scholarships | Kelly's Angels"
        description="Renewable academic scholarships for students in New York's Capital Region who have persevered through adversity and demonstrated commitment to serving others."
        image="/og-image.png"
      />
      <div className="min-h-screen bg-white text-gray-900">
        <Navigation />
        
        <main className="max-w-5xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-primary">
              Kelly's Angels Academic Scholarships
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Each spring, Kelly's Angels accepts scholarship applications for college-bound seniors at 14 high schools in New York's Capital Region who have persevered through adversity, demonstrated a commitment to serving others, especially other children, and have a need for financial assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Main Content Column */}
            <div className="md:col-span-2 space-y-10">
              
              {/* Eligibility Section */}
              <section>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b-4 border-primary pb-2 inline-block">
                  Eligibility
                </h3>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">High School Senior;</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Has shown a commitment to serving others, especially other children; and</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Attending an institution of higher learning;</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Is a hardworking student, but not necessarily the highest achieving.</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Has a need for financial assistance;</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Has persevered in the face of adversity;</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    Currently accepting applications from seniors who will be graduating from <strong>Fort Edward, Glens Falls, Hoosic Valley, Hudson Falls, Lake George, Mechanicville, Queensbury, Ravena-Coeymans-Selkirk High School, Saratoga Central Catholic, Saratoga Springs, Shenendehowa, South Glens Falls, Stillwater, and Whitehall</strong>.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" /> 
                  The Award
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <p className="font-medium text-2xl mb-1">$1,000 - $2,500</p>
                  <p className="text-gray-600 mb-4">Renewable annually for up to 4 years</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Funds are paid directly to the student to offset the cost of tuition, books, and living expenses at any accredited 2-year or 4-year college or vocational program.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">Selection Criteria</h3>
                <p className="text-gray-600 mb-4">The Kelly's Angels Board of Directors reviews applications holistically, considering:</p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="bg-white border p-3 rounded">✨ Personal essay</div>
                  <div className="bg-white border p-3 rounded">📚 Academic perseverance</div>
                  <div className="bg-white border p-3 rounded">🤝 Community involvement</div>
                  <div className="bg-white border p-3 rounded">💰 Financial need</div>
                </div>
              </section>

              {/* Live Like Liv Section - Moved to bottom */}
              <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2 text-pink-700">
                    <Heart className="h-6 w-6" />
                    Introducing the "Kelly's Angels Live Like Liv Scholarship"
                  </CardTitle>
                  <p className="text-sm text-gray-600 font-medium mt-1">In memory of Olivia Allen</p>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Kelly's Angels is proud to honor the memory of Olivia Grace Allen by naming our Saratoga Springs scholarship program the <strong>Kelly's Angels Live Like Liv Scholarships</strong>. Olivia was a beloved daughter, sister, friend, and student-athlete from Saratoga Springs who lost her battle with leukemia in March 2024, but not before turning her hardship into an awe-inspiring rallying cry to <strong className="text-pink-700">#LiveLikeLiv</strong>.
                  </p>
                  <p>
                    Liv embodied every character trait these scholarships aim to reward, including perseverance, positivity, kindness, and a commitment to helping others. We encourage students who <strong className="text-pink-700">#LiveLikeLiv</strong> to apply and ensure her beautiful legacy endures.
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
              <div className="bg-white md:bg-gray-50 rounded-xl md:p-6 border-0 md:border md:border-gray-100 sticky top-24">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Timeline
                </h3>
                <ol className="relative border-l border-gray-200 ml-2 space-y-6">
                  <li className="ml-6">
                    <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-green-500"></span>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400">Nov 3, 2025</time>
                    <h3 className="text-sm font-semibold text-gray-900">Applications Open</h3>
                  </li>
                  <li className="ml-6">
                    <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-primary"></span>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400">Mar 2, 2026</time>
                    <h3 className="text-sm font-semibold text-gray-900">Deadline</h3>
                  </li>
                  <li className="ml-6">
                    <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-300"></span>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400">May 2026</time>
                    <h3 className="text-sm font-semibold text-gray-900">Awards Announced</h3>
                  </li>
                </ol>

                <div className="mt-8 pt-6 border-t border-gray-200">
                   {!showApplication ? (
                    <Button 
                      onClick={() => setShowApplication(true)}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                      size="lg"
                    >
                      Apply Now
                    </Button>
                   ) : (
                    <Button 
                      variant="outline"
                      onClick={() => setShowApplication(false)}
                      className="w-full"
                    >
                      Close Application
                    </Button>
                   )}
                   <p className="text-xs text-center text-gray-500 mt-3">
                     Questions? <Link href="/contact" className="underline">Contact us</Link>
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form Area */}
          {showApplication && (
            <div className="mt-16 pt-16 border-t animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-bold text-primary">Scholarship Application</h2>
              </div>
              <ApplicationForm 
                type="scholarship" 
                schema={scholarshipSchema}
                title="Kelly's Angels Academic Scholarship"
                description="Please complete all sections. You will need your transcript and recommendation letters ready."
              />
            </div>
          )}

        </main>
        <Footer />
      </div>
    </>
  );
}