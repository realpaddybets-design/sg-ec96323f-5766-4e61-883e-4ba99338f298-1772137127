import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogOut, Eye, ThumbsUp, ThumbsDown, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import type { Application, Vote } from "@/types/database";
import type { User } from "@supabase/supabase-js";

type Note = {
  id: string;
  created_at: string;
  application_id: string;
  user_id: string;
  note: string;
  is_internal: boolean;
};

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [appVotes, setAppVotes] = useState<Vote[]>([]);
  const [appNotes, setAppNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [newNote, setNewNote] = useState("");
  const [recommendationSummary, setRecommendationSummary] = useState("");
  const [voteLoading, setVoteLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecommendDialogOpen, setIsRecommendDialogOpen] = useState(false);

  useEffect(() => {
    console.log("=== DASHBOARD MOUNT ===");
    
    async function checkAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log("Session check:", session ? "Found" : "Not found");
        console.log("Session error:", error);
        
        if (error) {
          console.error("Session error:", error);
          setAuthLoading(false);
          router.push("/staff/login");
          return;
        }

        if (!session) {
          console.log("No session - redirecting to login");
          setAuthLoading(false);
          router.push("/staff/login");
          return;
        }

        console.log("✅ Session valid, user:", session.user.email);
        setUser(session.user);
        setAuthLoading(false);
        
        // Now fetch applications
        fetchApplications();

      } catch (err) {
        console.error("Auth check error:", err);
        setAuthLoading(false);
        router.push("/staff/login");
      }
    }

    checkAuth();

    // Listen for realtime changes
    const channel = supabase
      .channel("applications_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        () => {
          console.log("Applications updated - refetching");
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  async function fetchApplications() {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      console.log(`Fetched ${data.length} applications`);
      setApplications(data);
    } else {
      console.error("Error fetching applications:", error);
    }
    setLoading(false);
  }

  async function fetchApplicationDetails(appId: string) {
    const [votesRes, notesRes] = await Promise.all([
      supabase.from("votes").select("*").eq("application_id", appId),
      supabase.from("application_notes").select("*").eq("application_id", appId).order("created_at", { ascending: false }),
    ]);

    if (votesRes.data) setAppVotes(votesRes.data);
    if (notesRes.data) setAppNotes(notesRes.data as Note[]);
  }

  async function handleVote(appId: string, vote: "approve" | "deny" | "discuss") {
    if (!user) return;

    setVoteLoading(true);
    setMessage("");

    const { error } = await (supabase.from("votes") as any).upsert({
      application_id: appId,
      voter_id: user.id,
      vote,
    });

    if (error) {
      setMessage("Error submitting vote: " + error.message);
    } else {
      setMessage("Vote submitted successfully!");
      fetchApplicationDetails(appId);
      fetchApplications();
    }

    setVoteLoading(false);
  }

  async function handleRecommend(appId: string) {
    if (!user || !recommendationSummary.trim()) {
      setMessage("Please provide a recommendation summary");
      return;
    }

    setVoteLoading(true);
    setMessage("");

    const { error } = await (supabase
      .from("applications") as any)
      .update({
        status: "recommended",
        recommendation_summary: recommendationSummary,
        recommended_by: user.id,
        recommended_at: new Date().toISOString(),
      })
      .eq("id", appId);

    if (error) {
      setMessage("Error recommending application: " + error.message);
    } else {
      setMessage("Application recommended to board successfully!");
      setIsRecommendDialogOpen(false);
      setRecommendationSummary("");
      fetchApplications();
      if (selectedApp) {
        const updated = applications.find(a => a.id === appId);
        if (updated) setSelectedApp(updated);
      }
    }

    setVoteLoading(false);
  }

  async function handleAddNote() {
    if (!user || !selectedApp || !newNote.trim()) return;

    const { error } = await (supabase.from("application_notes") as any).insert({
      application_id: selectedApp.id,
      user_id: user.id,
      note: newNote,
      is_internal: true,
    });

    if (!error) {
      setNewNote("");
      fetchApplicationDetails(selectedApp.id);
      setMessage("Note added successfully!");
    } else {
      setMessage("Error adding note: " + error.message);
    }
  }

  async function handleSignOut() {
    console.log("Signing out...");
    await supabase.auth.signOut();
    router.push("/staff/login");
  }

  function openApplicationDialog(app: Application) {
    setSelectedApp(app);
    fetchApplicationDetails(app.id);
    setMessage("");
  }

  const filteredApplications = applications.filter((app) => {
    if (filterStatus !== "all" && app.status !== filterStatus) return false;
    if (filterType !== "all" && app.type !== filterType) return false;
    return true;
  });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    under_review: "bg-blue-100 text-blue-800",
    recommended: "bg-purple-100 text-purple-800",
    approved: "bg-green-100 text-green-800",
    denied: "bg-red-100 text-red-800",
    more_info_needed: "bg-orange-100 text-orange-800",
    board_approved: "bg-green-200 text-green-900",
  };

  const typeLabels: Record<string, string> = {
    fun_grant: "Fun Grant",
    angel_aid: "Angel Aid",
    angel_hug: "Angel Hug",
    scholarship: "Scholarship",
    hugs_ukraine: "Hugs for Ukraine",
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Only show dashboard if user is confirmed
  if (!user) {
    return null;
  }

  return (
    <>
      <SEO
        title="Staff Dashboard - Kelly's Angels Inc."
        description="Staff dashboard for managing grant applications."
      />

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
        <Navigation />

        <main className="flex-1 container mx-auto px-4 py-8 mt-20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user.email}
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{applications.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {applications.filter((a) => a.status === "pending").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Recommended</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  {applications.filter((a) => a.status === "recommended").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {applications.filter((a) => a.status === "approved" || a.status === "board_approved").length}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Review and manage all grant applications</CardDescription>
              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <Label htmlFor="filter-status" className="text-sm">Filter by Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger id="filter-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                      <SelectItem value="more_info_needed">More Info Needed</SelectItem>
                      <SelectItem value="board_approved">Board Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="filter-type" className="text-sm">Filter by Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger id="filter-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="fun_grant">Fun Grant</SelectItem>
                      <SelectItem value="angel_aid">Angel Aid</SelectItem>
                      <SelectItem value="angel_hug">Angel Hug</SelectItem>
                      <SelectItem value="scholarship">Scholarship</SelectItem>
                      <SelectItem value="hugs_ukraine">Hugs for Ukraine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-8 text-gray-600">Loading applications...</p>
              ) : filteredApplications.length === 0 ? (
                <p className="text-center py-8 text-gray-600">No applications found.</p>
              ) : (
                <div className="space-y-3">
                  {filteredApplications.map((app) => (
                    <div
                      key={app.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={statusColors[app.status] || ""}>
                              {app.status.replace("_", " ")}
                            </Badge>
                            <Badge variant="outline">{typeLabels[app.type]}</Badge>
                            {app.type === "scholarship" && app.school && (
                              <Badge variant="secondary">{app.school}</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg">{app.applicant_name}</h3>
                          <p className="text-sm text-gray-600">{app.applicant_email}</p>
                          {app.type === "scholarship" && (
                            <div className="text-sm text-gray-600 mt-1">
                              <p>GPA: {app.gpa} | Graduation: {app.graduation_year}</p>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Submitted: {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openApplicationDialog(app)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Application Details</DialogTitle>
                              <DialogDescription>
                                {typeLabels[app.type]} - {app.applicant_name}
                              </DialogDescription>
                            </DialogHeader>

                            {message && (
                              <Alert>
                                <AlertDescription>{message}</AlertDescription>
                              </Alert>
                            )}

                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="review">Review</TabsTrigger>
                                <TabsTrigger value="voting">Voting</TabsTrigger>
                                <TabsTrigger value="notes">Notes</TabsTrigger>
                              </TabsList>

                              <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-semibold">Applicant Name</Label>
                                    <p>{app.applicant_name}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-semibold">Email</Label>
                                    <p>{app.applicant_email}</p>
                                  </div>
                                  {app.applicant_phone && (
                                    <div>
                                      <Label className="text-sm font-semibold">Phone</Label>
                                      <p>{app.applicant_phone}</p>
                                    </div>
                                  )}
                                  {app.type === "scholarship" && (
                                    <>
                                      <div>
                                        <Label className="text-sm font-semibold">High School</Label>
                                        <p>{app.school}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-semibold">GPA</Label>
                                        <p>{app.gpa}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-semibold">Graduation Year</Label>
                                        <p>{app.graduation_year}</p>
                                      </div>
                                    </>
                                  )}
                                  {app.requested_amount && (
                                    <div>
                                      <Label className="text-sm font-semibold">Requested Amount</Label>
                                      <p>${app.requested_amount}</p>
                                    </div>
                                  )}
                                </div>

                                {app.type === "scholarship" && (
                                  <>
                                    <div>
                                      <Label className="text-sm font-semibold">Personal Essay</Label>
                                      <p className="mt-1 whitespace-pre-wrap">{app.essay_text}</p>
                                    </div>

                                    <div>
                                      <Label className="text-sm font-semibold">Family Situation & Financial Need</Label>
                                      <p className="mt-1 whitespace-pre-wrap">{app.family_situation}</p>
                                    </div>

                                    {app.transcript_url && (
                                      <div>
                                        <Label className="text-sm font-semibold">Transcript</Label>
                                        <a href={app.transcript_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block mt-1">
                                          View Transcript
                                        </a>
                                      </div>
                                    )}

                                    {app.recommendation_letter_url && (
                                      <div>
                                        <Label className="text-sm font-semibold">Recommendation Letter</Label>
                                        <a href={app.recommendation_letter_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block mt-1">
                                          View Recommendation Letter
                                        </a>
                                      </div>
                                    )}
                                  </>
                                )}
                              </TabsContent>

                              <TabsContent value="review" className="space-y-4">
                                {app.status === "recommended" || app.status === "board_approved" ? (
                                  <Alert className="bg-purple-50 border-purple-200">
                                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                                    <AlertDescription className="text-purple-800">
                                      <strong>This application has been recommended to the board.</strong>
                                      {app.recommendation_summary && (
                                        <p className="mt-2 whitespace-pre-wrap">{app.recommendation_summary}</p>
                                      )}
                                      {app.recommended_at && (
                                        <p className="text-xs mt-2">
                                          Recommended on {new Date(app.recommended_at).toLocaleDateString()}
                                        </p>
                                      )}
                                    </AlertDescription>
                                  </Alert>
                                ) : (
                                  <div className="space-y-4">
                                    <p className="text-sm text-gray-600">
                                      If this applicant is one of your top selections, recommend them to the board for final approval.
                                    </p>
                                    
                                    <div>
                                      <Label htmlFor="recommendation-summary">Recommendation Summary *</Label>
                                      <Textarea
                                        id="recommendation-summary"
                                        value={recommendationSummary}
                                        onChange={(e) => setRecommendationSummary(e.target.value)}
                                        rows={5}
                                        placeholder="Write a brief summary explaining why you recommend this applicant for the scholarship. Include key strengths, unique circumstances, and why they stand out..."
                                        className="mt-2"
                                      />
                                    </div>

                                    <Button
                                      onClick={() => handleRecommend(app.id)}
                                      disabled={voteLoading || !recommendationSummary.trim()}
                                      className="w-full"
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Recommend to Board
                                    </Button>
                                  </div>
                                )}
                              </TabsContent>

                              <TabsContent value="voting" className="space-y-4">
                                <p className="text-sm text-gray-600">
                                  Board members vote on recommended applications for final approval.
                                </p>

                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleVote(app.id, "approve")}
                                    disabled={voteLoading}
                                    className="flex-1"
                                  >
                                    <ThumbsUp className="mr-2 h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => handleVote(app.id, "deny")}
                                    disabled={voteLoading}
                                    variant="destructive"
                                    className="flex-1"
                                  >
                                    <ThumbsDown className="mr-2 h-4 w-4" />
                                    Deny
                                  </Button>
                                  <Button
                                    onClick={() => handleVote(app.id, "discuss")}
                                    disabled={voteLoading}
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Discuss
                                  </Button>
                                </div>

                                <div className="mt-4">
                                  <Label className="text-sm font-semibold mb-2 block">Current Votes</Label>
                                  {appVotes.length === 0 ? (
                                    <p className="text-sm text-gray-600">No votes yet</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {appVotes.map((vote) => (
                                        <div
                                          key={vote.id}
                                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                        >
                                          <span className="text-sm">Board Member</span>
                                          <Badge
                                            variant={
                                              vote.vote === "approve"
                                                ? "default"
                                                : vote.vote === "deny"
                                                ? "destructive"
                                                : "secondary"
                                            }
                                          >
                                            {vote.vote}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </TabsContent>

                              <TabsContent value="notes" className="space-y-4">
                                <div>
                                  <Label htmlFor="new-note">Add Internal Note</Label>
                                  <Textarea
                                    id="new-note"
                                    placeholder="Add a note about this application..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    rows={3}
                                    className="mt-2"
                                  />
                                  <Button onClick={handleAddNote} className="mt-2" size="sm">
                                    Add Note
                                  </Button>
                                </div>

                                <div>
                                  <Label className="text-sm font-semibold mb-2 block">Previous Notes</Label>
                                  {appNotes.length === 0 ? (
                                    <p className="text-sm text-gray-600">No notes yet</p>
                                  ) : (
                                    <div className="space-y-3">
                                      {appNotes.map((note) => (
                                        <div key={note.id} className="p-3 bg-gray-50 rounded">
                                          <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                                          <p className="text-xs text-gray-500 mt-2">
                                            {new Date(note.created_at).toLocaleString()}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
}