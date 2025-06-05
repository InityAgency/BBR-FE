import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import FileUpload from "./FileUpload";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { PhoneCodeSelect } from "./PhoneCodeSelect";
import { toast } from "sonner";

// Ažurirana šema forme za usklađivanje sa API zahtevima
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phoneCodeId: z.string().min(1, "Phone code is required"),
  phoneNumber: z.string().min(3, "Phone number is required"),
  websiteUrl: z.string().url("Invalid website URL"),
  file: z.any().refine((file) => file instanceof File, { message: "Please upload a file." }),
  termsAccepted: z.boolean().refine(val => val, { message: "You must accept the terms" }),
  luxuryInsights: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ClaimRequestFormProps {
  onSuccess?: () => void;
  residenceId: string;
}

export default function ClaimRequestForm({ onSuccess, residenceId }: ClaimRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      phoneCodeId: "",
      phoneNumber: "",
      websiteUrl: "",
      file: undefined,
      termsAccepted: false,
      luxuryInsights: true,
    },
  });

  // Funkcija za slanje fajla na medija endpoint koristeći XMLHttpRequest za praćenje progresa
  const uploadFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      
      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media?type=CLAIM_PROFILE_CONTACT_FORM`, true);
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      });
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            // Pristupamo id-u iz ugneždenog data objekta prema stvarnoj strukturi odgovora
            if (response.data && response.data.id) {
              resolve(response.data.id);
            } else {
              reject(new Error('Invalid server response format'));
            }
          } catch (error) {
            reject(new Error('Failed to parse server response'));
          }
        } else {
          reject(new Error('File upload failed'));
        }
      };
      
      xhr.onerror = () => {
        reject(new Error('Network error during file upload'));
      };
      
      xhr.send(formData);
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Prvo pošaljemo fajl i dobijemo ID
      const cvId = await uploadFile(data.file);
      
      // Priprema podataka za glavni API zahtev
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        phoneCodeId: data.phoneCodeId,
        websiteUrl: data.websiteUrl,
        cvId: cvId,
        residenceId: residenceId
      };
      
      // Slanje podataka na glavni endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/claim-profile-contact-forms`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit claim request');
      }
      
      toast.success("Your claim request has been submitted!");
      if (onSuccess) onSuccess();
      form.reset();
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4 claim-request-form">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full claim-request-form">
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
          <div className="flex flex-col lg:flex-row gap-4">
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
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <FormField
              control={form.control}
              name="phoneCodeId"
              render={({ field }) => (
                <FormItem className="w-full lg:w-1/3 phone-code">
                  <FormLabel>Country Code</FormLabel>
                  <FormControl>
                    <PhoneCodeSelect
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select country code"
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
                <FormItem className="w-full lg:w-full">
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
            name="websiteUrl"
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
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
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
                  <FormLabel className="text-sm font-medium leading-none leading-[1.35]">
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
            {isSubmitting ? `${uploadProgress > 0 && uploadProgress < 100 ? `Uploading ${uploadProgress}%` : "Submitting..."}` : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}