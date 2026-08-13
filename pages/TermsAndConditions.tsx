import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Terms and Conditions</h1>
        <p className="text-muted-foreground mb-10">Last updated: July 8, 2026</p>

        <div className="prose max-w-none text-foreground space-y-8">

          <section>
            <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Avada Design ("Company", "we", "our", "us"). These Terms and Conditions govern your use of our website located at <strong>avada.in</strong> (the "Site") and all digital products, courses, downloadable resources, and services offered by us (collectively, the "Services"). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 18 years of age to purchase our products. By placing an order, you represent and warrant that you are at least 18 years old and that all information you provide is accurate, complete, and current.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. Products & Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Avada Design offers digital educational courses, downloadable resources (textures, 3D models), and community access related to architecture, interior design, and 3D visualization software. All products are delivered digitally. No physical goods are shipped.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. Pricing & Payment</h2>
            <p className="text-muted-foreground leading-relaxed">
              All prices displayed on the Site are in US Dollars ($) and are <strong>inclusive of all applicable taxes</strong>. The price you see is the final price you pay — there are no hidden charges. Payments are processed securely through Stripe. We accept all major credit cards, debit cards, and Apple/Google Pay.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All course content, videos, images, textures, 3D models, and other materials provided are the intellectual property of Avada Design. You are granted a personal, non-transferable, non-exclusive license to access and use the materials for your own educational and professional purposes. You may not redistribute, resell, or share access to any purchased materials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to: (a) share your login credentials with others; (b) redistribute or resell any course materials; (c) use automated systems to scrape or download content; (d) use the Services for any unlawful purpose; (e) attempt to gain unauthorized access to any part of the Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Refund Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We offer a <strong>7-day no-questions-asked refund policy</strong>. If you are not satisfied with your purchase for any reason, you can request a full refund within 7 days of the date of purchase. Please see our <Link to="/refund-policy" className="text-primary hover:underline font-semibold">Cancellation and Refund Policy</Link> for full details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by applicable law, Avada Design shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">9. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Noida, Uttar Pradesh, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">10. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <ul className="list-none space-y-1 text-muted-foreground mt-3">
              <li><strong>Email:</strong> support@avada.in</li>
              <li><strong>Address:</strong> E-36, Coregano, Sector 8, Noida - 201301</li>
              <li><strong>WhatsApp:</strong> +91 8545015333</li>
              <li><strong>Page:</strong> <Link to="/contact" className="text-primary hover:underline">Contact Us</Link></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
