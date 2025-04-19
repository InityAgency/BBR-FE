import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import FileUpload from "../Forms/FileUpload";

// Validaciona šema za formu
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(5, {
    message: "Please enter a valid phone number.",
  }),
  linkedin: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }).optional(),
  message: z.string().min(10, {
    message: "Cover letter must be at least 10 characters.",
  }),
  resume: z.any()
    .refine((file) => file instanceof File, {
      message: "Please upload your resume.",
    })
    .refine((file) => file instanceof File && file.size <= 5 * 1024 * 1024, {
      message: "File must be less than 5MB.",
    })
    .refine(
      (file) => 
        file instanceof File && 
        (file.type === "application/pdf" || 
         file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
      {
        message: "File must be PDF or DOCX format.",
      }
    ),
});

// Definišemo tipove za props
interface CareerApplicationFormProps {
  position: string;
  pageUrl: string;
}

// Definišemo tipove za podatke forme
type FormValues = z.infer<typeof formSchema>;

export function CareerApplicationForm({ position, pageUrl }: CareerApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Inicijalizacija forme
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      message: "",
      resume: undefined,
    },
  });

  // Handler za slanje forme
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Korak 1: Upload CV-a
      const formData = new FormData();
      formData.append('file', data.resume);
      
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media?type=CAREER_CONTACT_FORM`, {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload resume');
      }
      
      const uploadResult = await uploadResponse.json();
      const cvId = uploadResult.id;
      
      // Korak 2: Slanje podataka forme
      const formSubmitResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/career-contact-forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          linkedin: data.linkedin || null,
          message: data.message,
          cvId: cvId,
          position: position,
          websiteURL: pageUrl
        }),
      });
      
      if (!formSubmitResponse.ok) {
        throw new Error('Failed to submit application');
      }
      
      // Uspešno podnošenje prijave
      toast.success("Application Submitted", {
        description: "Your application has been successfully submitted. We will contact you soon."
      });
      
      // Reset forme
      form.reset();
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error("Submission Failed", {
        description: "There was an error submitting your application. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary rounded-lg p-6 border w-full xl:w-[60svw] flex gap-8 contact-form" id="apply">
      <h2 className="text-4xl font-bold text-white mb-8 w-full lg:w-[50%]">Submit your application</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="flex flex-col lg:flex-row gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
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
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your message to BBR team</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us why you're interested in this position" 
                    className="min-h-[120px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="resume"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Upload Resume</FormLabel>
                <FormControl>
                  <FileUpload
                    value={value}
                    onChange={onChange}
                    required={true}
                    maxSize={5}
                    supportedFormats={["PDF", "DOCX"]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}