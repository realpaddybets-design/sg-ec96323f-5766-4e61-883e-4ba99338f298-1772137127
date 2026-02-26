import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/lib/supabase";
import { CAPITAL_REGION_SCHOOLS } from "@/types/database";
import { GraduationCap, Upload, CheckCircle2, AlertCircle, Calendar, DollarSign, Heart, Award, ArrowLeft } from "lucide-react";
import type { Database } from "@/types/database";

export default function ScholarshipsPage() {
  const [showApplication, setShowApplication] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    school: "",
    gpa: "",
    graduation_year: new Date().getFullYear().toString(),
    essay_text: "",
    family_situation: "",
  });

  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [recommendationFile, setRecommendationFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('applications')
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('applications')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage("");

    try {
      let transcriptUrl = null;
      let recommendationUrl = null;

      if (transcriptFile) {
        transcriptUrl = await uploadFile(transcriptFile, 'transcripts');
        if (!transcriptUrl) {
          throw new Error("Failed to upload transcript");
        }
      }

      if (recommendationFile) {
        recommendationUrl = await uploadFile(recommendationFile, 'recommendations');
        if (!recommendationUrl) {
          throw new Error("Failed to upload recommendation letter");
        }
      }

      const insertData: Database['public']['Tables']['applications']['Insert'] = {
        type: "scholarship",
        status: "pending",
        applicant_name: formData.applicant_name,
        applicant_email: formData.applicant_email,
        applicant_phone: formData.applicant_phone,
        school: formData.school,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        essay: formData.essay_text,
        family_situation: formData.family_situation,
        transcript_url: transcriptUrl,
        recommendation_letter_url: recommendationUrl,
        grant_details: null,
        requested_amount: null,
        supporting_documents: null,
        staff_notes: null,
        recommendation_summary: null,
        recommended_by: null,
        recommended_at: null,
      };

      const { error } = await supabase.from("applications").insert(insertData as any);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        applicant_name: "",
        applicant_email: "",
        applicant_phone: "",
        school: "",
        gpa: "",
        graduation_year: new Date().getFullYear().toString(),
        essay_text: "",
        family_situation: "",
      });
      setTranscriptFile(null);
      setRecommendationFile(null);
      
      // Scroll to top to see success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitStatus('error');
      setErrorMessage(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showApplication) {
    return (
      <>
        <SEO
          title="Scholarship Application - Kelly's Angels Inc."
          description="Apply for Kelly's Angels scholarship program supporting college-bound seniors who have persevered through adversity."
        />
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
          <Navigation />
          
          <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
            <Button
              variant="ghost"
              onClick={() => setShowApplication(false)}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scholarship Information
            </Button>

            {submitStatus === 'success' && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your scholarship application has been submitted successfully! We'll review your application and be in touch soon.
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === 'error' && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Scholarship Application</CardTitle>
                <CardDescription>
                  Please fill out all required fields. Applications are reviewed annually by our scholarship committee.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    
                    <div>
                      <Label htmlFor="applicant_name">Full Name *</Label>
                      <Input
                        id="applicant_name"
                        required
                        value={formData.applicant_name}
                        onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="applicant_email">Email Address *</Label>
                      <Input
                        id="applicant_email"
                        type="email"
                        required
                        value={formData.applicant_email}
                        onChange={(e) => handleInputChange('applicant_email', e.target.value)}
                        placeholder="john.doe@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="applicant_phone">Phone Number</Label>
                      <Input
                        id="applicant_phone"
                        type="tel"
                        value={formData.applicant_phone}
                        onChange={(e) => handleInputChange('applicant_phone', e.target.value)}
                        placeholder="(518) 555-0123"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
                    
                    <div>
                      <Label htmlFor="school">High School *</Label>
                      <Select
                        value={formData.school}
                        onValueChange={(value) => handleInputChange('school', value)}
                        required
                      >
                        <SelectTrigger id="school">
                          <SelectValue placeholder="Select your high school" />
                        </SelectTrigger>
                        <SelectContent>
                          {CAPITAL_REGION_SCHOOLS.map((school) => (
                            <SelectItem key={school} value={school}>
                              {school}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gpa">GPA *</Label>
                        <Input
                          id="gpa"
                          type="number"
                          step="0.01"
                          min="0"
                          max="4.0"
                          required
                          value={formData.gpa}
                          onChange={(e) => handleInputChange('gpa', e.target.value)}
                          placeholder="3.50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="graduation_year">Graduation Year *</Label>
                        <Input
                          id="graduation_year"
                          type="number"
                          required
                          value={formData.graduation_year}
                          onChange={(e) => handleInputChange('graduation_year', e.target.value)}
                          placeholder="2026"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="transcript">Transcript Upload</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Input
                          id="transcript"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setTranscriptFile(e.target.files?.[0] || null)}
                        />
                        {transcriptFile && (
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            {transcriptFile.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Upload your most recent transcript (PDF or Word document)</p>
                    </div>

                    <div>
                      <Label htmlFor="recommendation">Recommendation Letter Upload</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Input
                          id="recommendation"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setRecommendationFile(e.target.files?.[0] || null)}
                        />
                        {recommendationFile && (
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            {recommendationFile.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Upload a letter of recommendation from a teacher or counselor</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Essay & Background</h3>
                    
                    <div>
                      <Label htmlFor="essay_text">Personal Essay *</Label>
                      <Textarea
                        id="essay_text"
                        required
                        rows={8}
                        value={formData.essay_text}
                        onChange={(e) => handleInputChange('essay_text', e.target.value)}
                        placeholder="Tell us about yourself, your goals, how you've persevered through adversity, and how you've served others (especially children) in your community..."
                        className="resize-none"
                      />
                      <p className="text-sm text-gray-500 mt-1">Minimum 250 words recommended</p>
                    </div>

                    <div>
                      <Label htmlFor="family_situation">Family Situation & Financial Need *</Label>
                      <Textarea
                        id="family_situation"
                        required
                        rows={6}
                        value={formData.family_situation}
                        onChange={(e) => handleInputChange('family_situation', e.target.value)}
                        placeholder="Please describe your family situation and any financial challenges that make this scholarship important to you..."
                        className="resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="min-w-[200px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Upload className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </main>

          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Scholarship Program - Kelly's Angels Inc."
        description="Annual scholarship applications for college-bound seniors at Capital Region high schools who have persevered through adversity and served their communities."
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
        <Navigation />
        
        <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Kelly's Angels Scholarship Program
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Supporting college-bound seniors from Capital Region high schools who have demonstrated resilience 
              through adversity, dedication to serving others, and financial need.
            </p>
            <Button
              size="lg"
              onClick={() => setShowApplication(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
            >
              Apply Now
            </Button>
          </div>

          {/* About the Scholarship */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Award className="w-6 h-6 text-purple-600" />
                About Our Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Each year, Kelly's Angels Inc. awards scholarships to graduating seniors from 14 Capital Region high schools. 
                Our scholarships recognize students who embody Kelly's spirit of perseverance, compassion, and service to others.
              </p>
              <p>
                <strong>Kelly's Legacy:</strong> Kelly McLaughlin was known for her infectious smile, boundless energy, and 
                dedication to helping children. Despite facing her own health challenges, she never stopped giving back to her 
                community. Our scholarship program honors her memory by supporting students who share her values.
              </p>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                <p className="font-semibold text-purple-900">
                  "We look for students who have turned their challenges into compassion for others, especially children."
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Requirements */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
                Eligibility Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Academic Standing</p>
                      <p className="text-sm text-gray-600">Graduating senior from one of 14 participating Capital Region high schools</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">College-Bound</p>
                      <p className="text-sm text-gray-600">Planning to attend a 2-year or 4-year college or university</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Perseverance Through Adversity</p>
                      <p className="text-sm text-gray-600">Demonstrated resilience in overcoming personal or family challenges</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Service to Others</p>
                      <p className="text-sm text-gray-600">History of volunteering and serving others, especially children</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Financial Need</p>
                      <p className="text-sm text-gray-600">Demonstrated financial need for college assistance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Good Academic Standing</p>
                      <p className="text-sm text-gray-600">Minimum GPA requirements apply (typically 2.5+)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selection Criteria */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Heart className="w-6 h-6 text-pink-600" />
                What We Look For
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Our scholarship committee reviews each application holistically. We're looking for students whose stories 
                demonstrate Kelly's values:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Resilience</h4>
                  <p className="text-sm text-gray-700">
                    How you've overcome challenges and grown stronger through adversity
                  </p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-pink-900 mb-2">Compassion</h4>
                  <p className="text-sm text-gray-700">
                    Your dedication to helping others, especially children in your community
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Determination</h4>
                  <p className="text-sm text-gray-700">
                    Your commitment to pursuing higher education despite obstacles
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Dates & Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calendar className="w-6 h-6 text-purple-600" />
                Important Dates & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Application Period</p>
                    <p className="text-sm text-gray-600">Applications typically open in February and close in April each year</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 rounded-full p-2">
                    <CheckCircle2 className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Review Process</p>
                    <p className="text-sm text-gray-600">Applications are reviewed by our scholarship committee in April-May</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Winners Announced</p>
                    <p className="text-sm text-gray-600">Recipients are notified in May and recognized at our annual music festival</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 rounded-full p-2">
                    <DollarSign className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Award Distribution</p>
                    <p className="text-sm text-gray-600">Scholarships are sent directly to recipients' colleges in the fall semester</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participating Schools */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Participating High Schools</CardTitle>
              <CardDescription>Students must attend one of these 14 Capital Region schools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {CAPITAL_REGION_SCHOOLS.map((school) => (
                  <div key={school} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{school}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How many scholarships are awarded each year?</AccordionTrigger>
                  <AccordionContent>
                    The number varies based on available funds, but we typically award multiple scholarships ranging from 
                    $500 to $2,500 per recipient. Our goal is to support as many deserving students as possible.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Do I need to have lost a parent to qualify?</AccordionTrigger>
                  <AccordionContent>
                    While many of our recipients have experienced the loss of a parent or sibling, this is not a strict 
                    requirement. We consider any significant adversity you've faced—serious illness, family hardship, 
                    financial challenges, etc. What matters most is how you've persevered and served others despite these challenges.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What does "service to children" mean?</AccordionTrigger>
                  <AccordionContent>
                    This can include babysitting, tutoring, coaching youth sports, volunteering at camps or schools, 
                    mentoring younger students, or any activities where you've positively impacted children's lives. 
                    We're looking for students who prioritize helping the next generation, just as Kelly did.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>What should I include in my essay?</AccordionTrigger>
                  <AccordionContent>
                    Share your authentic story. Tell us about the challenges you've faced, how you've worked through them, 
                    and how these experiences shaped who you are today. Highlight your service to others, especially children. 
                    Explain your college goals and how this scholarship will help. Be honest and let your personality shine through.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Is my application information kept confidential?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Your application is reviewed only by our scholarship committee and relevant board members. 
                    We understand that many applicants share sensitive personal information, and we treat all submissions 
                    with the utmost confidentiality and respect.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>Can I apply if I'm attending a community college?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely! We support students attending 2-year community colleges as well as 4-year universities. 
                    What matters is your commitment to furthering your education and pursuing your goals.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Your story matters. Your perseverance inspires us. Your service makes a difference. 
                Let us help you achieve your college dreams.
              </p>
              <Button
                size="lg"
                onClick={() => setShowApplication(true)}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Start Your Application
              </Button>
              <p className="text-purple-100 text-sm mt-4">
                Questions? <Link href="/contact" className="underline hover:text-white">Contact us</Link>
              </p>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
}