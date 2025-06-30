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
import FileUpload from "@/components/web/Forms/FileUpload";
import { AlertCircle } from "lucide-react";
import * as z from "zod";
import Link from "next/link";

const formSchema = z.object({
  firstName: z.string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z.string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  link: z.string()
    .min(1, "Feature page link is required")
    .url("Please enter a valid URL (including http:// or https://)"),
  description: z.string()
    .min(1, "Feature description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  termsAccepted: z.boolean()
    .refine(val => val === true, { 
      message: "You must accept the terms to continue" 
    }),
  files: z.any()
    .refine(val => val && val.length > 0, { 
      message: "File attachment is required" 
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SuggestFeatureForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      link: "",
      description: "",
      termsAccepted: false,
      files: [],
    },
    mode: "onChange",
  });

  const handleFilesChange = (file: File | null) => {
    const files = file ? [file] : [];
    setUploadedFiles(files);
    form.setValue("files", files, { shouldValidate: true });
    if (submitError) setSubmitError(null);
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      if (!uploadedFiles || uploadedFiles.length === 0) {
        setSubmitError("File attachment is required");
        return;
      }

      let attachmentId = undefined;
      const formData = new FormData();
      formData.append("file", uploadedFiles[0]);

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media?type=CONTACT_FORM`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        const uploadError = await uploadRes.json().catch(() => ({ message: "File upload failed" }));
        throw new Error(uploadError.message || "File upload failed");
      }

      const uploadData = await uploadRes.json();

      if (uploadData.data && uploadData.data.id) {
        attachmentId = uploadData.data.id;
      } else {
        console.warn("Unexpected response format from media API:", uploadData);
        attachmentId = Array.isArray(uploadData) ? uploadData[0] : uploadData.attachmentId;
      }

      if (!attachmentId) {
        throw new Error("Failed to get attachment ID from server");
      }

      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        link: data.link.trim(),
        type: "SUGGEST_FEATURE",
        description: data.description.trim(),
        attachmentId: attachmentId,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/contact-forms`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ 
          message: `Server error (${res.status}). Please try again later.` 
        }));
        throw new Error(errorData.message || "Failed to send suggestion");
      }

      toast.success("Feature suggestion sent successfully");
      form.reset();
      setUploadedFiles([]);
      setSubmitError(null);
      setFormKey(prev => prev + 1);

    } catch (error: any) {
      console.error("Form submission error:", error);
      const errorMessage = error?.message || "An unexpected error occurred. Please try again.";
      setSubmitError(errorMessage);
      toast.error("Failed to send suggestion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 h-full items-center justify-center border rounded-lg custom-card contact-form mt-4 w-full lg:max-w-2xl lg:m-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          
          {/* Submit Error Display */}
          {submitError && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-destructive font-medium">Submission Failed</p>
                <p className="text-xs text-destructive/80 mt-1">{submitError}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>First Name *</FormLabel>
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
                  <FormLabel>Last Name *</FormLabel>
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
                <FormLabel>Email address *</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter your email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feature page link *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/feature-page" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feature description *</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Advanced sorting option is important for easy navigation." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload files *</FormLabel>
                  <FormControl>
                    <FileUpload
                      key={formKey}
                      supportedFormats={["PDF", "DOC", "DOCX", "JPG", "JPEG", "PNG"]}
                      maxSize={1}
                      onChange={handleFilesChange}
                      value={uploadedFiles[0] || null}
                      className="w-full"
                      required={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex items-start gap-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium leading-none leading-[1.35]">
                    I agree to the <Link href="/terms-of-service" target="_blank" className="hover:underline hover:text-primary transition-all">BBR Terms of Service</Link> and <Link href="/gdpr-compliance" target="_blank" className="hover:underline hover:text-primary transition-all">Privacy Policy</Link> *
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}