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
import {
  clientCommonInfoFormSchema,
  clientCommonInfoService,
  type ClientCommonInfoFormValues,
} from "@/app/api/contact/clientCommonInfoService";

export default function ClientCommonInfoForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ClientCommonInfoFormValues>({
    resolver: zodResolver(clientCommonInfoFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      companyName: "",
      nameOfBrandedResidence: "",
    },
  });

  const onSubmit = async (data: ClientCommonInfoFormValues) => {
    setIsLoading(true);

    try {
      await clientCommonInfoService.sendInfo(data);
      toast.success("Message sent successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 p-4 lg:p-8 h-full flex-col items-center justify-center gap-6 lg:gap-12 border rounded-lg custom-card contact-form">
      <div>
        <h2 className="text-[20px] lg:text-[34px] font-bold w-full">
          Ready to Maximize Your Exposure?
        </h2>
        <p className="text-[12px] lg-text-[18px]">
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
                    Name <p className="text-primary m-0">*</p>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email Address<p className="text-primary m-0">*</p>
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
                    Company Name <p className="text-primary m-0">*</p>
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
              name="nameOfBrandedResidence"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Name of Branded Residence{" "}
                    <p className="text-primary m-0">*</p>
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
          <Button
            type="submit"
            disabled={isLoading}
            className="self-end w-[125px]"
          >
            {isLoading ? "Sending..." : "Start"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
