"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  contactService,
  formSchema,
  type FormValues,
} from "@/app/api/contact/requestConsultation";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RequestConsultationFormProps {
  className?: string;
  showTitle?: boolean;
  customTitle?: string;
  entityId?: string;
  type?: "CONSULTATION" | "MORE_INFORMATION" | "CONTACT_US";
  buttonText?: string;
  onSuccess?: () => void;
}

export default function RequestConsultationForm({
  className = "",
  showTitle = true,
  customTitle = "Contact our expert",
  entityId,
  type = "CONSULTATION",
  buttonText = "Send Message",
  onSuccess
}: RequestConsultationFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      message: "",
      termsAccepted: false,
      type: type,
      entityId: entityId,
      preferredContactMethod: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      await contactService.sendMessage(data);
      toast.success("Message sent successfully");
      form.reset(); // Reset form after successful submission
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-4 p-4 lg:p-8 h-full flex-col items-center justify-center gap-12 border rounded-lg custom-card contact-form ${className}`}>
      {showTitle && (
        <h2 className="text-2xl font-bold w-full">{customTitle}</h2>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your first name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your last name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter your message" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            <FormLabel>How can we reach you?</FormLabel>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="preferredContactMethod"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <div className="flex flex-col lg:flex-row gap-2">
                      {[
                        { value: "EMAIL", label: "Email" },
                        { value: "PHONE", label: "Phone" },
                        { value: "WHATSAPP", label: "WhatsApp" },
                      ].map((method) => (
                        <div
                          key={method.value}
                          className={`flex items-center space-x-3 rounded-md border px-3 py-3 cursor-pointer transition-colors w-full ${(field.value || []).includes(
                            method.value as "EMAIL" | "PHONE" | "WHATSAPP"
                          )
                              ? "border-primary bg-primary/10"
                              : "border-muted"
                            }`}
                          onClick={() => {
                            const currentValue = field.value || [];
                            const newValue = currentValue.includes(
                              method.value as "EMAIL" | "PHONE" | "WHATSAPP"
                            )
                              ? currentValue.filter((v) => v !== method.value)
                              : [...currentValue, method.value];
                            field.onChange(newValue);
                          }}
                        >
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              {method.value === "EMAIL" && (
                                <Mail color="#6B7280" className="w-5 h-5" />
                              )}
                              {method.value === "PHONE" && (
                                <Phone color="#6B7280" className="w-5 h-5" />
                              )}
                              {method.value === "WHATSAPP" && (
                                <Image
                                  src="/whatsapp.svg"
                                  alt="WhatsApp"
                                  width={20}
                                  height={20}
                                />
                              )}
                              {method.label}
                            </FormLabel>
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex items-start gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium leading-none text-left leading-[1.35]">
                  I agree to the <Link href="/terms-of-service" target="_blank" className="hover:underline hover:text-primary transition-all">BBR Terms of Service</Link> and <Link href="/gdpr-compliance" target="_blank" className="hover:underline hover:text-primary transition-all">Privacy Policy</Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending..." : buttonText}
          </Button>
        </form>
      </Form>
    </div>
  );
}
