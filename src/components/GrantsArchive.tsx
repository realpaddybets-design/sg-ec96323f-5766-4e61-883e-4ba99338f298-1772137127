import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Download, Filter, X, Plus, Pencil, Trash2, Save } from "lucide-react";
import type { Grant, GrantStatus } from "@/types/database";

interface GrantsArchiveProps {
  isAdmin: boolean;
}

export function GrantsArchive({ isAdmin }: GrantsArchiveProps) {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<GrantStatus | "all">("all");
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  
  // Admin States
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [grantToDelete, setGrantToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Grant>>({});

  useEffect(() => {
    loadGrants();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, grants]);

  const loadGrants = async () => {
    try {
      const { data, error } = await (supabase
        .from("grants") as any)
        .select("*")
        .order("application_date", { ascending: false });

      if (error) throw error;
      setGrants(data || []);
    } catch (error) {
      console.error("Error loading grants:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...grants];

    if (searchTerm) {
      filtered = filtered.filter(g => 
        g.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.organization && g.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
        g.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(g => g.status === statusFilter);
    }

    setFilteredGrants(filtered);
  };

  const handleCreate = async () => {
    try {
      const { data, error } = await (supabase.from("grants") as any)
        .insert([{
          ...formData,
          status: formData.status || "approved",
          application_date: formData.application_date || new Date().toISOString(),
          amount_requested: formData.amount_requested || 0,
        }])
        .select();

      if (error) throw error;
      
      setGrants([data[0], ...grants]);
      setIsCreating(false);
      setFormData({});
    } catch (error) {
      console.error("Error creating grant:", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedGrant) return;

    try {
      const { error } = await (supabase.from("grants") as any)
        .update(formData)
        .eq("id", selectedGrant.id);

      if (error) throw error;

      setGrants(grants.map(g => g.id === selectedGrant.id ? { ...g, ...formData } : g));
      setSelectedGrant(null);
      setIsEditing(false);
      setFormData({});
    } catch (error) {
      console.error("Error updating grant:", error);
    }
  };

  const handleDelete = async () => {
    if (!grantToDelete) return;

    try {
      const { error } = await (supabase.from("grants") as any)
        .delete()
        .eq("id", grantToDelete);

      if (error) throw error;

      setGrants(grants.filter(g => g.id !== grantToDelete));
      setDeleteConfirmOpen(false);
      setGrantToDelete(null);
      if (selectedGrant?.id === grantToDelete) setSelectedGrant(null);
    } catch (error) {
      console.error("Error deleting grant:", error);
    }
  };

  const openEdit = (grant: Grant) => {
    setFormData(grant);
    setSelectedGrant(grant);
    setIsEditing(true);
  };

  const exportToExcel = () => {
    const csv = [
      ["Date", "Applicant", "Organization", "Category", "Amount Requested", "Amount Approved", "Status", "Decision Date"],
      ...filteredGrants.map(g => [
        g.application_date,
        g.applicant_name,
        g.organization || "",
        g.category,
        g.amount_requested,
        g.amount_approved || "",
        g.status,
        g.decision_date || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grants-archive-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: GrantStatus) => {
    const variants: Record<GrantStatus, "default" | "secondary" | "outline" | "destructive"> = {
      pending: "secondary",
      under_review: "outline",
      approved: "default",
      denied: "destructive",
    };
    return <Badge variant={variants[status]}>{status.replace("_", " ")}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Loading grants archive...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Grants Archive</CardTitle>
              <CardDescription>Search and manage all grant applications</CardDescription>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Dialog open={isCreating} onOpenChange={setIsCreating}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Grant Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Manual Grant Record</DialogTitle>
                      <DialogDescription>Add a historical or manual grant entry to the archive.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Applicant Name</Label>
                        <Input 
                          value={formData.applicant_name || ""} 
                          onChange={e => setFormData({...formData, applicant_name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={val => setFormData({...formData, category: val as any})}
                        >
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fun_grant">Fun Grant</SelectItem>
                            <SelectItem value="angel_aid">Angel Aid</SelectItem>
                            <SelectItem value="scholarship">Scholarship</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Amount Requested</Label>
                        <Input 
                          type="number"
                          value={formData.amount_requested || ""} 
                          onChange={e => setFormData({...formData, amount_requested: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount Approved</Label>
                        <Input 
                          type="number"
                          value={formData.amount_approved || ""} 
                          onChange={e => setFormData({...formData, amount_approved: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select 
                          value={formData.status || "approved"} 
                          onValueChange={val => setFormData({...formData, status: val as GrantStatus})}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="under_review">Under Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="denied">Denied</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input 
                          type="date"
                          value={formData.application_date?.split('T')[0] || new Date().toISOString().split('T')[0]} 
                          onChange={e => setFormData({...formData, application_date: new Date(e.target.value).toISOString()})}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                          value={formData.description || ""} 
                          onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                      <Button onClick={handleCreate}>Create Record</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Button onClick={exportToExcel} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, organization, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || statusFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="text-sm text-gray-600 mb-2">
        Showing {filteredGrants.length} of {grants.length} grants
      </div>

      {filteredGrants.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No grants found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredGrants.map((grant) => (
            <Card key={grant.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start" onClick={() => setSelectedGrant(grant)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{grant.applicant_name}</h3>
                      {getStatusBadge(grant.status)}
                      <Badge variant="outline">{grant.category}</Badge>
                    </div>
                    {grant.organization && (
                      <p className="text-sm text-gray-600">{grant.organization}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{grant.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-600">Requested</p>
                    <p className="font-semibold text-lg">${grant.amount_requested.toLocaleString()}</p>
                    {grant.amount_approved && (
                      <>
                        <p className="text-sm text-gray-600 mt-1">Approved</p>
                        <p className="font-semibold text-green-600">${grant.amount_approved.toLocaleString()}</p>
                      </>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(grant.application_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(grant); }}>
                      <Pencil className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={(e) => { 
                      e.stopPropagation(); 
                      setGrantToDelete(grant.id);
                      setDeleteConfirmOpen(true);
                    }}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Grant Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Applicant Name</Label>
              <Input 
                value={formData.applicant_name || ""} 
                onChange={e => setFormData({...formData, applicant_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={val => setFormData({...formData, category: val as any})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fun_grant">Fun Grant</SelectItem>
                  <SelectItem value="angel_aid">Angel Aid</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount Requested</Label>
              <Input 
                type="number"
                value={formData.amount_requested || ""} 
                onChange={e => setFormData({...formData, amount_requested: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount Approved</Label>
              <Input 
                type="number"
                value={formData.amount_approved || ""} 
                onChange={e => setFormData({...formData, amount_approved: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={val => setFormData({...formData, status: val as GrantStatus})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description || ""} 
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Internal Notes</Label>
              <Textarea 
                value={formData.notes || ""} 
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grant Detail Modal (View Only) */}
      {selectedGrant && !isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedGrant(null)}>
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{selectedGrant.applicant_name}</CardTitle>
                  {selectedGrant.organization && (
                    <CardDescription>{selectedGrant.organization}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedGrant.status)}
                  <Badge variant="outline">{selectedGrant.category}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedGrant(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Email</Label>
                  <p className="font-medium">{selectedGrant.email}</p>
                </div>
                {selectedGrant.phone && (
                  <div>
                    <Label className="text-gray-600">Phone</Label>
                    <p className="font-medium">{selectedGrant.phone}</p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-600">Amount Requested</Label>
                  <p className="font-medium text-lg">${selectedGrant.amount_requested.toLocaleString()}</p>
                </div>
                {selectedGrant.amount_approved && (
                  <div>
                    <Label className="text-gray-600">Amount Approved</Label>
                    <p className="font-medium text-lg text-green-600">${selectedGrant.amount_approved.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-600">Application Date</Label>
                  <p className="font-medium">{new Date(selectedGrant.application_date).toLocaleDateString()}</p>
                </div>
                {selectedGrant.decision_date && (
                  <div>
                    <Label className="text-gray-600">Decision Date</Label>
                    <p className="font-medium">{new Date(selectedGrant.decision_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-600">Description</Label>
                <p className="whitespace-pre-wrap mt-2">{selectedGrant.description}</p>
              </div>

              {selectedGrant.notes && (
                <div>
                  <Label className="text-gray-600">Internal Notes</Label>
                  <p className="whitespace-pre-wrap mt-2 p-3 bg-gray-50 rounded-md">{selectedGrant.notes}</p>
                </div>
              )}

              <Button variant="outline" onClick={() => setSelectedGrant(null)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Grant Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this grant record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}