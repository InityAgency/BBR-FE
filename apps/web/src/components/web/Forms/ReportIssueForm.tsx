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
import * as z from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  link: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  termsAccepted: z.boolean().refine(val => val, { message: "You must accept the terms" }),
  files: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ReportIssueForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
  });

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
    form.setValue("files", files);
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      let attachmentId = undefined;
      if (uploadedFiles && uploadedFiles.length > 0) {
        const formData = new FormData();
        uploadedFiles.forEach((file) => {
          formData.append("media", file);
        });
        const uploadRes = await fetch(`/api/v1/media?type=CONTACT_FORM`, {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("File upload failed");
        const uploadData = await uploadRes.json();
        attachmentId = Array.isArray(uploadData) ? uploadData[0] : uploadData.attachmentId;
      }
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        link: data.link,
        type: "REPORT_ISSUE",
        description: data.description,
        attachmentId: attachmentId,
      };
      const res = await fetch(`/api/v1/public/contact-forms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send issue report");
      toast.success("Issue reported successfully");
      form.reset();
      setUploadedFiles([]);
    } catch (error) {
      toast.error("Failed to report issue");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 h-full items-center justify-center border rounded-lg custom-card contact-form mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
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
                <FormLabel>Email address</FormLabel>
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
                <FormLabel>Error page link</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Error page link" />
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
                <FormLabel>Error description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Describe the error you encountered in detail." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FileUpload
              label="Upload files"
              description="PDF, DOC, DOCX, JPG, JPEG, PNG, MP4, AVI, MOV formats are supported."
              supportedFormats={["PDF", "DOC", "DOCX", "JPG", "JPEG", "PNG", "MP4", "AVI", "MOV"]}
              maxSize={10}
              onChange={(file) => handleFilesChange(file ? [file] : [])}
              value={uploadedFiles[0] || null}
              className="w-full"
              required={false}
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
                  <FormLabel className="text-sm font-medium leading-none">
                    I agree to the BBR Terms of Service, Privacy Policy
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