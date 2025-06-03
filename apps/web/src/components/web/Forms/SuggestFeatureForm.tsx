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

export default function SuggestFeatureForm() {
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
        // Prilagođavanje imena polja za zahtev prema API-ju
        formData.append("file", uploadedFiles[0]);
        
        // Korišćenje environment varijabli za API putanje
        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media?type=CONTACT_FORM`, 
          {
            method: "POST",
            body: formData,
          }
        );
        
        if (!uploadRes.ok) throw new Error("File upload failed");
        
        const uploadData = await uploadRes.json();
        
        // Pristupanje ID-u iz odgovora servera prema strukturi koju smo dobili
        if (uploadData.data && uploadData.data.id) {
          attachmentId = uploadData.data.id;
        } else {
          console.warn("Unexpected response format from media API:", uploadData);
          // Pokušaj sa starim formatom za kompatibilnost
          attachmentId = Array.isArray(uploadData) ? uploadData[0] : uploadData.attachmentId;
        }
      }
      
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        link: data.link,
        type: "SUGGEST_FEATURE",
        description: data.description,
        attachmentId: attachmentId,
      };
      
      // Korišćenje environment varijabli za glavni API poziv
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/contact-forms`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      
      if (!res.ok) throw new Error("Failed to send suggestion");
      
      toast.success("Feature suggestion sent successfully");
      form.reset();
      setUploadedFiles([]);
    } catch (error) {
      toast.error("Failed to send suggestion");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 h-full items-center justify-center border rounded-lg custom-card contact-form mt-4 w-full lg:max-w-2xl lg:m-auto">
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
                <FormLabel>Feature page link</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Feature page link" />
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
                <FormLabel>Feature description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Advanced sorting option is important for easy navigation." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FileUpload
              label="Upload files"
              description="PDF, DOC, DOCX, JPG, JPEG, PNG formats are supported."
              supportedFormats={["PDF", "DOC", "DOCX", "JPG", "JPEG", "PNG"]}
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
                  <FormLabel className="text-sm font-medium leading-none leading-[1.35]">
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