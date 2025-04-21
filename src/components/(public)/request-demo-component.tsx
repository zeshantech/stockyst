"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  IconCalendar,
  IconClock,
  IconSend,
  IconCheck,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconHeadset,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RequestDemoComponentProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

// Demo time slots
const timeSlots = [
  { id: "9am", label: "9:00 AM", available: true },
  { id: "10am", label: "10:00 AM", available: true },
  { id: "11am", label: "11:00 AM", available: true },
  { id: "1pm", label: "1:00 PM", available: true },
  { id: "2pm", label: "2:00 PM", available: true },
  { id: "3pm", label: "3:00 PM", available: true },
  { id: "4pm", label: "4:00 PM", available: true },
];

// Generate the next 14 days for scheduling
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Skip weekends
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }
  }

  return dates;
};

export function RequestDemoComponent({
  title = "Schedule Your Personalized Demo",
  subtitle = "See how Stockyst can transform your inventory management with a personalized walkthrough.",
  className = "",
}: RequestDemoComponentProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    teamSize: "",
    message: "",
    demoDate: "",
    demoTime: "",
    demoType: "video",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const availableDates = React.useMemo(() => generateAvailableDates(), []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep(2);
  };

  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.demoDate || !formData.demoTime) {
      toast.error("Please select a date and time for your demo");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(
        "Demo scheduled successfully! We'll be in touch soon to confirm."
      );
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        teamSize: "",
        message: "",
        demoDate: "",
        demoTime: "",
        demoType: "video",
      });
      setStep(1);
    } catch (error) {
      toast.error("Failed to schedule demo. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground">{subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Form Section - 3 columns */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <Card className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step >= 1
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step > 1 ? <IconCheck className="size-4" /> : "1"}
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step >= 2
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        2
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Step {step} of 2
                    </div>
                  </div>
                  <CardTitle>
                    {step === 1 ? "Your Information" : "Schedule Your Demo"}
                  </CardTitle>
                  <CardDescription>
                    {step === 1
                      ? "Tell us about yourself and your business needs"
                      : "Select a date and time that works for you"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {step === 1 ? (
                    <form onSubmit={handleSubmitStep1} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">
                          Company Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          placeholder="Your Company"
                          value={formData.company}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="+1 (123) 456-7890"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="teamSize">Team Size</Label>
                          <Select
                            value={formData.teamSize}
                            onValueChange={(value) =>
                              handleSelectChange("teamSize", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select team size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-5">1-5 employees</SelectItem>
                              <SelectItem value="6-20">
                                6-20 employees
                              </SelectItem>
                              <SelectItem value="21-50">
                                21-50 employees
                              </SelectItem>
                              <SelectItem value="51-200">
                                51-200 employees
                              </SelectItem>
                              <SelectItem value="201+">
                                201+ employees
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">
                          What are you looking to achieve with Stockyst?
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us about your inventory management goals and challenges..."
                          rows={3}
                          value={formData.message}
                          onChange={handleChange}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Continue to Scheduling
                        <IconCalendar className="ml-2 size-4" />
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmitStep2} className="space-y-6">
                      <div className="space-y-4">
                        <Label>
                          Select a Date <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Select
                            value={formData.demoDate}
                            onValueChange={(value) =>
                              handleSelectChange("demoDate", value)
                            }
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select date" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableDates.map((date) => (
                                <SelectItem key={date.value} value={date.value}>
                                  {date.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>
                          Select a Time (EST){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {timeSlots.map((slot) => (
                            <Button
                              key={slot.id}
                              type="button"
                              variant={
                                formData.demoTime === slot.id
                                  ? "default"
                                  : "outline"
                              }
                              className={`h-auto py-2 justify-start ${
                                !slot.available
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={!slot.available}
                              onClick={() =>
                                handleSelectChange("demoTime", slot.id)
                              }
                            >
                              <IconClock className="mr-2 size-4" />
                              {slot.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Demo Type</Label>
                        <RadioGroup
                          value={formData.demoType}
                          onValueChange={(value) =>
                            handleSelectChange("demoType", value)
                          }
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="video" id="video" />
                              <Label
                                htmlFor="video"
                                className="flex items-center cursor-pointer"
                              >
                                <IconDeviceDesktop className="mr-2 size-4" />
                                Video Call
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="phone" id="phone" />
                              <Label
                                htmlFor="phone"
                                className="flex items-center cursor-pointer"
                              >
                                <IconHeadset className="mr-2 size-4" />
                                Phone Call
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="mobile" id="mobile" />
                              <Label
                                htmlFor="mobile"
                                className="flex items-center cursor-pointer"
                              >
                                <IconDeviceMobile className="mr-2 size-4" />
                                Mobile Demo
                              </Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 size-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Scheduling...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Schedule Demo
                              <IconSend className="ml-2 size-4" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Information Section - 2 columns */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-y-1">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0 mt-1">
                      <IconCheck className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Personalized Walkthrough</p>
                      <p className="text-sm text-muted-foreground">
                        A guided tour of Stockyst tailored to your specific
                        needs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-y-1">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0 mt-1">
                      <IconCheck className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Q&A Session</p>
                      <p className="text-sm text-muted-foreground">
                        Time to ask questions and discuss your specific
                        requirements
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-y-1">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0 mt-1">
                      <IconCheck className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Implementation Discussion</p>
                      <p className="text-sm text-muted-foreground">
                        Learn about deployment options and migration strategies
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-y-1">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0 mt-1">
                      <IconCheck className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Pricing Overview</p>
                      <p className="text-sm text-muted-foreground">
                        Get transparent information about pricing options
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demo Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our demos typically last 30-45 minutes, leaving plenty of
                    time for your questions. We can adjust based on your
                    schedule and needs.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle>Need Immediate Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    If you have urgent questions or need assistance, you can
                    reach us directly:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <IconDeviceDesktop className="size-4 mr-2 text-primary" />
                      <span>support@stockyst.com</span>
                    </div>
                    <div className="flex items-center">
                      <IconHeadset className="size-4 mr-2 text-primary" />
                      <span>+1 (123) 456-7890</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
