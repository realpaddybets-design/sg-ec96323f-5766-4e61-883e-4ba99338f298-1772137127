import { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationForm } from "@/components/ApplicationForm";
import { GraduationCap, CheckCircle2, Calendar, FileText, Award, Users } from "lucide-react";

export default function ScholarshipsPage() {
  const [showApplication, setShowApplication] = useState(false);

  return (
    <>
      <SEO
        title="Academic Scholarships | Kelly's Angels"
        description="Apply for renewable academic scholarships up to $2,500 for students who have experienced the loss of a parent or sibling."
        image="/og-image.png"
      />
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Navigation />
        
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-700 dark:text-pink-300 text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              Renewable Academic Scholarships
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              Kelly's Angels Scholarships
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Supporting students in New York's Capital Region who have experienced the loss of a parent or sibling.
            </p>
          </div>

          {/* Key Info Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="w-10 h-10 text-pink-600 dark:text-pink-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Award Amount</h3>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">$1,000 - $2,500</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Renewable annually</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="w-10 h-10 text-pink-600 dark:text-pink-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Application Period</h3>
                <p className="text-gray-900 dark:text-gray-100 font-medium">February 1 - March 31</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Annual deadline</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="w-10 h-10 text-pink-600 dark:text-pink-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Who Can Apply</h3>
                <p className="text-gray-900 dark:text-gray-100 font-medium">High School Seniors</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Capital Region schools</p>
              </CardContent>
            </Card>
          </div>

          {/* Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                Eligibility Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">High school senior attending school in New York's Capital Region (Albany, Schenectady, Rensselaer, Saratoga counties)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">Minimum 3.0 GPA or demonstrated academic effort despite challenging circumstances</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">Experienced the loss of a parent or sibling, or lost a parent/sibling to substance abuse or incarceration</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">Planning to attend an accredited 2-year or 4-year college or vocational program</p>
              </div>
            </CardContent>
          </Card>

          {/* Selection & Timeline */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  Selection Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Academic achievement and effort</li>
                  <li>• Personal essay quality</li>
                  <li>• Community involvement</li>
                  <li>• Financial need</li>
                  <li>• Letters of recommendation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <span className="font-medium">Feb 1:</span> Applications open</li>
                  <li>• <span className="font-medium">Mar 31:</span> Application deadline</li>
                  <li>• <span className="font-medium">Apr 15:</span> Finalists notified</li>
                  <li>• <span className="font-medium">May 1:</span> Recipients announced</li>
                  <li>• <span className="font-medium">May 31:</span> Awards distributed</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Application Section */}
          {!showApplication ? (
            <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-800">
              <CardContent className="text-center py-12">
                <GraduationCap className="w-16 h-16 text-pink-600 dark:text-pink-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Ready to Apply?</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  Complete the application below. You'll need your transcript, two letters of recommendation, and a personal essay.
                </p>
                <Button 
                  onClick={() => setShowApplication(true)}
                  size="lg"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-8"
                >
                  Start Application
                </Button>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Questions? <Link href="/contact" className="text-pink-600 hover:underline">Contact us</Link>
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scholarship Application</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowApplication(false)}
                >
                  ← Back to Info
                </Button>
              </div>
              <ApplicationForm type="scholarship" />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}