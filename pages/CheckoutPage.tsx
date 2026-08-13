import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from '../lib/data';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { triggerStripeSubscriptionCheckout } from '../lib/stripe';
import { Lock, ShieldCheck, CheckCircle2, Clock, Sparkles } from 'lucide-react';


export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('product');
  const isCart = searchParams.get('cart') === 'true';
  const isCanceled = searchParams.get('canceled') === 'true';
  
  const product = productId ? PRODUCTS.find(p => p.id === productId) : PRODUCTS[0];

  const [formData, setFormData] = useState({
    email: '',
    termsAccepted: false
  });
  
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Please enter a valid email address";
    if (!formData.termsAccepted) newErrors.terms = "You must accept the terms and conditions to proceed";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await triggerStripeSubscriptionCheckout(
      {
        monthlyPrice: 20,
        trialDays: 3,
        productName: product ? product.name : 'Avada Architecture Pass',
      },
      {
        name: formData.email.split('@')[0],
        email: formData.email,
        phone: ''
      },
      () => {
        setIsSubmitting(false);
      }
    );
  };

  if (!product && !isCart) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20">
        <h2 className="text-2xl font-bold mb-4">No items to checkout</h2>
        <Button onClick={() => navigate('/shop')}>Go to Shop</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {isCanceled && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 text-red-800 dark:text-red-300 text-sm">
            Checkout was canceled. You can try again whenever you're ready.
          </div>
        )}

        {/* Trial Header Badge */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 mb-8 flex items-center gap-3 text-orange-800 dark:text-orange-300">
          <Sparkles size={24} className="shrink-0 text-orange-600 dark:text-orange-400" />
          <div>
            <p className="font-bold text-sm sm:text-base">3-Day Free Trial Activated</p>
            <p className="text-xs opacity-90">Enjoy 72 hours of full access. Auto-renews at $20/month via Stripe starting Day 4. Cancel anytime before trial ends.</p>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Activate Your 3-Day Free Trial</h1>
        <p className="text-muted-foreground mb-8">Enter your email and card details to enable your 3-day free trial.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Col: Customer Details Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Email</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5" id="checkout-form">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Email Address <span className="text-destructive">*</span></label>
                    <Input 
                      type="email" 
                      placeholder="you@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                    <p className="text-muted-foreground text-xs mt-1">Your course access link and portal login will be linked to this email</p>
                  </div>

                  <div className="flex items-start gap-3 pt-4 border-t border-border">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      className="mt-1 w-4 h-4 accent-primary"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                      I accept the <Link to="/terms" className="text-primary hover:underline font-semibold">Terms</Link>, <Link to="/privacy-policy" className="text-primary hover:underline font-semibold">Privacy Policy</Link>, and authorize a recurring subscription of $20/month starting in 3 days.
                    </label>
                  </div>
                  {errors.terms && <p className="text-destructive text-xs">{errors.terms}</p>}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Col: Order Summary */}
          <div>
            <Card className="sticky top-24 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Plan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product && (
                  <div className="flex items-start gap-4 pb-4 border-b border-border">
                    <img src={product.imageUrl} alt={product.name} className="w-20 h-14 object-cover rounded" />
                    <div>
                      <h3 className="font-bold text-sm leading-tight">{product.name}</h3>
                      <p className="text-xs text-orange-600 font-semibold mt-1">3 Days Free Trial Included</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Initial Trial (3 Days)</span>
                    <span className="font-bold text-orange-600">FREE ($0)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recurring Billing (from Day 4)</span>
                    <span className="font-bold">$20 / month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Stripe Secure</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-center text-lg font-extrabold">
                  <span>Due Today</span>
                  <span className="text-orange-600">$0</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button 
                  type="submit" 
                  form="checkout-form" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full text-lg h-14 shadow-lg shadow-primary/25 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Redirecting to Stripe...' : 'Start 3-Day Free Trial ($0)'} <Lock size={16} className="ml-2" />
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
                  <ShieldCheck size={14} className="text-orange-500 shrink-0" />
                  Stripe Secure Checkout • Card authorization only (Free Trial)
                </div>
              </CardFooter>
            </Card>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={16} className="text-orange-500 shrink-0" />
                <span><strong>3 days full unrestricted access</strong> to course materials.</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-orange-500 shrink-0" />
                <span>First $20 charge automatically applies in 72 hours.</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={16} className="text-orange-500 shrink-0" />
                <span>Cancel anytime effortlessly before trial expires.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}