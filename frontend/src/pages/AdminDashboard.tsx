import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, LogOut, Users, Settings, BarChart3, CheckCircle, XCircle, Package, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import donationsApi from "@/api/donations";
import usersApi from "@/api/users";
import orphanagesApi from "@/api/orphanages";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName] = useState("Admin User");
  const [donations, setDonations] = useState<any[]>([]);
  const [pendingOrphanages, setPendingOrphanages] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const loadDonations = async () => {
    try {
      const data = await donationsApi.getAllPending();
      setDonations(data);
    } catch (err) {
      console.error("Failed to load donations", err);
    }
  };

  const loadPendingOrphanages = async () => {
    try {
      const data = await orphanagesApi.getPendingApproval();
      setPendingOrphanages(data);
    } catch (err) {
      console.error("Failed to load pending orphanages", err);
    }
  };

  const loadEvents = async () => {
    // Events not implemented
    setEvents([]);
  };

  useEffect(() => {
    loadDonations();
    loadPendingOrphanages();
    loadEvents();
  }, []);

  const handleApproveDonation = async (id: string) => {
    // Admin approval might just mean marking it as approved, or maybe assigning to an orphanage?
    // For now let's assume admin can approve directly (maybe for general pool)
    // But wait, the requirement says "Approve or manage donation requests".
    // If I use the same decision endpoint, I need to be an orphanage.
    // But maybe admin can also approve?
    // The backend `orphan_decision` requires "orphanage" role.
    // I should probably update backend to allow admin to approve too, or just use a different endpoint.
    // For now, let's assume admin can use the same endpoint if they have the role, OR I update backend.
    // Actually, let's just use the same endpoint and update backend to allow admin.
    try {
      await donationsApi.decision(id, true);
      toast.success("Donation approved successfully");
      loadDonations();
    } catch (err) {
      console.error("Approve error", err);
      toast.error("Failed to approve donation");
    }
  };

  const handleRejectDonation = async (id: string) => {
    try {
      await donationsApi.decision(id, false);
      toast.success("Donation rejected");
      loadDonations();
    } catch (err) {
      console.error("Reject error", err);
      toast.error("Failed to reject donation");
    }
  };

  const handleApproveOrphanage = async (id: string) => {
    try {
      await orphanagesApi.approve(id);
      toast.success("Orphanage approved successfully");
      loadPendingOrphanages();
    } catch (err) {
      console.error("Approve orphanage error", err);
      toast.error("Failed to approve orphanage");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="text-2xl font-bold text-foreground">MealLink</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Welcome, {adminName}</span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, donations, and system operations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast.info("User Management: View and manage all registered users")}>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View All Users</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast.info("Donation Analytics: View detailed reports and statistics")}>
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Donation Analytics</CardTitle>
              <CardDescription>View reports and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">View Reports</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast.info("System Settings: Configure platform preferences")}>
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                <Settings className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Open Settings</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Orphanage Approvals</CardTitle>
            <CardDescription>Approve new orphanage registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingOrphanages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending orphanage approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingOrphanages.map((org) => (
                  <div key={org.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {org.address} • {org.contact_person}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApproveOrphanage(org.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
            <CardDescription>Monitor all scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No events scheduled</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">{event.event_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.orphanages?.name || "Unknown Orphanage"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            By {event.profiles?.full_name || "Unknown Donor"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(new Date(event.event_date), "PPP")}</p>
                        <p className="text-sm text-muted-foreground capitalize">{event.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
