import { z } from "zod";
export const clientCommonInfoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().min(1, "Company name is required"),
  nameOfBrandedResidence: z
    .string()
    .min(1, "Name of branded residence is required"),
});

export type ClientCommonInfoFormValues = z.infer<
  typeof clientCommonInfoFormSchema
>;

export const clientCommonInfoService = {
  async sendInfo(data: ClientCommonInfoFormValues) {
    try {
      // TODO: CALL API WHEN API IS READY
      const response = new Response();

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
