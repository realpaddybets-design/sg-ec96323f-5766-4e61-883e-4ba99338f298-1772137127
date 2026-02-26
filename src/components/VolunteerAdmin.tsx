import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Users, Calendar, MapPin, Send, CheckCircle } from "lucide-react";
import type { VolunteerOpportunity, VolunteerRSVP, VolunteerProfile, VolunteerAnnouncement } from "@/types/database";

interface VolunteerAdminProps {
  userId: string;
}

export function VolunteerAdmin({ userId }: VolunteerAdminProps) {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [rsvps, setRSVPs] = useState<VolunteerRSVP[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [announcements, setAnnouncements] = useState<VolunteerAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Create/Edit Opportunity Modal State
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [opportunityForm, setOpportunityForm] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    total_spots: 10,
    category: "general",
    requirements: "",
    contact_email: "",
  });

  // Announcement Modal State
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
    priority: "normal" as "normal" | "urgent",
    send_email: true,
    send_sms: false,
    target_group: "all" as "all" | "active" | "specific",
  });

  // Delete Confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [oppsData, rsvpsData, volunteersData, announcementsData] = await Promise.all([
        supabase.from("volunteer_opportunities").select("*").order("event_date", { ascending: true }),
        supabase.from("volunteer_rsvps").select("*, volunteer:volunteer_id(*)"),
        supabase.from("volunteer_profiles").select("*").order("full_name", { ascending: true }),
        supabase.from("volunteer_announcements").select("*").order("created_at", { ascending: false }).limit(10),
      ]);

      if (oppsData.data) setOpportunities(oppsData.data as VolunteerOpportunity[]);
      if (rsvpsData.data) setRSVPs(rsvpsData.data as any);
      if (volunteersData.data) setVolunteers(volunteersData.data as VolunteerProfile[]);
      if (announcementsData.data) setAnnouncements(announcementsData.data as VolunteerAnnouncement[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOpportunity = async () => {
    try {
      const { error } = await (supabase.from("volunteer_opportunities") as any).insert([{
        ...opportunityForm,
        created_by: userId,
        filled_spots: 0,
        status: "active",
      }]);

      if (error) throw error;

      setMessage("Opportunity created successfully!");
      setShowOpportunityModal(false);
      resetOpportunityForm();
      fetchData();
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  const handleUpdateOpportunity = async () => {
    if (!editingOpportunity) return;

    try {
      const { error } = await (supabase
        .from("volunteer_opportunities") as any)
        .update(opportunityForm)
        .eq("id", editingOpportunity.id);

      if (error) throw error;

      setMessage("Opportunity updated successfully!");
      setShowOpportunityModal(false);
      setEditingOpportunity(null);
      resetOpportunityForm();
      fetchData();
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  const handleDeleteOpportunity = async (id: string) => {
    try {
      const { error } = await supabase.from("volunteer_opportunities").delete().eq("id", id);

      if (error) throw error;

      setMessage("Opportunity deleted successfully!");
      fetchData();
    } catch (error: any) {
      setMessage("Error: " + error.message);
    } finally {
      setDeleteConfirmOpen(false);
      setOpportunityToDelete(null);
    }
  };

  const handleSendAnnouncement = async () => {
    try {
      const { error } = await (supabase.from("volunteer_announcements") as any).insert([{
        ...announcementForm,
        created_by: userId,
      }]);

      if (error) throw error;

      setMessage("Announcement sent successfully!");
      setShowAnnouncementModal(false);
      resetAnnouncementForm();
      fetchData();
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  const handleMarkAttendance = async (rsvpId: string, hours: number) => {
    try {
      const { error } = await (supabase
        .from("volunteer_rsvps") as any)
        .update({ status: "attended", hours_worked: hours })
        .eq("id", rsvpId);

      if (error) throw error;

      setMessage("Attendance marked!");
      fetchData();
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  const resetOpportunityForm = () => {
    setOpportunityForm({
      title: "",
      description: "",
      event_date: "",
      event_time: "",
      location: "",
      total_spots: 10,
      category: "general",
      requirements: "",
      contact_email: "",
    });
  };

  const resetAnnouncementForm = () => {
    setAnnouncementForm({
      title: "",
      message: "",
      priority: "normal",
      send_email: true,
      send_sms: false,
      target_group: "all",
    });
  };

  const openEditModal = (opportunity: VolunteerOpportunity) => {
    setEditingOpportunity(opportunity);
    setOpportunityForm({
      title: opportunity.title,
      description: opportunity.description,
      event_date: opportunity.event_date.split("T")[0],
      event_time: opportunity.event_time,
      location: opportunity.location,
      total_spots: opportunity.total_spots,
      category: opportunity.category,
      requirements: opportunity.requirements || "",
      contact_email: opportunity.contact_email || "",
    });
    setShowOpportunityModal(true);
  };

  const getOpportunityRSVPs = (opportunityId: string) => {
    return rsvps.filter(r => r.opportunity_id === opportunityId);
  };

  if (loading) {
    return <Card><CardContent className="p-8 text-center">Loading volunteer data...</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex gap-4">
        <Button onClick={() => { resetOpportunityForm(); setShowOpportunityModal(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Create Opportunity
        </Button>
        <Button onClick={() => setShowAnnouncementModal(true)} variant="outline">
          <Send className="w-4 h-4 mr-2" />
          Send Announcement
        </Button>
      </div>

      {message && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-900">{message}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-900">{volunteers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{opportunities.filter(o => o.status === "active").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total RSVPs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{rsvps.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Volunteer Opportunities List */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Opportunities</CardTitle>
          <CardDescription>Manage volunteer events and track attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {opportunities.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No opportunities created yet.</p>
          ) : (
            opportunities.map((opp) => {
              const oppRSVPs = getOpportunityRSVPs(opp.id);
              const confirmedCount = oppRSVPs.filter(r => r.status === "confirmed").length;

              return (
                <Card key={opp.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{opp.title}</h3>
                          <Badge variant={opp.status === "active" ? "default" : "secondary"}>
                            {opp.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{opp.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(opp.event_date).toLocaleDateString()} at {opp.event_time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {opp.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {confirmedCount} / {opp.total_spots} spots filled
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(opp)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            setOpportunityToDelete(opp.id);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {oppRSVPs.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-semibold mb-2">RSVPs ({oppRSVPs.length})</h4>
                        <div className="space-y-2">
                          {oppRSVPs.map((rsvp: any) => (
                            <div key={rsvp.id} className="flex justify-between items-center text-sm">
                              <div>
                                <span className="font-medium">{rsvp.volunteer?.full_name || "Unknown"}</span>
                                <Badge variant="outline" className="ml-2">{rsvp.status}</Badge>
                              </div>
                              {rsvp.status === "confirmed" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleMarkAttendance(rsvp.id, 3)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Mark Attended
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {announcements.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No announcements sent yet.</p>
          ) : (
            announcements.map((ann) => (
              <Card key={ann.id} className={ann.priority === "urgent" ? "border-red-200 bg-red-50" : ""}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{ann.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{ann.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(ann.created_at).toLocaleString()}
                      </p>
                    </div>
                    {ann.priority === "urgent" && (
                      <Badge variant="destructive">Urgent</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Opportunity Modal */}
      {showOpportunityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowOpportunityModal(false)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{editingOpportunity ? "Edit Opportunity" : "Create Opportunity"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={opportunityForm.title}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={opportunityForm.description}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Event Date *</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={opportunityForm.event_date}
                    onChange={(e) => setOpportunityForm({ ...opportunityForm, event_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_time">Event Time *</Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={opportunityForm.event_time}
                    onChange={(e) => setOpportunityForm({ ...opportunityForm, event_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={opportunityForm.location}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, location: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_spots">Total Spots *</Label>
                  <Input
                    id="total_spots"
                    type="number"
                    value={opportunityForm.total_spots}
                    onChange={(e) => setOpportunityForm({ ...opportunityForm, total_spots: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={opportunityForm.category}
                    onChange={(e) => setOpportunityForm({ ...opportunityForm, category: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={opportunityForm.requirements}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, requirements: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={opportunityForm.contact_email}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, contact_email: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={editingOpportunity ? handleUpdateOpportunity : handleCreateOpportunity}
                  className="flex-1"
                >
                  {editingOpportunity ? "Update" : "Create"} Opportunity
                </Button>
                <Button 
                  onClick={() => {
                    setShowOpportunityModal(false);
                    setEditingOpportunity(null);
                    resetOpportunityForm();
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Send Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowAnnouncementModal(false)}>
          <Card className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Send Announcement</CardTitle>
              <CardDescription>Communicate with your volunteer community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ann_title">Title *</Label>
                <Input
                  id="ann_title"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ann_message">Message *</Label>
                <Textarea
                  id="ann_message"
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={announcementForm.priority}
                    onValueChange={(value: "normal" | "urgent") => setAnnouncementForm({ ...announcementForm, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_group">Send To</Label>
                  <Select 
                    value={announcementForm.target_group}
                    onValueChange={(value: "all" | "active" | "specific") => setAnnouncementForm({ ...announcementForm, target_group: value })}
                  >
                    <SelectTrigger id="target_group">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Volunteers</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSendAnnouncement} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
                <Button 
                  onClick={() => {
                    setShowAnnouncementModal(false);
                    resetAnnouncementForm();
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this opportunity? This will also remove all RSVPs. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => opportunityToDelete && handleDeleteOpportunity(opportunityToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}