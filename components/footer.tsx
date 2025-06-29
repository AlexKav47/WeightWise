"use client"

import type React from "react"

import { Activity, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function Footer() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const [showTermsOfService, setShowTermsOfService] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showMedicalDisclaimer, setShowMedicalDisclaimer] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({ name: "", email: "", message: "" })
  const { toast } = useToast()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate feedback submission
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! We'll review it and get back to you soon.",
    })
    setFeedbackForm({ name: "", email: "", message: "" })
    setShowFeedback(false)
  }

  return (
    <>
      <footer className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">WeightWise</span>
              </div>
              <p className="text-sm text-slate-400">Your AI-powered companion for the GLP-1 journey.</p>

              {/* Social Media Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-purple-400 p-2">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400 p-2">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-pink-400 p-2">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400 p-2">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-sm hover:text-white transition-colors text-left"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="text-sm hover:text-white transition-colors text-left"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="text-sm hover:text-white transition-colors text-left"
                  >
                    How it Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className="text-sm hover:text-white transition-colors text-left"
                  >
                    Success Stories
                  </button>
                </li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="text-sm hover:text-white transition-colors text-left"
                  >
                    Provide Feedback
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowMedicalDisclaimer(true)}
                    className="text-sm hover:text-white transition-colors text-left"
                  >
                    Medical Disclaimer
                  </button>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setShowAbout(true)}
                    className="text-sm hover:text-white transition-colors text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowPrivacyPolicy(true)}
                    className="text-sm hover:text-white transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowTermsOfService(true)}
                    className="text-sm hover:text-white transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-sm text-slate-400">© 2024 WeightWise. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              <strong>Last updated:</strong> December 2024
            </p>
            <h3 className="font-semibold">Information We Collect</h3>
            <p>
              WeightWise collects information you provide directly, such as your weight, medication data, and health
              metrics to provide personalized tracking and recommendations.
            </p>
            <h3 className="font-semibold">How We Use Your Information</h3>
            <p>
              We use your information to provide our services, improve user experience, and deliver personalized health
              insights. We never sell your personal health data.
            </p>
            <h3 className="font-semibold">Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your personal information and health data.
            </p>
            <h3 className="font-semibold">Contact Us</h3>
            <p>If you have questions about this Privacy Policy, please contact us through our feedback form.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog open={showTermsOfService} onOpenChange={setShowTermsOfService}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              <strong>Last updated:</strong> December 2024
            </p>
            <h3 className="font-semibold">Acceptance of Terms</h3>
            <p>By using WeightWise, you agree to these Terms of Service and our Privacy Policy.</p>
            <h3 className="font-semibold">Description of Service</h3>
            <p>
              WeightWise is a health tracking application designed to help users monitor their GLP-1 medication journey
              and weight loss progress.
            </p>
            <h3 className="font-semibold">User Responsibilities</h3>
            <p>
              You are responsible for maintaining the accuracy of your health data and using the service in accordance
              with medical advice from your healthcare provider.
            </p>
            <h3 className="font-semibold">Medical Disclaimer</h3>
            <p>
              WeightWise is not a substitute for professional medical advice. Always consult your healthcare provider
              for medical decisions.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* About Modal */}
      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>About WeightWise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              WeightWise is your AI-powered companion designed specifically for individuals on their GLP-1 medication
              journey.
            </p>
            <p>
              Our mission is to provide comprehensive tracking, personalized insights, and supportive community features
              to help you achieve your weight loss goals safely and effectively.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Weight and injection tracking</li>
                <li>Side effects monitoring</li>
                <li>AI-powered meal planning</li>
                <li>Personalized workout recommendations</li>
                <li>Progress gamification and achievements</li>
                <li>Community support and discussions</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              WeightWise is committed to helping you succeed on your health journey with the support of technology and
              community.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Medical Disclaimer Modal */}
      <Dialog open={showMedicalDisclaimer} onOpenChange={setShowMedicalDisclaimer}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Medical Disclaimer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="font-semibold text-yellow-800">Important Medical Information</p>
            </div>
            <p>
              WeightWise is a health tracking application and is not intended to replace professional medical advice,
              diagnosis, or treatment.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Please Note:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Always consult your healthcare provider before making changes to your medication or treatment plan
                </li>
                <li>This app does not provide medical advice or diagnose medical conditions</li>
                <li>Side effects tracking is for informational purposes only</li>
                <li>Seek immediate medical attention for serious side effects or emergencies</li>
                <li>Your healthcare provider should be your primary source for medical guidance</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              By using WeightWise, you acknowledge that you understand this disclaimer and will use the app as a
              supplementary tool alongside professional medical care.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <Label htmlFor="feedback-name">Name</Label>
              <Input
                id="feedback-name"
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <Label htmlFor="feedback-email">Email</Label>
              <Input
                id="feedback-email"
                type="email"
                value={feedbackForm.email}
                onChange={(e) => setFeedbackForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="feedback-message">Message</Label>
              <Textarea
                id="feedback-message"
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Tell us about your experience, suggestions, or report any issues..."
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowFeedback(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Feedback</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}


