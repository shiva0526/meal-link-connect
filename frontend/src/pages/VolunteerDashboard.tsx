import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MapPin, Package, CheckCircle, LogOut, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import volunteersApi from "@/api/volunteers";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [availableDonations, setAvailableDonations] = useState<any[]>([]);
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([]); // For now empty or fetch from backend if endpoint exists

  const loadData = async () => {
    try {
      const available = await volunteersApi.available();
      setAvailableDonations(available);

      const active = await volunteersApi.myDeliveries();
      setActiveDeliveries(active);
    } catch (err) {
      console.error("Failed to load volunteer data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaim = async (id: string) => {
    try {
      await volunteersApi.claim(id);
      toast.success("Donation claimed successfully!");
      loadData();
      // In a real app, we would also refresh active deliveries
    } catch (err: any) {
      console.error("Claim error", err);
      toast.error(err.response?.data?.detail || "Failed to claim donation");
    }
  };

  const stats = [
    { label: "Pickups Completed", value: "0", icon: Package, color: "text-primary" },
    { label: "Active Requests", value: availableDonations.length.toString(), icon: MapPin, color: "text-warning" },
    { label: "Total Distance", value: "0km", icon: Navigation, color: "text-secondary" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="text-2xl font-bold text-foreground">MealLink</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Volunteer Portal</span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Volunteer Dashboard</h1>
          <p className="text-muted-foreground">Manage pickup requests and deliveries</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Available Pickup Requests</CardTitle>
            <CardDescription>Accept requests to help deliver donations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableDonations.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No available pickup requests.</p>
              ) : (
                availableDonations.map((d) => (
                  <div key={d.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{d.donation_type} Donation</p>
                          <p className="text-sm text-muted-foreground">
                            {d.details && JSON.stringify(d.details)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{d.delivery_method}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" onClick={() => handleClaim(d.id)}>Accept</Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
            <CardDescription>Track your ongoing pickups and deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeDeliveries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active deliveries
                </div>
              ) : (
                activeDeliveries.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">{d.donation_type} Donation</p>
                        <p className="text-sm text-muted-foreground">
                          {d.details && JSON.stringify(d.details)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Status: {d.status.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4 mr-2" /> View Route
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VolunteerDashboard;
