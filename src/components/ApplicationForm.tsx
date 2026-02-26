import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { ApplicationFormData } from "@/lib/applicationSchema";
import type { ZodSchema } from "zod";
import type { Database, ApplicationStatus, ApplicationType } from "@/types/database";

interface ApplicationFormProps {
  type: "fun_grant" | "angel_aid" | "angel_hug" | "hugs_for_ukraine";
  schema: ZodSchema;
  title: string;
  description: string;
}

export function ApplicationForm({ type, schema, title, description }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Map the incoming prop type to the database type
  const dbType: ApplicationType = type === "hugs_for_ukraine" ? "hugs_ukraine" : type;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      application_type: dbType,
      state: "NY",
    },
  });

  // Helper to safely access errors for conditional fields
  const safeErrors = errors as any;

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      // Map form data to database schema
      const { application_type, ...rest } = data;
      
      const insertData: Database['public']['Tables']['applications']['Insert'] = {
        type: application_type,
        status: "pending" as ApplicationStatus,
        applicant_name: rest.applicant_name,
        applicant_email: rest.applicant_email,
        applicant_phone: rest.applicant_phone || null,
        school: rest.school || null,
        gpa: rest.gpa ? Number(rest.gpa) : null,
        graduation_year: rest.graduation_year ? Number(rest.graduation_year) : null,
        essay_text: rest.essay_text || null,
        family_situation: rest.family_situation || null,
        transcript_url: rest.transcript_url || null,
        recommendation_letter_url: rest.recommendation_letter_url || null,
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

      setSubmitStatus("success");
      reset();

      // Scroll to success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Application submission error:", error);
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {submitStatus === "success" && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Application submitted successfully!</strong>
            <br />
            Thank you for reaching out to Kelly's Angels. Our team will review your application and contact you within 5-7 business days.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === "error" && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Submission failed.</strong>
            <br />
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Applicant Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Your Information</h3>

              <div>
                <Label htmlFor="applicant_name">Full Name *</Label>
                <Input id="applicant_name" {...register("applicant_name")} />
                {errors.applicant_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.applicant_name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicant_email">Email Address *</Label>
                  <Input id="applicant_email" type="email" {...register("applicant_email")} />
                  {errors.applicant_email && (
                    <p className="text-sm text-red-600 mt-1">{errors.applicant_email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="applicant_phone">Phone Number</Label>
                  <Input id="applicant_phone" type="tel" {...register("applicant_phone")} />
                  {errors.applicant_phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.applicant_phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Address</h3>

              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input id="address" {...register("address")} />
                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" {...register("city")} />
                  {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" {...register("state")} defaultValue="NY" readOnly className="bg-gray-50" />
                </div>

                <div>
                  <Label htmlFor="zip_code">ZIP Code *</Label>
                  <Input id="zip_code" {...register("zip_code")} placeholder="12345" />
                  {errors.zip_code && <p className="text-sm text-red-600 mt-1">{errors.zip_code.message}</p>}
                </div>
              </div>
            </div>

            {/* Child Information (if applicable) */}
            {(type === "fun_grant" || type === "angel_aid" || type === "hugs_for_ukraine") && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Child Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="child_name">Child's Name *</Label>
                    <Input id="child_name" {...register("child_name")} />
                    {safeErrors.child_name && <p className="text-sm text-red-600 mt-1">{safeErrors.child_name.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="child_age">Child's Age *</Label>
                    <Input id="child_age" type="number" min="0" max="18" {...register("child_age")} />
                    {safeErrors.child_age && <p className="text-sm text-red-600 mt-1">{safeErrors.child_age.message}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="relationship">Your Relationship to Child *</Label>
                  <select
                    id="relationship"
                    {...register("relationship")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select relationship...</option>
                    <option value="parent">Parent</option>
                    <option value="guardian">Legal Guardian</option>
                    <option value="family_member">Family Member</option>
                    {type === "hugs_for_ukraine" && <option value="nominee">Nominating on behalf of family</option>}
                  </select>
                  {safeErrors.relationship && <p className="text-sm text-red-600 mt-1">{safeErrors.relationship.message}</p>}
                </div>
              </div>
            )}

            {/* Application Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Application Details</h3>

              {(type === "fun_grant" || type === "angel_aid") && (
                <div>
                  <Label htmlFor="loss_details">Please share details about the loss your family has experienced *</Label>
                  <Textarea
                    id="loss_details"
                    {...register("loss_details")}
                    rows={4}
                    placeholder="Tell us about who you lost, when it happened, and how it has affected your family..."
                  />
                  {safeErrors.loss_details && <p className="text-sm text-red-600 mt-1">{safeErrors.loss_details.message}</p>}
                </div>
              )}

              {type === "angel_hug" && (
                <div>
                  <Label htmlFor="loss_details">Please share your story of loss *</Label>
                  <Textarea
                    id="loss_details"
                    {...register("loss_details")}
                    rows={4}
                    placeholder="Tell us about your loss and how it has affected you..."
                  />
                  {safeErrors.loss_details && <p className="text-sm text-red-600 mt-1">{safeErrors.loss_details.message}</p>}
                </div>
              )}

              <div>
                <Label htmlFor="description">
                  {type === "fun_grant" && "What would bring joy to your child? *"}
                  {type === "angel_aid" && "How would Angel Aid financial assistance help your family? *"}
                  {type === "angel_hug" && "How would you like to use this grant for self-care? *"}
                  {type === "hugs_for_ukraine" && "Please describe the situation and how this grant would help *"}
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={6}
                  placeholder={
                    type === "fun_grant"
                      ? "Describe an experience, event, or activity that would create special memories..."
                      : type === "angel_aid"
                      ? "Explain your financial needs and how this grant would provide relief..."
                      : type === "angel_hug"
                      ? "Share how you'd like to care for yourself during this difficult time..."
                      : "Describe the child's circumstances and how the grant would benefit them..."
                  }
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <Label htmlFor="requested_amount">Estimated Amount Needed (optional)</Label>
                <Input
                  id="requested_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("requested_amount")}
                  placeholder="Enter amount in dollars"
                />
                <p className="text-sm text-gray-600 mt-1">
                  {type === "fun_grant" && "Fun Grants typically range from $100-$5,000"}
                  {type === "angel_aid" && "Angel Aid grants typically range from $500-$10,000"}
                  {type === "angel_hug" && "Angel Hug grants are typically up to $500"}
                  {type === "hugs_for_ukraine" && "Grants typically range from $100-$2,000"}
                </p>
                {errors.requested_amount && (
                  <p className="text-sm text-red-600 mt-1">{errors.requested_amount.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>

              <p className="text-sm text-gray-600 mt-4">
                * Required fields. All information is kept confidential and used only for grant evaluation purposes.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}