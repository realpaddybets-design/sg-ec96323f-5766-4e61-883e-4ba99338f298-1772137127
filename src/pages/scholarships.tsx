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
import { supabase } from "@/lib/supabase";
import { CAPITAL_REGION_SCHOOLS } from "@/types/database";
import { GraduationCap, Upload, CheckCircle2, AlertCircle } from "lucide-react";

export default function ScholarshipsPage() {
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
      // Upload files if provided
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

      // Submit application
      const { error } = await supabase
        .from('applications')
        .insert({
          type: 'scholarship',
          status: 'pending',
          applicant_name: formData.applicant_name,
          applicant_email: formData.applicant_email,
          applicant_phone: formData.applicant_phone,
          school: formData.school,
          gpa: parseFloat(formData.gpa),
          graduation_year: parseInt(formData.graduation_year),
          essay_text: formData.essay_text,
          family_situation: formData.family_situation,
          transcript_url: transcriptUrl,
          recommendation_letter_url: recommendationUrl,
        });

      if (error) throw error;

      setSubmitStatus('success');
      // Reset form
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
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitStatus('error');
      setErrorMessage(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Scholarship Program - Kelly's Angels Inc."
        description="Annual scholarship applications for college-bound seniors at Capital Region high schools who have persevered through adversity and served their communities."
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
        <Navigation />
        
        <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Scholarship Program
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Supporting college-bound seniors from Capital Region high schools who have persevered through adversity, 
              served others (especially children), and demonstrate financial need.
            </p>
          </div>

          {/* Success/Error Messages */}
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

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>Scholarship Application</CardTitle>
              <CardDescription>
                Please fill out all required fields. Applications are reviewed annually by our scholarship committee.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
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

                {/* Academic Information */}
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

                {/* Essay & Background */}
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

                {/* Submit Button */}
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

          {/* Additional Information */}
          <Card className="mt-8 bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900">About Our Scholarships</CardTitle>
            </CardHeader>
            <CardContent className="text-purple-800 space-y-2">
              <p>
                Kelly's Angels Inc. awards annual scholarships to graduating seniors from 14 Capital Region high schools.
              </p>
              <p>
                <strong>Eligibility Criteria:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Must be a graduating senior from one of the 14 participating high schools</li>
                <li>Must have persevered through adversity (personal or family challenges)</li>
                <li>Must demonstrate service to others, especially children</li>
                <li>Must demonstrate financial need</li>
                <li>Must be college-bound</li>
              </ul>
              <p className="pt-2">
                Applications are reviewed by our scholarship committee, and recipients are selected based on the criteria above.
              </p>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
}