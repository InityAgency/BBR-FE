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
import { useState, useEffect } from "react";
import { z } from "zod";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { usePathname } from "next/navigation";

// Schema za form validaciju
const clientCommonInfoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Please enter a valid email address"),
  pageOrigin: z.string(), // Automatski se popunjava
  companyName: z.string().min(1, "Company name is required"),
  brandedResidencesName: z.string().min(1, "Name of branded residence is required"),
  companyWebsite: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
});

type ClientCommonInfoFormValues = z.infer<typeof clientCommonInfoFormSchema>;

// Funkcija za mapiranje error poruka
const getErrorMessage = (status: number, defaultMessage: string): string => {
  switch (status) {
    case 400:
      return "Please check your information and try again.";
    case 401:
      return "You are not authorized to perform this action.";
    case 403:
      return "Access denied. Please contact support.";
    case 404:
      return "We're unable to process your form at the moment. Please try again later.";
    case 422:
      return "Please check all required fields and try again.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
      return "We're unable to process your form at the moment. Please try again later.";
    case 502:
    case 503:
    case 504:
      return "We're unable to process your form at the moment. Please try again later.";
    default:
      return "We're unable to process your form at the moment. Please try again later.";
  }
};

// Funkcija za parsiranje server error response-a
const parseErrorResponse = async (response: Response): Promise<string> => {
  // Za 404 i 500+ greške, uvek koristi našu custom poruku
  if (response.status === 404 || response.status >= 500) {
    return getErrorMessage(response.status, "We're unable to process your form at the moment. Please try again later.");
  }
  
  try {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      
      // Pokušaj da pronađe poruku u različitim formatima - samo za client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        if (errorData.message) {
          return errorData.message;
        } else if (errorData.error) {
          return typeof errorData.error === 'string' ? errorData.error : errorData.error.message;
        } else if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          // Za validation errors
          return errorData.errors.map((err: any) => err.message || err).join(', ');
        }
      }
    }
  } catch (parseError) {
    console.error("Error parsing server response:", parseError);
  }
  
  // Fallback na status-based poruku
  return getErrorMessage(response.status, "We're unable to process your form at the moment. Please try again later.");
};

export default function ClientCommonInfoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const form = useForm<ClientCommonInfoFormValues>({
    resolver: zodResolver(clientCommonInfoFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      pageOrigin: "",
      companyName: "",
      brandedResidencesName: "",
      companyWebsite: "",
    },
  });

  // Automatski popuni pageOrigin kada se komponenta mount-uje
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      form.setValue('pageOrigin', currentUrl);
      console.log("📍 Current page URL:", currentUrl);
    }
  }, [form, pathname]);

  const onSubmit = async (data: ClientCommonInfoFormValues) => {
    setIsLoading(true);

    try {
      console.log("📤 Sending form data:", data);
      
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/public/b2b-form-submissions`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data)
      });

      console.log("📋 Response status:", response.status);

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        console.error("❌ Form submission failed:", {
          status: response.status,
          statusText: response.statusText,
          message: errorMessage
        });
        
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("✅ Form submitted successfully:", responseData);

      // Uspešna poruka
      toast.success("Thank you! Your contact request has been sent successfully. We'll get back to you soon.", {
        duration: 5000,
      });
      
      // Reset forme i pageOrigin - SAMO pri uspešnom slanju
      form.reset({
        name: "",
        phoneNumber: "",
        email: "",
        pageOrigin: typeof window !== 'undefined' ? window.location.href : "",
        companyName: "",
        brandedResidencesName: "",
        companyWebsite: "",
      });
      
    } catch (error) {
      console.error("💥 Error sending form:", error);
      
      let errorMessage = "We're unable to process your form at the moment. Please try again later.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Network error handling
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "We're unable to process your form at the moment. Please try again later.";
      }
      
      // Prikaz error toast-a - podaci ostaju u formi
      toast.error(errorMessage, {
        duration: 6000,
      });
      
      // NAMERNO NEMA form.reset() - podaci ostaju u formi kada je greška
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 p-4 lg:p-8 h-full flex-col items-center justify-center gap-6 lg:gap-12 border rounded-lg custom-card contact-form">
      <div className="flex flex-col w-full">
        <h2 className="text-[20px] lg:text-[34px] font-bold w-full">
          Ready to Maximize Your Exposure?
        </h2>
        <p className="text-[12px] lg:text-[18px]">
          Submit your details and let us help you unlock the full potential of
          your project.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 w-full"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Name <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Phone Number <span className="text-primary">*</span>
                  </FormLabel>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email Address <span className="text-primary">*</span>
                </FormLabel>
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
          
          <div className="flex flex-col lg:flex-row gap-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Company Name <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter company name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brandedResidencesName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Name of Branded Residence <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter name of branded residence"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="companyWebsite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Website</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://www.yourcompany.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            disabled={isLoading}
            className="self-end h-[46px] w-[185px] mt-[20px]"
          >
            {isLoading ? "Sending..." : "Send contact request"}
          </Button>
        </form>
      </Form>
    </div>
  );
}