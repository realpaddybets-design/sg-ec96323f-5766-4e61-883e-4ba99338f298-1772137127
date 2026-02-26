import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Download, Filter, X } from "lucide-react";
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
        g.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(g => g.status === statusFilter);
    }

    setFilteredGrants(filtered);
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
            <Button onClick={exportToExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
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
            <Card key={grant.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedGrant(grant)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Grant Detail Modal */}
      {selectedGrant && (
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

              {selectedGrant.documents && selectedGrant.documents.length > 0 && (
                <div>
                  <Label className="text-gray-600">Documents</Label>
                  <div className="space-y-2 mt-2">
                    {selectedGrant.documents.map((doc, idx) => (
                      <Button key={idx} variant="outline" asChild className="w-full">
                        <a href={doc} target="_blank" rel="noopener noreferrer">
                          View Document {idx + 1}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Button variant="outline" onClick={() => setSelectedGrant(null)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}