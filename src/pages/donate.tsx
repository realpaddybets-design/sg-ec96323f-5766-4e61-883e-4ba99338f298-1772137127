import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, Mail, DollarSign, Users, Sparkles, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import getStripe from "@/lib/getStripe";

export default function Donate() {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("50");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donationType, setDonationType] = useState<string>("general");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (router.query.success === "true") {
      setSuccess(true);
    }
  }, [router.query]);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value !== "custom") {
      setCustomAmount("");
    }
  };

  const handleDonate = async () => {
    setLoading(true);
    setError(null);

    const finalAmount = amount === "custom" ? parseFloat(customAmount) : parseFloat(amount);

    if (!finalAmount || finalAmount < 1) {
      setError("Please enter a valid donation amount (minimum $1).");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          donationType,
          isRecurring,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      const stripe = await getStripe();
      if (!stripe) throw new Error("Stripe failed to load");

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to initiate donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Donate - Kelly's Angels Inc."
        description="Support Kelly's Angels Inc. - a 501(c)(3) nonprofit. 100% of donations go directly to helping children and families in need."
        image="/og-image.png"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <section className="bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-16 md:py-24">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center animate-pulse">
                    <Heart className="text-white" size={40} fill="currentColor" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground">
                  Make a Donation
                </h1>
                <p className="text-xl text-muted-foreground">
                  Every dollar brings smiles to children during difficult times
                </p>
              </div>
            </div>
          </section>

          <section className="section-padding bg-background">
            <div className="container">
              <div className="max-w-4xl mx-auto space-y-12">
                
                {success && (
                  <Alert className="bg-green-50 border-green-200 mb-8">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800 font-bold">Thank you for your generous donation!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Your support means the world to the families we serve. A receipt has been sent to your email.
                    </AlertDescription>
                  </Alert>
                )}

                <Card className="card-shadow border-border overflow-hidden">
                  <div className="bg-primary/5 p-6 border-b border-primary/10">
                    <h3 className="text-2xl font-heading font-bold text-center text-foreground">
                      Choose Your Donation
                    </h3>
                  </div>
                  <CardContent className="p-8 md:p-12 space-y-8">
                    
                    {/* Amount Selection */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">Select Amount</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["25", "50", "100", "250"].map((val) => (
                          <Button
                            key={val}
                            type="button"
                            variant={amount === val ? "default" : "outline"}
                            className={`h-16 text-lg ${amount === val ? "bg-primary text-primary-foreground" : "hover:border-primary/50"}`}
                            onClick={() => handleAmountChange(val)}
                          >
                            ${val}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroup 
                            value={amount === "custom" ? "custom" : "fixed"} 
                            onValueChange={(v) => v === "custom" && setAmount("custom")}
                            className="flex items-center"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="custom" id="custom-amount" />
                              <Label htmlFor="custom-amount" className="cursor-pointer">Custom Amount</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        {amount === "custom" && (
                          <div className="relative mt-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Enter amount"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              className="pl-8 text-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Frequency */}
                    <div className="space-y-4 pt-4 border-t">
                      <Label className="text-lg font-semibold">Frequency</Label>
                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant={!isRecurring ? "default" : "outline"}
                          className={`flex-1 ${!isRecurring ? "bg-primary" : ""}`}
                          onClick={() => setIsRecurring(false)}
                        >
                          One-time
                        </Button>
                        <Button
                          type="button"
                          variant={isRecurring ? "default" : "outline"}
                          className={`flex-1 ${isRecurring ? "bg-primary" : ""}`}
                          onClick={() => setIsRecurring(true)}
                        >
                          Monthly
                        </Button>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-6">
                      {error && (
                        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                      )}
                      <Button 
                        size="lg" 
                        className="w-full text-xl py-8 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                        onClick={handleDonate}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Heart className="mr-2 h-6 w-6 fill-current" />
                            Donate {amount !== "custom" ? `$${amount}` : customAmount ? `$${customAmount}` : ""} {isRecurring && "/ Month"}
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        Secure payment processing by Stripe. 100% of your donation goes to Kelly's Angels.
                      </p>
                    </div>

                  </CardContent>
                </Card>

                <div className="bg-primary/5 rounded-lg p-8 border-2 border-primary/20 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <Users className="text-white" size={32} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                    100% Volunteer Organization
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    Kelly&apos;s Angels Inc. is run entirely by volunteers. <strong className="text-foreground">Every single dollar</strong> you 
                    donate goes directly to helping children and families in need. No overhead, no administrative fees.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="card-shadow border-border text-center hover:border-primary/30 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Sparkles className="text-primary" size={24} />
                      </div>
                      <CardTitle className="text-lg font-heading">Fun Grants</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Create joyful memories through tickets to theme parks, concerts, and special events
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="card-shadow border-border text-center hover:border-accent/30 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Heart className="text-accent" size={24} />
                      </div>
                      <CardTitle className="text-lg font-heading">Angel Aid</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Provide emergency financial support for families facing medical bills or urgent expenses
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="card-shadow border-border text-center hover:border-primary/30 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <DollarSign className="text-primary" size={24} />
                      </div>
                      <CardTitle className="text-lg font-heading">Scholarships</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Help college-bound students who have persevered through adversity achieve their dreams
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail size={24} className="text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-heading font-semibold text-foreground">Prefer to Donate by Mail?</h4>
                      <p className="text-sm text-muted-foreground">
                        Make checks payable to <strong className="text-foreground">Kelly&apos;s Angels Inc.</strong> and mail to:
                      </p>
                      <div className="pl-4 border-l-2 border-primary/30 text-muted-foreground text-sm">
                        <p>Kelly&apos;s Angels Inc.</p>
                        <p>P.O. Box 2034</p>
                        <p>Wilton, NY 12831</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}