import { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ApplicationForm } from "@/components/ApplicationForm";
import { scholarshipSchema } from "@/lib/applicationSchema";
import { CheckCircle2, Calendar, Award } from "lucide-react";

export default function ScholarshipsPage() {
  const [showApplication, setShowApplication] = useState(false);

  return (
    <>
      <SEO
        title="Academic Scholarships | Kelly's Angels"
        description="Renewable academic scholarships for students in New York's Capital Region who have persevered through loss."
        image="/og-image.png"
      />
      <div className="min-h-screen bg-white text-gray-900">
        <Navigation />
        
        <main className="max-w-4xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-brand-primary">
              Academic Scholarships
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
              We provide renewable financial support to high school seniors in the Capital Region who have demonstrated resilience and academic effort despite the loss of a parent or sibling.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Main Content Column */}
            <div className="md:col-span-2 space-y-10">
              
              <section>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-brand-primary" /> 
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
                <h3 className="text-xl font-semibold mb-4">Eligibility</h3>
                <ul className="space-y-3">
                  {[
                    "High school senior in NY Capital Region (Albany, Schenectady, Rensselaer, Saratoga)",
                    "Experienced the loss of a parent or sibling (including loss to substance abuse/incarceration)",
                    "Minimum 3.0 GPA or demonstrated academic effort",
                    "Planning to attend accredited higher education"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
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

            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
              <div className="bg-white md:bg-gray-50 rounded-xl md:p-6 border-0 md:border md:border-gray-100 sticky top-24">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-brand-primary" />
                  Timeline
                </h3>
                <ol className="relative border-l border-gray-200 ml-2 space-y-6">
                  <li className="ml-6">
                    <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-green-500"></span>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400">Feb 1</time>
                    <h3 className="text-sm font-semibold text-gray-900">Applications Open</h3>
                  </li>
                  <li className="ml-6">
                    <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-brand-primary"></span>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400">Mar 31</time>
                    <h3 className="text-sm font-semibold text-gray-900">Deadline</h3>
                  </li>
                  <li className="ml-6">
                    <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-300"></span>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400">May 1</time>
                    <h3 className="text-sm font-semibold text-gray-900">Awards Announced</h3>
                  </li>
                </ol>

                <div className="mt-8 pt-6 border-t border-gray-200">
                   {!showApplication ? (
                    <Button 
                      onClick={() => setShowApplication(true)}
                      className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-medium"
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
                 <h2 className="text-2xl font-bold">Scholarship Application</h2>
              </div>
              <ApplicationForm 
                type="scholarship" 
                schema={scholarshipSchema}
                title="2025 Academic Scholarship"
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