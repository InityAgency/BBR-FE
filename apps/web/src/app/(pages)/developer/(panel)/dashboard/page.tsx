"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function DeveloperDashboard() {
    const { user } = useAuth();
    
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome, {user?.fullName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Company Information</h3>
                    {user?.company ? (
                        <div className="space-y-2">
                            <p><strong>Company Name:</strong> {user.company.name}</p>
                            <p><strong>Address:</strong> {user.company.address}</p>
                            <p><strong>Phone:</strong> {user.company.phone_number}</p>
                            <p><strong>Website:</strong> {user.company.website}</p>
                        </div>
                    ) : (
                        <p>No company information available.</p>
                    )}
                </div>
                <div className="rounded-lg border p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                    <p>No recent activity to display.</p>
                </div>
            </div>
        </div>
    );
}