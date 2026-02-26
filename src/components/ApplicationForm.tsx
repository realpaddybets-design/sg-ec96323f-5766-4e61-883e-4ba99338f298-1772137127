import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Upload } from "lucide-react";
import { CAPITAL_REGION_SCHOOLS } from "@/types/database";

interface ApplicationFormProps {
  type?: "scholarship" | "fun_grant" | "angel_aid" | "angel_hug" | "hugs_ukraine";
  title?: string;
  description?: string;
  schema?: any;
}

export function ApplicationForm({ type: initialType, title, description }: ApplicationFormProps) {
  const [formType, setFormType] = useState(initialType || "scholarship");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [recommendationFile, setRecommendationFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const handleTypeChange = (value: string) => {
    setFormType(value as any);
    setValue("type", value);
  };

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("applications")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("applications")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("File upload error:", error);
      return null;
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitStatus("submitting");
    setErrorMessage("");

    try {
      let transcriptUrl = null;
      let recommendationUrl = null;

      if (formType === "scholarship") {
        if (transcriptFile) {
          transcriptUrl = await uploadFile(transcriptFile, "transcripts");
        }
        if (recommendationFile) {
          recommendationUrl = await uploadFile(recommendationFile, "recommendations");
        }
      }

      const applicationData: any = {
        type: formType,
        status: "pending",
        applicant_name: data.applicant_name,
        applicant_email: data.applicant_email,
        applicant_phone: data.applicant_phone || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zip: data.zip || null,
        description: data.description || null,
      };

      if (formType === "scholarship") {
        applicationData.school = data.school || null;
        applicationData.gpa = data.gpa ? parseFloat(data.gpa) : null;
        applicationData.graduation_year = data.graduation_year ? parseInt(data.graduation_year) : null;
        applicationData.essay = data.essay || null;
        applicationData.transcript_url = transcriptUrl;
        applicationData.recommendation_letter_url = recommendationUrl;
      } else {
        applicationData.child_name = data.child_name || null;
        applicationData.relationship = data.relationship || null;
        applicationData.requested_amount = data.requested_amount ? parseFloat(data.requested_amount) : null;
      }

      const { error } = await (supabase
        .from("applications") as any)
        .insert([applicationData]);

      if (error) throw error;

      setSubmitStatus("success");
      reset();
      setTranscriptFile(null);
      setRecommendationFile(null);
      
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);

    } catch (error: any) {
      console.error("Submission error:", error);
      setErrorMessage(error.message || "Failed to submit application.");
      setSubmitStatus("error");
    }
  };

  if (submitStatus === "success") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for your application. We&apos;ll review it and get back to you soon.
          </p>
          <Button onClick={() => setSubmitStatus("idle")}>Submit Another Application</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{title || "Application Form"}</CardTitle>
        <CardDescription>{description || "Complete the form below to apply for Kelly's Angels support"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Application Type *</Label>
            <Select value={formType} onValueChange={handleTypeChange}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scholarship">Academic Scholarship</SelectItem>
                <SelectItem value="fun_grant">Fun Grant</SelectItem>
                <SelectItem value="angel_aid">Angel Aid</SelectItem>
                <SelectItem value="angel_hug">Angel Hug</SelectItem>
                <SelectItem value="hugs_ukraine">Hugs from Ukraine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicant_name">Full Name *</Label>
              <Input id="applicant_name" {...register("applicant_name", { required: true })} />
              {errors.applicant_name && <p className="text-sm text-red-600">Name is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicant_email">Email Address *</Label>
              <Input id="applicant_email" type="email" {...register("applicant_email", { required: true })} />
              {errors.applicant_email && <p className="text-sm text-red-600">Email is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicant_phone">Phone Number</Label>
              <Input id="applicant_phone" {...register("applicant_phone")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" {...register("address")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} placeholder="NY" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input id="zip" {...register("zip")} />
            </div>
          </div>

          {formType === "scholarship" && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school">High School *</Label>
                  <Select onValueChange={(value) => setValue("school", value)}>
                    <SelectTrigger id="school">
                      <SelectValue placeholder="Select your school" />
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

                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA *</Label>
                  <Input id="gpa" type="number" step="0.01" {...register("gpa", { required: true })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduation_year">Graduation Year *</Label>
                  <Input id="graduation_year" type="number" {...register("graduation_year", { required: true })} placeholder="2026" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="essay">Personal Essay *</Label>
                <Textarea 
                  id="essay" 
                  {...register("essay", { required: true })} 
                  rows={8}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transcript">Upload Transcript (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="transcript"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setTranscriptFile(e.target.files?.[0] || null)}
                    />
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendation">Recommendation Letter (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="recommendation"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setRecommendationFile(e.target.files?.[0] || null)}
                    />
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </>
          )}

          {formType !== "scholarship" && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="child_name">Child&apos;s Name *</Label>
                  <Input id="child_name" {...register("child_name", { required: true })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">Your Relationship *</Label>
                  <Input id="relationship" {...register("relationship", { required: true })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requested_amount">Amount Requested</Label>
                  <Input id="requested_amount" type="number" step="0.01" {...register("requested_amount")} />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">
              {formType === "scholarship" ? "Additional Information" : "Tell Us Your Story *"}
            </Label>
            <Textarea 
              id="description" 
              {...register("description")} 
              rows={6}
            />
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={submitStatus === "submitting"}
          >
            {submitStatus === "submitting" ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}