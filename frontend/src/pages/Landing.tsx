import { Heart, Users, Package, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Package,
      title: "Donate Food & Items",
      description: "Share food, clothing, furniture, and monetary donations with orphanages in need.",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "Connect Communities",
      description: "Bridge the gap between donors, orphanages, and volunteers in your area.",
      color: "text-secondary"
    },
    {
      icon: Heart,
      title: "Make an Impact",
      description: "Track your donations and see the direct impact of your generosity.",
      color: "text-accent"
    },
    {
      icon: Calendar,
      title: "Schedule Events",
      description: "Organize special celebrations and events with orphanages.",
      color: "text-warning"
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="text-2xl font-bold text-foreground">MealLink</span>
          </div>
          <Button onClick={() => navigate("/auth")} variant="default">
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Connecting Hearts,<br />
            <span className="text-primary">Nourishing Lives</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            MealLink bridges the gap between food waste and hunger by connecting donors with orphanages and volunteers to create a sustainable support system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button onClick={() => navigate("/auth")} size="lg" className="text-lg">
              Join as Donor
            </Button>
            <Button onClick={() => navigate("/auth")} size="lg" variant="outline" className="text-lg">
              Register Orphanage
            </Button>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">How MealLink Works</h2>
          <p className="text-muted-foreground text-lg">Simple steps to make a difference</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <feature.icon className={`w-12 h-12 mb-2 ${feature.color}`} />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* User Types Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Who Can Join?</h2>
            <p className="text-muted-foreground text-lg">Everyone has a role in reducing food waste</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Donors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Individuals or organizations wanting to donate food, clothes, furniture, or funds to support orphanages.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle>Orphanages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Organizations caring for children and seeking support from the community for their daily needs.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-accent" />
                </div>
                <CardTitle>Volunteers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Community members helping to pick up and deliver donations to orphanages efficiently.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of donors, volunteers, and orphanages working together to end food waste and hunger.
          </p>
          <Button onClick={() => navigate("/auth")} size="lg" className="text-lg">
            Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 MealLink. Reducing food waste, nourishing lives.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
