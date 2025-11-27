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
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Auth = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [userType, setUserType] = useState<"donor" | "orphanage" | "volunteer" | "admin">("donor");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpSent(true);
    toast.success(`OTP sent to your ${contactMethod}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "123456" || otp.length === 6) {
      toast.success("Login successful!");
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
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 w-4 h-4" /> {t('auth.backToHome')}
          </Button>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-10 h-10 text-primary fill-primary" />
            <span className="text-3xl font-bold text-foreground">{t('app.name')}</span>
          </div>
          <p className="text-muted-foreground">{t('auth.signIn')}</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
            <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t('auth.welcomeBack')}</CardTitle>
                <CardDescription>{t('auth.welcomeDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  {!isOtpSent ? (
                    <>
                      <div className="space-y-2">
                        <Label>{t('auth.iAmA')}</Label>
                        <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="donor">{t('auth.donor')}</SelectItem>
                            <SelectItem value="orphanage">{t('auth.orphanage')}</SelectItem>
                            <SelectItem value="volunteer">{t('auth.volunteer')}</SelectItem>
                            <SelectItem value="admin">{t('auth.admin')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{t('auth.contactMethod')}</Label>
                        <Select value={contactMethod} onValueChange={(value: any) => setContactMethod(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">
                              <div className="flex items-center">
                                <Mail className="mr-2 w-4 h-4" /> {t('auth.email')}
                              </div>
                            </SelectItem>
                            <SelectItem value="phone">
                              <div className="flex items-center">
                                <Phone className="mr-2 w-4 h-4" /> {t('auth.phone')}
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{contactMethod === "email" ? t('auth.emailAddress') : t('auth.phoneNumber')}</Label>
                        <Input
                          type={contactMethod === "email" ? "email" : "tel"}
                          placeholder={contactMethod === "email" ? "your@email.com" : "+91 1234567890"}
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        {t('auth.sendOtp')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>{t('auth.enterOtp')}</Label>
                        <Input
                          type="text"
                          placeholder={t('auth.otpPlaceholder')}
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          {t('auth.otpSentTo')} {contact}
                        </p>
                      </div>

                      <Button type="submit" className="w-full">
                        {t('auth.verifyLogin')}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOtpSent(false)}
                      >
                        {t('auth.changeContact')}
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
                <CardTitle>{t('auth.createAccount')}</CardTitle>
                <CardDescription>{t('auth.createAccountDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  {!isOtpSent ? (
                    <>
                      <div className="space-y-2">
                        <Label>{t('auth.iAmA')}</Label>
                        <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="donor">{t('auth.donor')}</SelectItem>
                            <SelectItem value="orphanage">{t('auth.orphanageApproval')}</SelectItem>
                            <SelectItem value="volunteer">{t('auth.volunteer')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{t('auth.fullName')}</Label>
                        <Input type="text" placeholder={t('auth.namePlaceholder')} required />
                      </div>

                      {userType === "donor" && (
                        <div className="space-y-2">
                          <Label>{t('auth.aadhaar')}</Label>
                          <Input 
                            type="text" 
                            placeholder={t('auth.aadhaarPlaceholder')}
                            maxLength={12}
                            pattern="[0-9]{12}"
                            required 
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>{t('auth.contactMethod')}</Label>
                        <Select value={contactMethod} onValueChange={(value: any) => setContactMethod(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">
                              <div className="flex items-center">
                                <Mail className="mr-2 w-4 h-4" /> {t('auth.email')}
                              </div>
                            </SelectItem>
                            <SelectItem value="phone">
                              <div className="flex items-center">
                                <Phone className="mr-2 w-4 h-4" /> {t('auth.phone')}
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{contactMethod === "email" ? t('auth.emailAddress') : t('auth.phoneNumber')}</Label>
                        <Input
                          type={contactMethod === "email" ? "email" : "tel"}
                          placeholder={contactMethod === "email" ? "your@email.com" : "+91 1234567890"}
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        {t('auth.sendOtp')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>{t('auth.enterOtp')}</Label>
                        <Input
                          type="text"
                          placeholder={t('auth.otpPlaceholder')}
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          {t('auth.otpSentTo')} {contact}
                        </p>
                      </div>

                      <Button type="submit" className="w-full">
                        {t('auth.verifySignup')}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOtpSent(false)}
                      >
                        {t('auth.changeDetails')}
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
