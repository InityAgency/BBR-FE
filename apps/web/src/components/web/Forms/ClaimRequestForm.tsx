import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import FileUpload from "./FileUpload";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(3, "Phone number is required"),
  website: z.string().url("Invalid website URL"),
  file: z.any().refine((file) => file instanceof File, { message: "Please upload a file." }),
  termsAccepted: z.boolean().refine(val => val, { message: "You must accept the terms" }),
  luxuryInsights: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ClaimRequestFormProps {
  onSuccess?: () => void;
}

export default function ClaimRequestForm({ onSuccess }: ClaimRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      companyName: "",
      email: "",
      phone: "",
      website: "",
      file: undefined,
      termsAccepted: false,
      luxuryInsights: true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Your claim request has been submitted!");
      if (onSuccess) onSuccess();
      form.reset();
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4 mt-4 claim-request-form">
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
              name="companyName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter company name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Corporate Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter your email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your phone number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Website</FormLabel>
                <FormControl>
                  <Input {...field} type="url" placeholder="https://www.company.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload supporting documents to verify ownership</FormLabel>
                <FormControl>
                  <FileUpload
                    label="Upload your file"
                    description="PDF, DOC, DOCX, JPG, JPEG, PNG formats are supported."
                    supportedFormats={["PDF", "DOC", "DOCX", "JPG", "JPEG", "PNG"]}
                    maxSize={10}
                    onChange={field.onChange}
                    value={field.value}
                    className="w-full"
                    required={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="luxuryInsights"
            render={({ field }) => (
              <FormItem className="flex items-start gap-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium leading-none">
                    I want to receive the luxury insights
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
          <div className="mt-4 text-center">
            {/* <button
              type="button"
              className="text-primary underline text-sm hover:text-primary/80"
              onClick={() => alert('If your email matches the company domain, please try again.')}
            >
              My email matches company domain
            </button> */}
          </div>
        </form>
      </Form>
    </div>
  );
} 