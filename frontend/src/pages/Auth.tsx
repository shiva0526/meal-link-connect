import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Mail, Phone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [userType, setUserType] = useState<"donor" | "orphanage" | "volunteer" | "admin">("donor");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock OTP send - in real app, this would call backend
    setIsOtpSent(true);
    toast.success(`OTP sent to your ${contactMethod}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock OTP verification - in real app, this would verify with backend
    if (otp === "123456" || otp.length === 6) {
      toast.success("Login successful!");
      // Navigate based on user type
      const routes = {
        donor: "/donor-dashboard",
        orphanage: "/orphanage-dashboard",
        volunteer: "/volunteer-dashboard",
        admin: "/admin-dashboard"
      };
      navigate(routes[userType]);
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
          </Button>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-10 h-10 text-primary fill-primary" />
            <span className="text-3xl font-bold text-foreground">MealLink</span>
          </div>
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your details to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  {!isOtpSent ? (
                    <>
                      <div className="space-y-2">
                        <Label>I am a</Label>
                        <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="donor">Donor</SelectItem>
                            <SelectItem value="orphanage">Orphanage</SelectItem>
                            <SelectItem value="volunteer">Volunteer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Contact Method</Label>
                        <Select value={contactMethod} onValueChange={(value: any) => setContactMethod(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">
                              <div className="flex items-center">
                                <Mail className="mr-2 w-4 h-4" /> Email
                              </div>
                            </SelectItem>
                            <SelectItem value="phone">
                              <div className="flex items-center">
                                <Phone className="mr-2 w-4 h-4" /> Phone
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{contactMethod === "email" ? "Email Address" : "Phone Number"}</Label>
                        <Input
                          type={contactMethod === "email" ? "email" : "tel"}
                          placeholder={contactMethod === "email" ? "your@email.com" : "+91 1234567890"}
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Send OTP
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Enter OTP</Label>
                        <Input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          OTP sent to {contact}
                        </p>
                      </div>

                      <Button type="submit" className="w-full">
                        Verify & Login
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOtpSent(false)}
                      >
                        Change Contact
                      </Button>
                    </>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Register to start making a difference</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  {!isOtpSent ? (
                    <>
                      <div className="space-y-2">
                        <Label>I am a</Label>
                        <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="donor">Donor</SelectItem>
                            <SelectItem value="orphanage">Orphanage (Requires Admin Approval)</SelectItem>
                            <SelectItem value="volunteer">Volunteer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Full Name / Organization Name</Label>
                        <Input type="text" placeholder="Enter your name" required />
                      </div>

                      {userType === "donor" && (
                        <div className="space-y-2">
                          <Label>Aadhaar Number</Label>
                          <Input 
                            type="text" 
                            placeholder="Enter 12-digit Aadhaar number" 
                            maxLength={12}
                            pattern="[0-9]{12}"
                            required 
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Contact Method</Label>
                        <Select value={contactMethod} onValueChange={(value: any) => setContactMethod(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">
                              <div className="flex items-center">
                                <Mail className="mr-2 w-4 h-4" /> Email
                              </div>
                            </SelectItem>
                            <SelectItem value="phone">
                              <div className="flex items-center">
                                <Phone className="mr-2 w-4 h-4" /> Phone
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{contactMethod === "email" ? "Email Address" : "Phone Number"}</Label>
                        <Input
                          type={contactMethod === "email" ? "email" : "tel"}
                          placeholder={contactMethod === "email" ? "your@email.com" : "+91 1234567890"}
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Send OTP
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Enter OTP</Label>
                        <Input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          OTP sent to {contact}
                        </p>
                      </div>

                      <Button type="submit" className="w-full">
                        Verify & Sign Up
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOtpSent(false)}
                      >
                        Change Details
                      </Button>
                    </>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
