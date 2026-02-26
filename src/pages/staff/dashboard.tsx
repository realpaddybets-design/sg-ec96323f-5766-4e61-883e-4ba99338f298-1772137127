import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LogOut, FileText, Users, School, ThumbsUp, ThumbsDown, MessageSquare, Plus, Trash2, Settings, Crown, Shield, TrendingUp, Activity, Calendar } from "lucide-react";
import { MeetingManagement } from "@/components/MeetingManagement";
import { GrantsArchive } from "@/components/GrantsArchive";
import { VolunteerAdmin } from "@/components/VolunteerAdmin";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CAPITAL_REGION_SCHOOLS } from "@/types/database";
import type { 
  Application, 
  UserProfile, 
  StaffActivityLog, 
  StaffAssignment,
  AppSetting,
  Meeting,
  ApplicationStatus,
  Vote,
  ApplicationNote
} from "@/types/database";

const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "applicant_name",
    header: "Applicant",
  },
  {
    accessorKey: "school",
    header: "School",
  },
  {
    accessorKey: "gpa",
    header: "GPA",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={
          status === 'approved' ? 'default' : 
          status === 'denied' ? 'destructive' : 
          status === 'pending' ? 'secondary' : 'outline'
        }>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleDateString();
    },
  },
];

export default function StaffDashboard() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  
  // Data states
  const [applications, setApplications] = useState<Application[]>([]);
  const [nextMeeting, setNextMeeting] = useState<Meeting | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [notes, setNotes] = useState<ApplicationNote[]>([]);
  const [staffLogs, setStaffLogs] = useState<StaffActivityLog[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState("applications");
  
  // Admin/Owner states
  const [staffUsers, setStaffUsers] = useState<UserProfile[]>([]);
  const [staffAssignments, setStaffAssignments] = useState<StaffAssignment[]>([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"staff" | "admin">("staff");
  const [selectedStaffForAssignment, setSelectedStaffForAssignment] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Voting & Activity Tracking
  const [appSettings, setAppSettings] = useState<AppSetting[]>([]);
  const [activityLogs, setActivityLogs] = useState<StaffActivityLog[]>([]);
  const [voteThresholds, setVoteThresholds] = useState({ grant_approval: 3, scholarship_recommend: 3, deny: 2 });
  const [editingThresholds, setEditingThresholds] = useState(false);

  const isOwner = userProfile?.role === "owner";
  const isAdmin = userProfile?.role === "admin" || isOwner;
  const canManageUsers = isOwner;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/staff/login");
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch applications
      const { data: appsData, error: appsError } = await (supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false }) as any);

      if (appsError) throw appsError;
      setApplications(appsData || []);

      // Fetch votes
      const { data: votesData } = await (supabase
        .from("votes")
        .select("*") as any);
      setVotes(votesData || []);

      // Fetch notes
      const { data: notesData } = await (supabase
        .from("application_notes")
        .select("*")
        .order("created_at", { ascending: false }) as any);
      setNotes(notesData || []);

      // If admin or owner, fetch additional data
      if (isAdmin) {
        const { data: usersData } = await (supabase
          .from("user_profiles")
          .select("*")
          .order("created_at", { ascending: false }) as any);
        setStaffUsers(usersData || []);

        const { data: assignmentsData } = await (supabase
          .from("staff_assignments")
          .select("*") as any);
        setStaffAssignments(assignmentsData || []);

        const { data: settingsData } = await (supabase
          .from("app_settings")
          .select("*") as any);
        setAppSettings(settingsData || []);

        // Load vote thresholds from settings
        const thresholdSetting = settingsData?.find((s: AppSetting) => s.key === "voting_thresholds");
        if (thresholdSetting) {
          setVoteThresholds(thresholdSetting.value as any);
        }

        // Fetch staff logs (admin/owner only)
        if (userProfile?.role === 'admin' || userProfile?.role === 'owner') {
          const { data: logsData } = await supabase
            .from('staff_activity_logs')
            .select('*, user:user_id(full_name)')
            .order('created_at', { ascending: false })
            .limit(500);
          
          if (logsData) setStaffLogs(logsData as StaffActivityLog[]);
        }

        // Fetch next meeting
        const { data: meetingData } = await supabase
          .from('meetings')
          .select('*')
          .gte('meeting_date', new Date().toISOString())
          .order('meeting_date', { ascending: true })
          .limit(1)
          .single();
        
        if (meetingData) setNextMeeting(meetingData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (actionType: string, entityType: string, entityId: string, details?: any) => {
    if (!user) return;
    
    try {
      await (supabase.from("staff_activity_logs") as any).insert({
        user_id: user.id,
        action_type: actionType,
        entity_type: entityType,
        entity_id: entityId,
        details: details || null,
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const checkAutoStatusUpdate = async (appId: string) => {
    const appVotes = votes.filter(v => v.application_id === appId);
    const approveCount = appVotes.filter(v => v.decision === "approve").length;
    const denyCount = appVotes.filter(v => v.decision === "deny").length;

    const app = applications.find(a => a.id === appId);
    if (!app) return;

    let newStatus: ApplicationStatus | null = null;

    // Check thresholds
    if (app.type === "scholarship") {
      if (approveCount >= voteThresholds.scholarship_recommend && app.status !== "recommended") {
        newStatus = "recommended";
      }
    } else {
      if (approveCount >= voteThresholds.grant_approval && app.status !== "approved") {
        newStatus = "approved";
      }
    }

    if (denyCount >= voteThresholds.deny && app.status !== "denied") {
      newStatus = "denied";
    }

    // Update status if threshold met
    if (newStatus) {
      const { error } = await (supabase
        .from("applications") as any)
        .update({ status: newStatus })
        .eq("id", appId);

      if (!error) {
        await logActivity("status_change", "application", appId, { 
          old_status: app.status, 
          new_status: newStatus, 
          reason: "automatic_threshold_met" 
        });
        fetchData();
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/staff/login");
  };

  const handleVote = async (appId: string, decision: "approve" | "deny" | "discuss") => {
    if (!user) return;

    setVoteLoading(true);
    setMessage("");

    const { error } = await (supabase.from("votes") as any).insert({
      application_id: appId,
      user_id: user.id,
      decision,
    });

    if (error) {
      setMessage("Error recording vote: " + error.message);
    } else {
      setMessage(`Vote recorded: ${decision}`);
      await logActivity("vote", "application", appId, { decision });
      await fetchData();
      await checkAutoStatusUpdate(appId);
    }

    setVoteLoading(false);
  };

  const handleRecommend = async (appId: string, summary: string) => {
    if (!user || !isAdmin) return;

    setVoteLoading(true);
    setMessage("");

    const { error: statusError } = await (supabase
      .from("applications") as any)
      .update({ status: "recommended" })
      .eq("id", appId);

    if (statusError) {
      setMessage("Error updating status: " + statusError.message);
      setVoteLoading(false);
      return;
    }

    const { error: noteError } = await (supabase.from("application_notes") as any).insert({
      application_id: appId,
      user_id: user.id,
      note: `RECOMMENDATION: ${summary}`,
      is_internal: true,
    });

    if (noteError) {
      setMessage("Error adding recommendation: " + noteError.message);
    } else {
      setMessage("Application recommended to board");
      await logActivity("status_change", "application", appId, { status: "recommended", summary });
      fetchData();
    }

    setVoteLoading(false);
  };

  const handleAddNote = async (appId: string) => {
    if (!user || !newNote.trim()) return;

    const { error } = await (supabase.from("application_notes") as any).insert({
      application_id: appId,
      user_id: user.id,
      note: newNote,
      is_internal: true,
    });

    if (!error) {
      setNewNote("");
      await logActivity("comment", "application", appId, { note: newNote });
      fetchData();
    }
  };

  const handleUpdateThresholds = async () => {
    if (!isAdmin) return;

    setAdminLoading(true);
    setAdminMessage("");

    try {
      const { error } = await (supabase
        .from("app_settings") as any)
        .upsert({
          key: "voting_thresholds",
          value: voteThresholds,
          description: "Number of votes required for automatic actions",
          updated_by: user?.id,
        });

      if (error) throw error;

      setAdminMessage("Vote thresholds updated successfully");
      setEditingThresholds(false);
      fetchData();
    } catch (error: any) {
      setAdminMessage("Error updating thresholds: " + error.message);
    } finally {
      setAdminLoading(false);
    }
  };

  // Owner-Only Functions
  const handleCreateUser = async () => {
    if (!canManageUsers) {
      setAdminMessage("Only the owner can create users");
      return;
    }

    if (!newUserEmail || !newUserPassword || !newUserName) {
      setAdminMessage("Please fill all fields");
      return;
    }

    setAdminLoading(true);
    setAdminMessage("");

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await (supabase
          .from("user_profiles") as any)
          .insert({
            id: authData.user.id,
            email: newUserEmail,
            full_name: newUserName,
            role: newUserRole,
          });

        if (profileError) throw profileError;

        setAdminMessage("User created successfully");
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserName("");
        setNewUserRole("staff");
        await logActivity("create", "user", authData.user.id, { role: newUserRole, name: newUserName });
        fetchData();
      }
    } catch (error: any) {
      setAdminMessage("Error creating user: " + error.message);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!canManageUsers) {
      setAdminMessage("Only the owner can delete users");
      return;
    }

    setAdminLoading(true);
    setAdminMessage("");

    try {
      const { error: profileError } = await (supabase
        .from("user_profiles") as any)
        .delete()
        .eq("id", userId);

      if (profileError) throw profileError;

      await (supabase
        .from("staff_assignments") as any)
        .delete()
        .eq("staff_user_id", userId);

      setAdminMessage("User deleted successfully");
      await logActivity("create", "user", userId, { action: "delete" });
      fetchData();
    } catch (error: any) {
      setAdminMessage("Error deleting user: " + error.message);
    } finally {
      setAdminLoading(false);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const handlePromoteUser = async (userId: string, newRole: "staff" | "admin") => {
    if (!canManageUsers) {
      setAdminMessage("Only the owner can change user roles");
      return;
    }

    setAdminLoading(true);
    setAdminMessage("");

    try {
      const { error } = await (supabase
        .from("user_profiles") as any)
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      setAdminMessage(`User role updated to ${newRole}`);
      await logActivity("status_change", "user", userId, { new_role: newRole });
      fetchData();
    } catch (error: any) {
      setAdminMessage("Error updating role: " + error.message);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAssignSchool = async () => {
    if (!isAdmin) {
      setAdminMessage("Admin access required");
      return;
    }

    if (!selectedStaffForAssignment || !selectedSchool) {
      setAdminMessage("Please select both staff and school");
      return;
    }

    setAdminLoading(true);
    setAdminMessage("");

    try {
      const { error } = await (supabase
        .from("staff_assignments") as any)
        .insert({
          staff_user_id: selectedStaffForAssignment,
          school: selectedSchool,
        });

      if (error) throw error;

      setAdminMessage("School assigned successfully");
      setSelectedStaffForAssignment("");
      setSelectedSchool("");
      fetchData();
    } catch (error: any) {
      setAdminMessage("Error assigning school: " + error.message);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!isAdmin) {
      setAdminMessage("Admin access required");
      return;
    }

    setAdminLoading(true);
    setAdminMessage("");

    try {
      const { error } = await (supabase
        .from("staff_assignments") as any)
        .delete()
        .eq("id", assignmentId);

      if (error) throw error;

      setAdminMessage("Assignment removed");
      fetchData();
    } catch (error: any) {
      setAdminMessage("Error removing assignment: " + error.message);
    } finally {
      setAdminLoading(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const variants: Record<ApplicationStatus, "default" | "secondary" | "outline" | "destructive"> = {
      pending: "secondary",
      under_review: "default",
      recommended: "default",
      board_approved: "default",
      approved: "default",
      denied: "destructive",
      more_info_needed: "outline",
    };
    return <Badge variant={variants[status]}>{status.replace("_", " ")}</Badge>;
  };

  const getRoleBadge = (role: "staff" | "admin" | "owner") => {
    if (role === "owner") return <Badge variant="default" className="bg-purple-600"><Crown className="w-3 h-3 mr-1" />Owner</Badge>;
    if (role === "admin") return <Badge variant="default"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
    return <Badge variant="secondary">Staff</Badge>;
  };

  const getApplicationVotes = (appId: string) => {
    return votes.filter(v => v.application_id === appId);
  };

  const getApplicationNotes = (appId: string) => {
    return notes.filter(n => n.application_id === appId);
  };

  const getStaffName = (userId: string) => {
    const staff = staffUsers.find(u => u.id === userId);
    return staff?.full_name || "Unknown";
  };

  const getAssignedSchools = (userId: string) => {
    return staffAssignments
      .filter(a => a.staff_user_id === userId)
      .map(a => a.school);
  };

  // Staff Activity Analytics
  const getStaffStats = (userId: string) => {
    const userLogs = activityLogs.filter(log => log.user_id === userId);
    const userVotes = votes.filter(v => v.user_id === userId);
    
    return {
      totalVotes: userVotes.length,
      approveVotes: userVotes.filter(v => v.decision === "approve").length,
      denyVotes: userVotes.filter(v => v.decision === "deny").length,
      discussVotes: userVotes.filter(v => v.decision === "discuss").length,
      commentsAdded: userLogs.filter(l => l.action_type === "comment").length,
      statusChanges: userLogs.filter(l => l.action_type === "status_change").length,
      totalActions: userLogs.length,
      lastActive: userLogs[0]?.created_at || "Never",
    };
  };

  const filteredApplications = isAdmin 
    ? applications
    : applications.filter(app => {
        if (app.type !== "scholarship") return true;
        const userAssignments = getAssignedSchools(user?.id || "");
        return userAssignments.includes(app.school || "");
      });

  const scholarshipApps = filteredApplications.filter(a => a.type === "scholarship");
  const grantApps = filteredApplications.filter(a => a.type !== "scholarship");

  if (authLoading || loading) {
    return (
      <>
        <SEO title="Staff Dashboard - Kelly's Angels" />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <Navigation />
          <main className="container mx-auto px-4 py-16">
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-lg">Loading dashboard...</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Staff Dashboard - Kelly's Angels" />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navigation />

        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-purple-900">Staff Dashboard</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600">Welcome, {userProfile?.full_name}</p>
                {getRoleBadge(userProfile?.role || "staff")}
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-900">{filteredApplications.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Scholarships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{scholarshipApps.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Grants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-pink-600">{grantApps.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">
                  {filteredApplications.filter(a => a.status === "pending").length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="applications" className="space-y-4">
            <TabsList className="flex-wrap h-auto gap-2">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
              <TabsTrigger value="archive">Grants Archive</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
              {isAdmin && (
                <>
                  <TabsTrigger value="stats">Staff Stats</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </>
              )}
            </TabsList>

            {/* All Applications Tab */}
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>All Applications</CardTitle>
                  <CardDescription>View and manage all submitted applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredApplications.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No applications found.</p>
                    ) : filteredApplications.map((app) => (
                      <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedApp(app)}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{app.applicant_name}</h3>
                                {getStatusBadge(app.status)}
                                <Badge variant="outline">{app.type.replace("_", " ")}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {app.type === "scholarship" && `${app.school} • GPA: ${app.gpa}`}
                                {app.type !== "scholarship" && app.relationship}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Submitted: {new Date(app.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary">{getApplicationVotes(app.id).length} votes</Badge>
                              <Badge variant="secondary">{getApplicationNotes(app.id).length} notes</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scholarships Tab */}
            <TabsContent value="scholarships" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Scholarship Applications</h2>
              </div>
              <DataTable 
                columns={columns} 
                data={applications.filter(app => app.type === 'scholarship')} 
                searchKey="applicant_name"
              />
            </TabsContent>

            {/* Grants Tab */}
            <TabsContent value="grants">
              <GrantsArchive isAdmin={isAdmin} />
            </TabsContent>

            {/* Volunteers Tab */}
            <TabsContent value="volunteers">
              <VolunteerAdmin userId={user?.id || ""} />
            </TabsContent>

            {/* Meetings Tab */}
            <TabsContent value="meetings" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Meeting Management</h2>
              </div>
              {userProfile && (
                <MeetingManagement userId={userProfile.user_id || userProfile.id} userRole={userProfile.role} />
              )}
            </TabsContent>

            {/* Staff Stats Tab - Admin/Owner Only */}
            {isAdmin && (
              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      Staff Performance & Activity
                    </CardTitle>
                    <CardDescription>Track board member engagement and workload distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {staffUsers.map((staffUser) => {
                        const stats = getStaffStats(staffUser.id);
                        return (
                          <Card key={staffUser.id} className="border-l-4 border-l-purple-500">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">{staffUser.full_name}</h3>
                                    {getRoleBadge(staffUser.role)}
                                  </div>
                                  <p className="text-sm text-gray-600">{staffUser.email}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Last Active: {stats.lastActive !== "Never" ? new Date(stats.lastActive).toLocaleString() : "Never"}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                  <p className="text-2xl font-bold text-blue-600">{stats.totalVotes}</p>
                                  <p className="text-xs text-gray-600">Total Votes</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                  <p className="text-2xl font-bold text-green-600">{stats.approveVotes}</p>
                                  <p className="text-xs text-gray-600">Approvals</p>
                                </div>
                                <div className="text-center p-3 bg-red-50 rounded-lg">
                                  <p className="text-2xl font-bold text-red-600">{stats.denyVotes}</p>
                                  <p className="text-xs text-gray-600">Denials</p>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                  <p className="text-2xl font-bold text-purple-600">{stats.commentsAdded}</p>
                                  <p className="text-xs text-gray-600">Comments</p>
                                </div>
                              </div>

                              <div className="mt-3 flex gap-2 flex-wrap">
                                {getAssignedSchools(staffUser.id).map(school => (
                                  <Badge key={school} variant="outline" className="text-xs">{school}</Badge>
                                ))}
                                {getAssignedSchools(staffUser.id).length === 0 && (
                                  <Badge variant="outline" className="text-xs">No school assignments</Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="font-semibold mb-4">Recent Activity</h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {activityLogs.slice(0, 50).map((log) => (
                          <Card key={log.id} className="p-3">
                            <div className="flex items-start gap-3">
                              <Activity className="w-4 h-4 text-gray-400 mt-1" />
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-semibold">{getStaffName(log.user_id)}</span>
                                  {" "}
                                  {log.action_type === "vote" && "voted on"}
                                  {log.action_type === "comment" && "commented on"}
                                  {log.action_type === "status_change" && "changed status of"}
                                  {log.action_type === "create" && "created"}
                                  {" "}
                                  {log.entity_type}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(log.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Settings Tab - Admin/Owner Only */}
            {isAdmin && (
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      System Settings
                    </CardTitle>
                    <CardDescription>Configure voting thresholds and automation rules</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Card className="border-purple-200 bg-purple-50">
                      <CardHeader>
                        <CardTitle className="text-lg">Voting Thresholds</CardTitle>
                        <CardDescription>Set how many votes are required for automatic status changes</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="grantApproval">Grant Auto-Approval</Label>
                            <Input
                              id="grantApproval"
                              type="number"
                              min="1"
                              value={voteThresholds.grant_approval}
                              onChange={(e) => setVoteThresholds({ ...voteThresholds, grant_approval: parseInt(e.target.value) })}
                              disabled={!editingThresholds}
                            />
                            <p className="text-xs text-gray-600 mt-1">Approve votes needed for non-scholarship grants</p>
                          </div>
                          <div>
                            <Label htmlFor="scholarshipRecommend">Scholarship Recommendation</Label>
                            <Input
                              id="scholarshipRecommend"
                              type="number"
                              min="1"
                              value={voteThresholds.scholarship_recommend}
                              onChange={(e) => setVoteThresholds({ ...voteThresholds, scholarship_recommend: parseInt(e.target.value) })}
                              disabled={!editingThresholds}
                            />
                            <p className="text-xs text-gray-600 mt-1">Approve votes to recommend to board</p>
                          </div>
                          <div>
                            <Label htmlFor="denyThreshold">Auto-Denial</Label>
                            <Input
                              id="denyThreshold"
                              type="number"
                              min="1"
                              value={voteThresholds.deny}
                              onChange={(e) => setVoteThresholds({ ...voteThresholds, deny: parseInt(e.target.value) })}
                              disabled={!editingThresholds}
                            />
                            <p className="text-xs text-gray-600 mt-1">Deny votes needed for auto-denial</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!editingThresholds ? (
                            <Button onClick={() => setEditingThresholds(true)} variant="outline">
                              Edit Thresholds
                            </Button>
                          ) : (
                            <>
                              <Button onClick={handleUpdateThresholds} disabled={adminLoading}>
                                Save Changes
                              </Button>
                              <Button onClick={() => setEditingThresholds(false)} variant="outline">
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Automation Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium">Automatic Status Updates</span>
                            </div>
                            <Badge variant="default" className="bg-green-600">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium">Activity Logging</span>
                            </div>
                            <Badge variant="default" className="bg-green-600">Active</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Admin/Owner Panel Tab */}
            {isAdmin && (
              <TabsContent value="admin">
                <div className="space-y-6">
                  {canManageUsers && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Crown className="w-5 h-5 text-purple-600" />
                          User Management (Owner Only)
                        </CardTitle>
                        <CardDescription>Create and manage staff and admin accounts</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="border rounded-lg p-4 bg-purple-50">
                          <h3 className="font-semibold mb-4">Create New User</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="newUserName">Full Name</Label>
                              <Input
                                id="newUserName"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                placeholder="John Doe"
                              />
                            </div>
                            <div>
                              <Label htmlFor="newUserEmail">Email</Label>
                              <Input
                                id="newUserEmail"
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                placeholder="staff@kellysangelsinc.org"
                              />
                            </div>
                            <div>
                              <Label htmlFor="newUserPassword">Password</Label>
                              <Input
                                id="newUserPassword"
                                type="password"
                                value={newUserPassword}
                                onChange={(e) => setNewUserPassword(e.target.value)}
                                placeholder="Minimum 6 characters"
                              />
                            </div>
                            <div>
                              <Label htmlFor="newUserRole">Role</Label>
                              <Select value={newUserRole} onValueChange={(val: "staff" | "admin") => setNewUserRole(val)}>
                                <SelectTrigger id="newUserRole">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="staff">Staff</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button 
                            onClick={handleCreateUser} 
                            disabled={adminLoading}
                            className="mt-4 w-full md:w-auto bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create User
                          </Button>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-4">All Users</h3>
                          <div className="space-y-2">
                            {staffUsers.map((staffUser) => (
                              <Card key={staffUser.id}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-semibold">{staffUser.full_name}</p>
                                        {getRoleBadge(staffUser.role)}
                                      </div>
                                      <p className="text-sm text-gray-600">{staffUser.email}</p>
                                      <div className="flex gap-2 mt-2 flex-wrap">
                                        {getAssignedSchools(staffUser.id).map(school => (
                                          <Badge key={school} variant="outline" className="text-xs">{school}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      {staffUser.role === "staff" && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handlePromoteUser(staffUser.id, "admin")}
                                          disabled={adminLoading}
                                        >
                                          <Shield className="w-4 h-4 mr-1" />
                                          Promote to Admin
                                        </Button>
                                      )}
                                      {staffUser.role === "admin" && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handlePromoteUser(staffUser.id, "staff")}
                                          disabled={adminLoading}
                                        >
                                          Demote to Staff
                                        </Button>
                                      )}
                                      {staffUser.role !== "owner" && (
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => {
                                            setUserToDelete(staffUser.id);
                                            setDeleteConfirmOpen(true);
                                          }}
                                          disabled={staffUser.id === userProfile?.id || adminLoading}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <School className="w-5 h-5" />
                        School Assignments
                      </CardTitle>
                      <CardDescription>Assign staff to review specific high schools for scholarship applications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="font-semibold mb-4">Assign School to Staff</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="staffSelect">Staff Member</Label>
                            <Select value={selectedStaffForAssignment} onValueChange={setSelectedStaffForAssignment}>
                              <SelectTrigger id="staffSelect">
                                <SelectValue placeholder="Select staff member" />
                              </SelectTrigger>
                              <SelectContent>
                                {staffUsers.filter(u => u.role === "staff").map(staffUser => (
                                  <SelectItem key={staffUser.id} value={staffUser.id}>
                                    {staffUser.full_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="schoolSelect">High School</Label>
                            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                              <SelectTrigger id="schoolSelect">
                                <SelectValue placeholder="Select school" />
                              </SelectTrigger>
                              <SelectContent>
                                {CAPITAL_REGION_SCHOOLS.map(school => (
                                  <SelectItem key={school} value={school}>
                                    {school}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button 
                          onClick={handleAssignSchool} 
                          disabled={adminLoading}
                          className="mt-4 w-full md:w-auto"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Assign School
                        </Button>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Current Assignments</h3>
                        <div className="space-y-2">
                          {staffAssignments.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">No school assignments yet.</p>
                          ) : staffAssignments.map((assignment) => (
                            <Card key={assignment.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold">{getStaffName(assignment.staff_user_id)}</p>
                                    <p className="text-sm text-gray-600">{assignment.school}</p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveAssignment(assignment.id)}
                                    disabled={adminLoading}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {adminMessage && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-blue-900">{adminMessage}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>

          {/* Application Detail Modal */}
          {selectedApp && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedApp(null)}>
              <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{selectedApp.applicant_name}</CardTitle>
                      <CardDescription>{selectedApp.applicant_email}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(selectedApp.status)}
                      <Badge variant="outline">{selectedApp.type.replace("_", " ")}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Application Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-medium">{selectedApp.applicant_phone || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Submitted:</span>
                        <p className="font-medium">{new Date(selectedApp.created_at).toLocaleString()}</p>
                      </div>
                      {selectedApp.type === "scholarship" && (
                        <>
                          <div>
                            <span className="text-gray-600">School:</span>
                            <p className="font-medium">{selectedApp.school}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">GPA:</span>
                            <p className="font-medium">{selectedApp.gpa}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Graduation Year:</span>
                            <p className="font-medium">{selectedApp.graduation_year}</p>
                          </div>
                        </>
                      )}
                      {selectedApp.type !== "scholarship" && (
                        <>
                          <div>
                            <span className="text-gray-600">Child Name:</span>
                            <p className="font-medium">{selectedApp.child_name || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Relationship:</span>
                            <p className="font-medium">{selectedApp.relationship || "N/A"}</p>
                          </div>
                        </>
                      )}
                      <div className="md:col-span-2">
                        <span className="text-gray-600">Address:</span>
                        <p className="font-medium">
                          {selectedApp.address}, {selectedApp.city}, {selectedApp.state} {selectedApp.zip}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-600">Description:</span>
                        <p className="font-medium mt-1 whitespace-pre-wrap">{selectedApp.description}</p>
                      </div>
                      {selectedApp.type === "scholarship" && selectedApp.essay && (
                        <div className="md:col-span-2">
                          <span className="text-gray-600">Essay:</span>
                          <p className="font-medium mt-1 whitespace-pre-wrap">{selectedApp.essay}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {(selectedApp.transcript_url || selectedApp.recommendation_letter_url) && (
                    <>
                      <div>
                        <h3 className="font-semibold mb-3">Uploaded Files</h3>
                        <div className="space-y-2">
                          {selectedApp.transcript_url && (
                            <Button variant="outline" asChild className="w-full">
                              <a href={selectedApp.transcript_url} target="_blank" rel="noopener noreferrer">
                                View Transcript
                              </a>
                            </Button>
                          )}
                          {selectedApp.recommendation_letter_url && (
                            <Button variant="outline" asChild className="w-full">
                              <a href={selectedApp.recommendation_letter_url} target="_blank" rel="noopener noreferrer">
                                View Recommendation Letter
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  <div>
                    <h3 className="font-semibold mb-3">
                      {selectedApp.type === "scholarship" && selectedApp.status !== "recommended" 
                        ? "Staff Recommendation" 
                        : "Voting"}
                    </h3>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Current Votes:</p>
                      <div className="flex gap-2">
                        {getApplicationVotes(selectedApp.id).length === 0 ? (
                          <Badge variant="outline">No votes yet</Badge>
                        ) : (
                          <>
                            <Badge variant="default">
                              Approve: {getApplicationVotes(selectedApp.id).filter(v => v.decision === "approve").length}
                            </Badge>
                            <Badge variant="destructive">
                              Deny: {getApplicationVotes(selectedApp.id).filter(v => v.decision === "deny").length}
                            </Badge>
                            <Badge variant="secondary">
                              Discuss: {getApplicationVotes(selectedApp.id).filter(v => v.decision === "discuss").length}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>

                    {selectedApp.type === "scholarship" && isAdmin && selectedApp.status !== "recommended" && (
                      <div className="space-y-3">
                        <Label>Recommend to Board (Admin/Owner Only)</Label>
                        <Textarea
                          placeholder="Write a summary/recommendation for the board..."
                          rows={4}
                          id="recommendation-summary"
                        />
                        <Button
                          onClick={() => {
                            const summary = (document.getElementById("recommendation-summary") as HTMLTextAreaElement)?.value;
                            if (summary) handleRecommend(selectedApp.id, summary);
                          }}
                          disabled={voteLoading}
                          className="w-full"
                        >
                          Recommend to Board
                        </Button>
                      </div>
                    )}

                    {(selectedApp.type !== "scholarship" || selectedApp.status === "recommended") && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleVote(selectedApp.id, "approve")}
                          disabled={voteLoading}
                          variant="default"
                          className="flex-1"
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleVote(selectedApp.id, "deny")}
                          disabled={voteLoading}
                          variant="destructive"
                          className="flex-1"
                        >
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Deny
                        </Button>
                        <Button
                          onClick={() => handleVote(selectedApp.id, "discuss")}
                          disabled={voteLoading}
                          variant="outline"
                          className="flex-1"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Discuss
                        </Button>
                      </div>
                    )}

                    {message && (
                      <p className="text-sm mt-2 text-blue-600">{message}</p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Internal Notes</h3>
                    <div className="space-y-3 mb-4">
                      {getApplicationNotes(selectedApp.id).map((note) => (
                        <Card key={note.id} className={note.note.startsWith("RECOMMENDATION:") ? "border-purple-200 bg-purple-50" : ""}>
                          <CardContent className="p-3">
                            <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {getStaffName(note.user_id)} • {new Date(note.created_at).toLocaleString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Add internal note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        onClick={() => handleAddNote(selectedApp.id)} 
                        disabled={!newNote.trim()}
                        className="w-full"
                      >
                        Add Note
                      </Button>
                    </div>
                  </div>

                  <Button variant="outline" onClick={() => setSelectedApp(null)} className="w-full">
                    Close
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user? This will remove their account, all school assignments, and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => userToDelete && handleDeleteUser(userToDelete)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>

        <Footer />
      </div>
    </>
  );
}