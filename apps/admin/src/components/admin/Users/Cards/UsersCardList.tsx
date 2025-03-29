import React from "react";
import { User } from "@/lib/api/services/types";
import { UserCard } from "./UserCard";

interface UsersCardListProps {
  users: User[];
}

export function UsersCardList({ users }: UsersCardListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
      {users.length === 0 && (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      )}
    </div>
  );
} 