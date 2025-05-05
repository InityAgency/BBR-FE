"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function BuyerDashboard() {
    const { user } = useAuth();
    
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome, {user?.fullName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Your Profile</h3>
                    <div className="space-y-2">
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Role:</strong> {user?.role.name}</p>
                    </div>
                </div>
                <div className="rounded-lg border p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Favorite Residences</h3>
                    <p>You haven't saved any residences yet.</p>
                </div>
            </div>
        </div>
    );
}