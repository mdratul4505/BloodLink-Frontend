"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Droplet, AlertCircle, Phone, Hospital, Send, ArrowRight } from "lucide-react";
import { bloodRequestService } from "@/services";
import { BloodGroup } from "@/types";
import { toast } from "@/components/ui/toast";
import { useLanguage } from "@/providers/language.provider";
import { motion, AnimatePresence } from "motion/react";

const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
];

export default function EmergencyFloatingButton() {
  const router = useRouter();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [bloodGroup, setBloodGroup] = useState<string>("O_POSITIVE");
  const [patientName, setPatientName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [district, setDistrict] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodGroup || !hospitalName || !district || !contactPhone) {
      toast.add({
        title: language === "bn" ? "তথ্য অসম্পূর্ণ" : "Incomplete Information",
        description: language === "bn" ? "অনুগ্রহ করে সকল আবশ্যক তথ্য দিন।" : "Please fill in all mandatory fields.",
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await bloodRequestService.createRequest({
        bloodGroup: bloodGroup as BloodGroup,
        units: 1,
        patientName: patientName || "Emergency Patient",
        hospitalName,
        district,
        contactPhone,
        urgency: "CRITICAL",
        neededBy: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
        note: "Submitted via Emergency Quick Request floating launcher.",
      });

      toast.add({
        title: language === "bn" ? "জরুরি অনুরোধ তৈরি হয়েছে!" : "Emergency Request Broadcasted!",
        description: language === "bn" ? "নিকটবর্তী রক্তদাতাদের সাথে যোগাযোগ করা হচ্ছে।" : "Notifying nearest compatible donors immediately.",
        type: "success",
      });

      setOpen(false);
      setPatientName("");
      setHospitalName("");
      setDistrict("");
      setContactPhone("");

      if (res.data?.id) {
        router.push(`/blood-requests/${res.data.id}`);
      }
    } catch (err: any) {
      toast.add({
        title: "Submission Failed",
        description: err?.message || "Failed to broadcast emergency request",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating SOS Trigger Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 flex items-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3.5 text-white shadow-xl shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-red-500/40 focus:outline-none focus:ring-4 focus:ring-red-500/30"
          aria-label="Emergency SOS Blood Request"
        >
          {/* Pulsing ring indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-white text-[9px] font-bold text-red-600 items-center justify-center">
              !
            </span>
          </span>

          <Droplet className="h-5 w-5 fill-white animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
            {language === "bn" ? "জরুরি রক্ত চাই" : "Emergency SOS"}
          </span>
        </button>
      </motion.div>

      {/* Emergency Quick Request Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <DialogTitle className="text-xl">
                {language === "bn" ? "জরুরি রক্তের তাৎক্ষণিক অনুরোধ" : "Instant Emergency Blood Request"}
              </DialogTitle>
            </div>
            <DialogDescription>
              {language === "bn"
                ? "জরুরি অবস্থায় দ্রুত অনুরোধ পাঠান। রক্তদাতাদের তাৎক্ষণিক নোটিফিকেশন পৌঁছে দেওয়া হবে।"
                : "Broadcast an urgent SOS request. Compatible donors nearby will receive immediate alert."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleQuickSubmit} className="space-y-3.5 py-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                {language === "bn" ? "রক্তের গ্রুপ *" : "Blood Group *"}
              </label>
              <Select value={bloodGroup} onValueChange={(val) => val && setBloodGroup(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                {language === "bn" ? "রোগীর নাম" : "Patient Name"}
              </label>
              <Input
                placeholder={language === "bn" ? "রোগীর নাম (ঐচ্ছিক)" : "e.g., Rahim Ahmed"}
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  {language === "bn" ? "হাসপাতালের নাম *" : "Hospital Name *"}
                </label>
                <Input
                  placeholder="e.g., Dhaka Medical"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  {language === "bn" ? "জেলা *" : "District *"}
                </label>
                <Input
                  placeholder="e.g., Dhaka"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                {language === "bn" ? "জরুরি যোগাযোগ নম্বর *" : "Contact Phone *"}
              </label>
              <Input
                placeholder="e.g., 01712345678"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-destructive hover:bg-destructive/90 text-white font-semibold py-2.5"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === "bn" ? "পাঠানো হচ্ছে..." : "Broadcasting SOS..."}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    <span>{language === "bn" ? "জরুরি অনুরোধ পাঠান" : "Broadcast SOS Request"}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>

          <DialogFooter className="pt-2 border-t border-border flex sm:justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/blood-requests/create");
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>{language === "bn" ? "সম্পূর্ণ ফর্ম খুলুন" : "Open Full Request Form"}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
