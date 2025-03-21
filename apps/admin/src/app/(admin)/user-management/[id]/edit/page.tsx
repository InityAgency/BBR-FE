import UserForm from "@/components/admin/Users/Forms/UserForm";
import { usersData } from "@/app/data/users";
import AdminLayout from "../../../AdminLayout";

export default function EditUserPage({ 
  params 
}: { 
  params: { id: string }
}) {
  // U produkciji bismo ovo radili preko API poziva
  const user = usersData.find(user => user.id === params.id);

  if (!user) {
    return <div>Korisnik nije pronađen</div>;
  }

  // Mapiranje podataka korisnika u format koji očekuje forma
  const userData = {
    fullName: user.fullName,
    email: user.email,
    role: user.role.name,
    password: "", // Prazno za izmenu
    sendEmail: false,
    status: user.status || "Active",
  };

  return (
    <AdminLayout>
      <UserForm initialData={userData} isEditing={true} />
    </AdminLayout>
  );
} 