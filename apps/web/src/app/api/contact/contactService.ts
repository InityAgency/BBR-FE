"use client";

import { z } from "zod";

// Definicija šeme za validaciju forme
export const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    policy: z.boolean().refine(val => val === true, {
        message: "You must agree to the terms and conditions"
    })
});

// Definicija tipa za podatke forme
export type FormValues = z.infer<typeof formSchema>;

export const contactService = {
    async sendMessage(data: FormValues) {
        try {
            const response = await fetch("{{baseUrl}}/api/{{apiVersion}}/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("Error in contactService:", error);
            throw error;
        }
    }
};