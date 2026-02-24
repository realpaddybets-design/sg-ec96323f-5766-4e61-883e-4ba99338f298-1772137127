export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "staff" | "admin";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "staff" | "admin";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "staff" | "admin";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      applications: {
        Row: {
          id: string;
          application_type: "fun_grant" | "angel_aid" | "angel_hug" | "scholarship" | "hugs_for_ukraine";
          applicant_name: string;
          applicant_email: string;
          applicant_phone: string | null;
          child_name: string | null;
          child_age: number | null;
          relationship: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          description: string;
          loss_details: string | null;
          requested_amount: number | null;
          status: "pending" | "under_review" | "approved" | "denied" | "more_info_needed";
          priority: "low" | "normal" | "high" | "urgent";
          attachment_urls: string[] | null;
          submitted_at: string;
          reviewed_at: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_type: "fun_grant" | "angel_aid" | "angel_hug" | "scholarship" | "hugs_for_ukraine";
          applicant_name: string;
          applicant_email: string;
          applicant_phone?: string | null;
          child_name?: string | null;
          child_age?: number | null;
          relationship?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          description: string;
          loss_details?: string | null;
          requested_amount?: number | null;
          status?: "pending" | "under_review" | "approved" | "denied" | "more_info_needed";
          priority?: "low" | "normal" | "high" | "urgent";
          attachment_urls?: string[] | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_type?: "fun_grant" | "angel_aid" | "angel_hug" | "scholarship" | "hugs_for_ukraine";
          applicant_name?: string;
          applicant_email?: string;
          applicant_phone?: string | null;
          child_name?: string | null;
          child_age?: number | null;
          relationship?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          description?: string;
          loss_details?: string | null;
          requested_amount?: number | null;
          status?: "pending" | "under_review" | "approved" | "denied" | "more_info_needed";
          priority?: "low" | "normal" | "high" | "urgent";
          attachment_urls?: string[] | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      application_votes: {
        Row: {
          id: string;
          application_id: string;
          user_id: string;
          vote: "approve" | "deny" | "more_info";
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          user_id: string;
          vote: "approve" | "deny" | "more_info";
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          user_id?: string;
          vote?: "approve" | "deny" | "more_info";
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "application_votes_application_id_fkey";
            columns: ["application_id"];
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "application_votes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      application_notes: {
        Row: {
          id: string;
          application_id: string;
          user_id: string;
          note: string;
          is_internal: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          user_id: string;
          note: string;
          is_internal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          user_id?: string;
          note?: string;
          is_internal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "application_notes_application_id_fkey";
            columns: ["application_id"];
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "application_notes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}