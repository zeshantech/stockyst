"use client";

import { FormEventHandler, useState } from "react";
import { Pen, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";

export function ComposeEmailDialog() {
  const { open } = useSidebar();
  const [loading, setLoading] = useState(false);

  // Form state
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("normal");

  // Handle email submission
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending email
    try {
      // In a real application, you would send the email data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear form and close dialog
      resetForm();
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to send email:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setTo("");
    setCc("");
    setBcc("");
    setSubject("");
    setMessage("");
    setPriority("normal");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"lg"}
          className={cn(open && "w-full h-16 text-2xl font-semibold")}
        >
          {open ? "Compose" : null}{" "}
          <Pen className={cn(open && "size-6 ml-2")} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Compose New Message</DialogTitle>
            <DialogDescription>
              Create and send an email message to recipients.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="to" className="text-sm">
                To:
              </Label>
              <Input
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cc" className="text-sm">
                  CC:
                </Label>
                <Input
                  id="cc"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="cc@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bcc" className="text-sm">
                  BCC:
                </Label>
                <Input
                  id="bcc"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="bcc@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div className="grid gap-2 col-span-4">
                <Label htmlFor="subject" className="text-sm">
                  Subject:
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject line"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority" className="text-sm">
                  Priority:
                </Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Normal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message" className="text-sm">
                Message:
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="min-h-[200px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="size-4 mr-2 animate-spin rounded-full border-2 border-t-transparent" />
                  Sending...
                </div>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
