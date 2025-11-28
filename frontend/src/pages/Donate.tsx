import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, ArrowLeft, Package, Shirt, Sofa, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import donationsApi from "@/api/donations";
import usersApi from "@/api/users";
import orphanagesApi, { OrphanageOut } from "@/api/orphanages";

const Donate = () => {
  const navigate = useNavigate();
  const [donationType, setDonationType] = useState<"food" | "money" | "clothes" | "furniture">("food");
  const [deliveryMethod, setDeliveryMethod] = useState<"self" | "pickup">("self");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Form fields
  const [mealsCount, setMealsCount] = useState<number | "">("");
  const [foodType, setFoodType] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [clothingType, setClothingType] = useState<string>("");
  const [clothingCondition, setClothingCondition] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [itemQuantity, setItemQuantity] = useState<number | "">("");
  const [itemCondition, setItemCondition] = useState<string>("");
  const [pickupAddress, setPickupAddress] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [selectedOrphanage, setSelectedOrphanage] = useState<string>("");
  const [orphanages, setOrphanages] = useState<OrphanageOut[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    if (!currentUserId) {
      toast.error("You must be logged in to submit a donation.");
      navigate("/auth");
      return;
    }

    // Build details object depending on donation type
    const details: Record<string, any> = {};
    if (donationType === "food") {
      details.meals_count = mealsCount || null;
      details.food_type = foodType || null;
    } else if (donationType === "money") {
      details.amount = amount || null;
      details.payment_method = paymentMethod || null;
    } else if (donationType === "clothes") {
      details.quantity = quantity || null;
      details.clothing_type = clothingType || null;
      details.condition = clothingCondition || null;
    } else if (donationType === "furniture") {
      details.item_description = itemDescription || null;
      details.quantity = itemQuantity || null;
      details.condition = itemCondition || null;
    }
    if (deliveryMethod === "pickup") {
      details.pickup_address = pickupAddress || null;
      details.pickup_date = pickupDate || null;
    }
    if (additionalNotes) details.notes = additionalNotes;

    const payload = {
      donor_id: currentUserId,
      donation_type: donationType,
      details: Object.keys(details).length ? details : null,
      delivery_method: deliveryMethod,
      orphanage_id: selectedOrphanage || null,
    };

    try {
      await donationsApi.create(payload as any);
      toast.success("Donation submitted successfully! An admin will review your request.");
      navigate("/donor-dashboard");
    } catch (err: any) {
      console.error("Submit donation error:", err);
      const msg = err.response?.data?.detail || "Failed to submit donation. Is backend running?";
      toast.error(msg);
    }
  };

  useEffect(() => {
    const loadMe = async () => {
      try {
        const me = await usersApi.getMe();
        setCurrentUserId(me.id);
      } catch (err) {
        // Not logged in or failed to fetch
        setCurrentUserId(null);
      }
    };
    loadMe();

    const loadOrphanages = async () => {
      try {
        const data = await orphanagesApi.getAll();
        setOrphanages(data);
      } catch (err) {
        console.error("Failed to load orphanages", err);
      }
    };
    loadOrphanages();
  }, []);

  const donationIcons = {
    food: Package,
    money: DollarSign,
    clothes: Shirt,
    furniture: Sofa
  };

  const Icon = donationIcons[donationType];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="text-2xl font-bold text-foreground">MealLink</span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/donor-dashboard")}>
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Make a Donation</h1>
          <p className="text-muted-foreground">Fill in the details to contribute to orphanages in need</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Donation Type</CardTitle>
              <CardDescription>Select what you would like to donate</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={donationType} onValueChange={(value: any) => setDonationType(value)}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <RadioGroupItem value="food" id="food" className="peer sr-only" />
                    <Label
                      htmlFor="food"
                      className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <Package className="w-8 h-8 mb-2 text-primary" />
                      <span className="font-medium">Food</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="money" id="money" className="peer sr-only" />
                    <Label
                      htmlFor="money"
                      className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <DollarSign className="w-8 h-8 mb-2 text-primary" />
                      <span className="font-medium">Money</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="clothes" id="clothes" className="peer sr-only" />
                    <Label
                      htmlFor="clothes"
                      className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <Shirt className="w-8 h-8 mb-2 text-primary" />
                      <span className="font-medium">Clothes</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="furniture" id="furniture" className="peer sr-only" />
                    <Label
                      htmlFor="furniture"
                      className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <Sofa className="w-8 h-8 mb-2 text-primary" />
                      <span className="font-medium">Furniture</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {donationType.charAt(0).toUpperCase() + donationType.slice(1)} Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {donationType === "food" && (
                <>
                  <div className="space-y-2">
                    <Label>Number of Meals</Label>
                    <Input value={mealsCount} onChange={(e) => setMealsCount(Number(e.target.value))} type="number" placeholder="e.g., 50" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Food Type</Label>
                    <Input value={foodType} onChange={(e) => setFoodType(e.target.value)} placeholder="e.g., Cooked meals, Dry rations, Fresh produce" required />
                  </div>
                </>
              )}

              {donationType === "money" && (
                <>
                  <div className="space-y-2">
                    <Label>Amount (₹)</Label>
                    <Input value={amount} onChange={(e) => setAmount(Number(e.target.value))} type="number" placeholder="Enter amount" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select required value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="phonepe">PhonePe</SelectItem>
                        <SelectItem value="paytm">Paytm</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {donationType === "clothes" && (
                <>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} type="number" placeholder="Number of items" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Clothing Type</Label>
                    <Input value={clothingType} onChange={(e) => setClothingType(e.target.value)} placeholder="e.g., Children's wear, Winter clothes" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select required value={clothingCondition} onValueChange={(v: any) => setClothingCondition(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {donationType === "furniture" && (
                <>
                  <div className="space-y-2">
                    <Label>Item Description</Label>
                    <Input value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="e.g., Bed, Table, Chairs" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input value={itemQuantity} onChange={(e) => setItemQuantity(Number(e.target.value))} type="number" placeholder="Number of items" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select required value={itemCondition} onValueChange={(v: any) => setItemCondition(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} placeholder="Any special instructions or details" />
              </div>
            </CardContent>
          </Card>

          {donationType !== "money" && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryMethod} onValueChange={(value: any) => setDeliveryMethod(value)}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="self" id="self" />
                      <Label htmlFor="self" className="cursor-pointer">
                        Self Drop-off (I will deliver to the orphanage)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="cursor-pointer">
                        Request Pickup (Volunteer will collect)
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {deliveryMethod === "pickup" && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Pickup Address</Label>
                      <Textarea value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder="Enter your complete address" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Pickup Date</Label>
                      <Input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} type="date" required />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Select Orphanage</CardTitle>
            </CardHeader>
            <CardContent>
              <Select required value={selectedOrphanage} onValueChange={(v: any) => setSelectedOrphanage(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an orphanage" />
                </SelectTrigger>
                <SelectContent>
                  {orphanages.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name} ({org.address})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="flex items-start space-x-2 p-4 bg-muted/50 rounded-lg">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
              I agree to the terms and conditions. I confirm that the donated items are in good condition and suitable for use by the orphanage.
            </Label>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/donor-dashboard")}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Donation
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Donate;
