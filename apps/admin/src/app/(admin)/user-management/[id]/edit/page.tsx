import UserForm from "@/components/admin/Users/Forms/UserForm";
import AdminLayout from "../../../AdminLayout";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

async function getUser(id: string) {
  try {
    console.log('Fetching user with ID:', id);
    console.log('API URL:', `${API_BASE_URL}/api/${API_VERSION}/users/${id}`);

    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      cache: 'no-store'
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      if (response.status === 404) {
        console.log('User not found');
        return null;
      }
      if (response.status === 403) {
        console.error('Forbidden - Authentication failed');
        throw new Error('Authentication failed. Please log in again.');
      }
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('User data received:', data);
    return data;
  } catch (error) {
    console.error('Error in getUser:', error);
    throw error;
  }
}

export default async function EditUserPage({ 
  params 
}: { 
  params: { id: string }
}) {
  try {
    console.log('EditUserPage - Starting to fetch user data for ID:', params.id);
    const userData = await getUser(params.id);

    if (!userData) {
      console.log('EditUserPage - User not found');
      return (
        <AdminLayout>
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h1 className="text-2xl font-semibold mb-2">Korisnik nije pronađen</h1>
            <p className="text-muted-foreground">Korisnik sa ID-em {params.id} ne postoji ili je obrisan.</p>
          </div>
        </AdminLayout>
      );
    }

    console.log('EditUserPage - User data received, preparing form data');
    
    // Mapiranje podataka korisnika u format koji očekuje forma
    const userFormData = {
      id: userData.id,
      fullName: userData.fullName,
      email: userData.email,
      roleId: userData.role?.id,
      role: userData.role?.name,
      password: "", // Prazno za izmenu
      sendEmail: false,
      status: userData.status || "Active",
      profileImage: userData.profileImage || null,
    };

    console.log('EditUserPage - Form data prepared:', userFormData);

    return (
      <AdminLayout>
        <UserForm initialData={userFormData} isEditing={true} />
      </AdminLayout>
    );
  } catch (error) {
    console.error('EditUserPage - Error:', error);
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h1 className="text-2xl font-semibold mb-2 text-destructive">Greška pri učitavanju</h1>
          <p className="text-muted-foreground">Došlo je do greške prilikom učitavanja podataka o korisniku.</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-sm text-muted-foreground mt-2">
              Error: {(error as Error).message}
            </p>
          )}
        </div>
      </AdminLayout>
    );
  }
}