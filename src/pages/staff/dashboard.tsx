import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
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
import { LogOut, Eye, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import type { Database } from "@/types/database";

type Application = Database["public"]["Tables"]["applications"]["Row"];
type Vote = Database["public"]["Tables"]["application_votes"]["Row"];
type Note = Database["public"]["Tables"]["application_notes"]["Row"];

export default function StaffDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [appVotes, setAppVotes] = useState<Vote[]>([]);
  const [appNotes, setAppNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [newNote, setNewNote] = useState("");
  const [voteLoading, setVoteLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/staff/login");
      return;
    }

    fetchApplications();

    const channel = supabase
      .channel("applications_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        () => {
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, router]);

  async function fetchApplications() {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (!error && data) {
      setApplications(data);
    }
    setLoading(false);
  }

  async function fetchApplicationDetails(appId: string) {
    const [votesRes, notesRes] = await Promise.all([
      supabase.from("application_votes").select("*").eq("application_id", appId),
      supabase.from("application_notes").select("*").eq("application_id", appId).order("created_at", { ascending: false }),
    ]);

    if (votesRes.data) setAppVotes(votesRes.data);
    if (notesRes.data) setAppNotes(notesRes.data);
  }

  async function handleVote(appId: string, vote: "approve" | "deny" | "more_info") {
    if (!user) return;

    setVoteLoading(true);
    setMessage("");

    const { error } = await supabase.from("application_votes").upsert({
      application_id: appId,
      user_id: user.id,
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

  async function handleAddNote() {
    if (!user || !selectedApp || !newNote.trim()) return;

    const { error } = await supabase.from("application_notes").insert({
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
    await signOut();
    router.push("/staff/login");
  }

  function openApplicationDialog(app: Application) {
    setSelectedApp(app);
    fetchApplicationDetails(app.id);
    setMessage("");
  }

  const filteredApplications = applications.filter((app) => {
    if (filterStatus !== "all" && app.status !== filterStatus) return false;
    if (filterType !== "all" && app.application_type !== filterType) return false;
    return true;
  });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    under_review: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    denied: "bg-red-100 text-red-800",
    more_info_needed: "bg-orange-100 text-orange-800",
  };

  const typeLabels: Record<string, string> = {
    fun_grant: "Fun Grant",
    angel_aid: "Angel Aid",
    angel_hug: "Angel Hug",
    scholarship: "Scholarship",
    hugs_for_ukraine: "Hugs for Ukraine",
  };

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {applications.filter((a) => a.status === "approved").length}
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
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                      <SelectItem value="more_info_needed">More Info Needed</SelectItem>
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
                      <SelectItem value="hugs_for_ukraine">Hugs for Ukraine</SelectItem>
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
                            <Badge variant="outline">{typeLabels[app.application_type]}</Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{app.applicant_name}</h3>
                          <p className="text-sm text-gray-600">{app.applicant_email}</p>
                          {app.child_name && (
                            <p className="text-sm text-gray-600">Child: {app.child_name}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Submitted: {new Date(app.submitted_at).toLocaleDateString()}
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
                                {typeLabels[app.application_type]} - {app.applicant_name}
                              </DialogDescription>
                            </DialogHeader>

                            {message && (
                              <Alert>
                                <AlertDescription>{message}</AlertDescription>
                              </Alert>
                            )}

                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">Details</TabsTrigger>
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
                                  {app.child_name && (
                                    <>
                                      <div>
                                        <Label className="text-sm font-semibold">Child Name</Label>
                                        <p>{app.child_name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-semibold">Child Age</Label>
                                        <p>{app.child_age}</p>
                                      </div>
                                    </>
                                  )}
                                  {app.relationship && (
                                    <div>
                                      <Label className="text-sm font-semibold">Relationship</Label>
                                      <p>{app.relationship}</p>
                                    </div>
                                  )}
                                  {app.requested_amount && (
                                    <div>
                                      <Label className="text-sm font-semibold">Requested Amount</Label>
                                      <p>${app.requested_amount}</p>
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <Label className="text-sm font-semibold">Description</Label>
                                  <p className="mt-1 whitespace-pre-wrap">{app.description}</p>
                                </div>

                                {app.loss_details && (
                                  <div>
                                    <Label className="text-sm font-semibold">Loss Details</Label>
                                    <p className="mt-1 whitespace-pre-wrap">{app.loss_details}</p>
                                  </div>
                                )}

                                <div>
                                  <Label className="text-sm font-semibold">Address</Label>
                                  <p>
                                    {app.address && `${app.address}, `}
                                    {app.city && `${app.city}, `}
                                    {app.state} {app.zip_code}
                                  </p>
                                </div>
                              </TabsContent>

                              <TabsContent value="voting" className="space-y-4">
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
                                    onClick={() => handleVote(app.id, "more_info")}
                                    disabled={voteLoading}
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    More Info
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
                                          <span className="text-sm">Staff Member</span>
                                          <Badge
                                            variant={
                                              vote.vote === "approve"
                                                ? "default"
                                                : vote.vote === "deny"
                                                ? "destructive"
                                                : "secondary"
                                            }
                                          >
                                            {vote.vote.replace("_", " ")}
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