import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MapPin, Package, CheckCircle, LogOut, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VolunteerDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Pickups Completed", value: "32", icon: Package, color: "text-primary" },
    { label: "Active Requests", value: "4", icon: MapPin, color: "text-warning" },
    { label: "Total Distance", value: "145km", icon: Navigation, color: "text-secondary" }
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
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Food Donation Pickup</p>
                      <p className="text-sm text-muted-foreground">30 meals • From Downtown Area</p>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">3.5 km away</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm">Accept</Button>
                    <Button size="sm" variant="outline">Decline</Button>
                  </div>
                </div>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>Pickup: 123 Main St</span>
                  <span>•</span>
                  <span>Deliver: Sunshine Orphanage</span>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Clothing Donation Pickup</p>
                      <p className="text-sm text-muted-foreground">Large box • From Residential Area</p>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">5.2 km away</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="secondary">Accept</Button>
                    <Button size="sm" variant="outline">Decline</Button>
                  </div>
                </div>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>Pickup: 456 Oak Ave</span>
                  <span>•</span>
                  <span>Deliver: Hope Children's Home</span>
                </div>
              </div>
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
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Furniture Donation</p>
                    <p className="text-sm text-muted-foreground">In Transit • ETA: 30 mins</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Navigation className="w-4 h-4 mr-2" /> View Route
                </Button>
              </div>

              <div className="text-center py-8 text-muted-foreground">
                No other active deliveries
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VolunteerDashboard;
