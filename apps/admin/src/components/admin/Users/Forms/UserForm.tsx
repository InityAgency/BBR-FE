"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import FormHeader from "@/components/admin/Headers/FormHeader";
import UnsavedChangesWarning from "../../Forms/UnsavedChangesWarning";
import DiscardModal from "@/components/admin/Modals/DiscardModal";
import { useDiscardWarning } from "@/hooks/useDiscardWarning";
import ImageUpload from "@/components/admin/Forms/ImageUpload";
import { 
  createUserSchema, 
  updateUserSchema, 
  UserFormValues, 
  initialUserValues,
  userStatuses 
} from "@/app/schemas/user";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Eye, EyeOff, Wand2, X, CircleMinus, Mail } from "lucide-react";
import { usersService } from "@/lib/api/services/users.service";

// Type for role from API
interface RoleType {
  id: string;
  name: string;
  formattedName?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function for capitalization
const capitalizeWords = (text: string) => {
  if (!text) return "";
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};


const ALLOWED_STATUSES = ["ACTIVE", "INACTIVE", "INVITED"] as const;

const getStatusBadgeStyle = (status: string) => {
  switch(status?.toUpperCase()) {
    case "ACTIVE":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "INACTIVE":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
    case "INVITED":
      return "bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50";
    default:
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
  }
};


interface UserFormProps {
  initialData?: Partial<UserFormValues>;
  isEditing?: boolean;
  onSave?: (formData: UserFormValues) => Promise<any>;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData = initialUserValues,
  isEditing = false,
  onSave
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [profileImageValid, setProfileImageValid] = useState(true);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const rolesInitialized = useRef(false);
  const isInitialRender = useRef(true);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema) as any,
    defaultValues: initialData,
    mode: "onChange", // Validate on change
  });

  // Watch required form fields
  const fullName = form.watch("fullName");
  const email = form.watch("email");
  const roleId = form.watch("roleId");
  const password = form.watch("password");
  const sendEmail = form.watch("sendEmail");
  
  // Function to fetch roles using useCallback
  const fetchRoles = useCallback(async () => {
    // Ako je učitavanje u toku, preskačemo
    if (isLoadingRoles) return;
    
    setIsLoadingRoles(true);
    rolesInitialized.current = false; // Resetujemo flag da bismo uvek učitali sveže uloge
    
    try {
      // Direktan API poziv bez keširanja
      
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/roles?limit=5&page=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch roles: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Provera da li imamo podatke u očekivanom formatu
      if (result.data && Array.isArray(result.data)) {
        // Format uloga za prikaz
        const formattedRoles = result.data.map((role: RoleType) => ({
          ...role,
          formattedName: capitalizeWords(role.name)
        }));
        
        setRoles(formattedRoles);
        
        // Postavimo ulogu u formi
        handleFormRoleSetup(formattedRoles);
        
        // Označimo da su uloge inicijalizovane
        rolesInitialized.current = true;
      } else {
        console.error('API nije vratio uloge u očekivanom formatu:', result);
        // Ako API ne uspe, postavimo mock uloge
        setMockRoles();
      }
    } catch (error) {
      console.error('Greška prilikom učitavanja uloga:', error);
      toast.error('Greška prilikom učitavanja korisničkih uloga');
      
      // Postavimo mock uloge kao rezervu
      setMockRoles();
    } finally {
      setIsLoadingRoles(false);
    }
  }, []);
  
  // Helper function to set mock roles when API fails
  const setMockRoles = () => {
    if (!isEditing && roles.length === 0) {
      const mockRoles = [
        { id: "mock-role-id-1", name: "user", formattedName: "User" },
        { id: "mock-role-id-2", name: "admin", formattedName: "Admin" }
      ];
      setRoles(mockRoles);
      handleFormRoleSetup(mockRoles);
    }
  };
  
  // Helper function to set up roles in the form
  const handleFormRoleSetup = useCallback((formattedRoles: RoleType[]) => {
    if (formattedRoles.length === 0) return;
    

    
    // If editing a user
    if (isEditing) {
      if (initialData.roleId) {
        form.setValue("roleId", initialData.roleId, { shouldDirty: false });
      } else if (initialData.role && formattedRoles.length > 0) {
        
        // Try to find role by name, which could be a string or an object
        let roleName = '';
        if (typeof initialData.role === 'string') {
          roleName = initialData.role.toLowerCase();
        } else if (initialData.role && typeof initialData.role === 'object' && 'name' in initialData.role) {
          roleName = (initialData.role as any).name.toLowerCase();
        }
        
        const roleByName = formattedRoles.find(
          (r: RoleType) => r.name.toLowerCase() === roleName
        );
        
        if (roleByName) {
          form.setValue("roleId", roleByName.id, { shouldDirty: false });
        } else {
          form.setValue("roleId", formattedRoles[0].id, { shouldDirty: false });
        }
      }
    } else if (formattedRoles.length > 0) {
      // When creating a new user, set the first role from the list as default
      form.setValue("roleId", formattedRoles[0].id, { shouldDirty: false });
    }
  }, [form, isEditing, initialData]);

  // Load roles only once at component initialization
  useEffect(() => {
    // Call the function to get roles only at first rendering
    if (isInitialRender.current) {
      isInitialRender.current = false;
      fetchRoles().catch(error => {
        console.error("Failed to load roles:", error);
        // Fallback - set default mock role if API doesn't work
        setMockRoles();
      });
    }
  }, [fetchRoles]);

  useEffect(() => {
    // If we're editing and initial data has password or user has already set password
    if (isEditing && initialData.password) {
      setShowPasswordField(true);
    }
    
    // If creating a new user, automatically show password field
    if (!isEditing) {
      setShowPasswordField(true);
    }
  }, [isEditing, initialData.password]);

  // Ensure formIsValid is always true in edit mode (simplified validation)
  useEffect(() => {
    if (isEditing) {
      setFormIsValid(true);
      return;
    }
    
    // Only perform complex validation in create mode
    if (isInitialRender.current) {
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    const passwordValid = !!password && passwordRegex.test(password);
    const emailValid = !!email && /^\S+@\S+\.\S+$/.test(email);
    const nameValid = !!fullName && fullName.trim().length >= 3;
    const roleValid = !!roleId;

    const valid = nameValid && emailValid && roleValid && passwordValid;
    
    setFormIsValid(valid);
  }, [isEditing, fullName, email, roleId, password]);

  // Check if form has unsaved changes
  const hasUnsavedChanges = form.formState.isDirty;

  // Setup discard warning hook
  const {
    showDiscardModal,
    handleConfirmDiscard,
    handleCancelDiscard,
    navigateTo,
  } = useDiscardWarning({
    hasUnsavedChanges,
    onDiscard: () => {
      // Additional actions on discard if needed
    },
  });

  // Function to handle navigation
  const handleNavigation = useCallback(() => {
    setTimeout(() => {
      router.push("/user-management");
    }, 100);
  }, [router]);

  const handleFormSubmit = async (data: UserFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create a new object without status but preserve type compatibility
      const dataWithoutStatus: UserFormValues = {
        ...data,
        status: data.status // Keep status in the type but it won't be sent to API
      };
      
      // If custom onSave function is provided, use it with filtered data
      if (onSave && typeof onSave === 'function') {
        // Remove status before sending to API
        const { status, ...apiData } = dataWithoutStatus;
        await onSave(apiData as UserFormValues);
        toast.success(isEditing ? "User updated successfully!" : "User created successfully!");
        handleNavigation();
        return;
      }
  
      // Default implementation if no custom onSave is provided
      // Prepare data for API - only include required fields
      const submitData: {
        fullName: string;
        email: string;
        roleId: string;
        signupMethod?: string;
        emailNotifications?: boolean;
        password?: string;
        profileImage?: string | null;
      } = {
        fullName: dataWithoutStatus.fullName,
        email: dataWithoutStatus.email,
        roleId: dataWithoutStatus.roleId
      };
  
  
      if (isEditing) {
        // For editing a user, DO NOT include status
        // We're already handling status changes separately in the status dropdown onChange
        
        // Only include password if explicitly entered
        if (dataWithoutStatus.password && dataWithoutStatus.password.trim() !== '') {
          submitData.password = dataWithoutStatus.password;
        }
        
        // Only add profile image if we have one
        if (dataWithoutStatus.profileImage) {
          submitData.profileImage = dataWithoutStatus.profileImage;
        }
      } else {
        // For a new user
        submitData.signupMethod = "email";
        submitData.emailNotifications = dataWithoutStatus.sendEmail || false;
        
        // Password is required for new users
        if (dataWithoutStatus.password) {
          submitData.password = dataWithoutStatus.password;
        } else {
          throw new Error("Password is required for new users");
        }
      }
  
  
      // Direct API call for both cases (creation and update)
      try {
        let response;
        
        if (isEditing && initialData.id) {
          // UPDATE USER - use PUT method
          const url = `${API_BASE_URL}/api/${API_VERSION}/users/${initialData.id}`;
          
          response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(submitData),
            credentials: 'include'
          });
          
        } else {
          // CREATE USER - use POST method
          const url = `${API_BASE_URL}/api/${API_VERSION}/users`;
          
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(submitData),
            credentials: 'include'
          });
          
          if (submitData.emailNotifications) {
            toast.success("Email with access credentials has been sent to the user.");
          }
        }
        
        // Check response
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        toast.success(isEditing ? "User updated successfully!" : "User created successfully!");
        handleNavigation();
        
      } catch (error) {
        console.error("API request error:", error);
        throw error;
      }
      
    } catch (error) {
      console.error(isEditing ? "Error updating user:" : "Error creating user:", error);
      
      // Enhanced error handling
      if ((error as any)?.response?.data?.message) {
        toast.error((error as any).response.data.message);
      } else if ((error as Error).message) {
        toast.error((error as Error).message);
      } else {
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} user`);
      }
      
      // Handle specific error types
      const errorMessage = (error as Error).message?.toLowerCase() || '';
      if (errorMessage.includes('email')) {
        form.setError("email", { 
          type: "server", 
          message: "Email address is already taken" 
        });
      } else if (errorMessage.includes('role')) {
        form.setError("roleId", {
          type: "server",
          message: "Invalid role selected"
        });
      } else if (errorMessage.includes('password')) {
        form.setError("password", {
          type: "server",
          message: "Password does not meet requirements"
        });
      }
      
      throw error; // Rethrow so parent can handle if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    // Check if there are actually changes
    const isDirty = Object.keys(form.formState.dirtyFields).length > 0;
    
    // If there are unsaved changes, show confirmation modal
    if (isDirty) {
      // Use navigateTo which will automatically show modal
      navigateTo("/user-management");
    } else {
      // If no changes, directly navigate
      handleNavigation();
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      
      // Example DELETE request
      if (isEditing && initialData.id) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/users/${initialData.id}`, {
            method: 'DELETE',
            credentials: 'include'
          });
          
          if (!response.ok) {
            throw new Error(`Error deleting user: ${response.status}`);
          }
          
          toast.success("User deleted successfully!");
          router.push("/user-management");
        } catch (error) {
          console.error("Error deleting user:", error);
          toast.error("An error occurred while deleting the user.");
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
        toast.success("User deleted successfully!");
        router.push("/user-management");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSuspend = () => {
    form.setValue("status", "SUSPENDED", { shouldDirty: true }); // Changed to uppercase
    toast.success("User suspended successfully!");
    setShowSuspendDialog(false);
    setPendingStatus(null);
  };

  // Only render status badge in edit mode
  const renderStatusBadge = () => {
    if (!isEditing) return null;
  
    return (
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <Select
            onValueChange={async (value) => {
              field.onChange(value);
              try {
                if (isEditing && initialData?.id) {
                  await usersService.updateUserStatus(initialData.id, value);
                  toast.success(`Status updated to ${value}`);
                }
              } catch (error) {
                console.error("Error updating status:", error);
                toast.error("Failed to update status.");
              }
            }}
            value={field.value || ""}
          >
            <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
              <Badge
                className={`${getStatusBadgeStyle(field.value || "")} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80`}
              >
                {field.value || ""}
              </Badge>
            </SelectTrigger>
            <SelectContent>
              {ALLOWED_STATUSES.map((status) => (
                <SelectItem key={status} value={status} className="text-sm">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    );
  };
  
  // Only render status actions in edit mode
  const renderStatusActions = () => {
    if (!isEditing) return null;

    // Specific actions for Invited status
    if (form.watch("status") === "INVITED") {
      return (
        <Button
          variant="outline"
          onClick={() => {
            // Simulate sending invitation
            toast.success("Invitation email resent successfully!");
          }}
        >
          <Mail className="h-4 w-4 mr-2" />
          Resend invite mail
        </Button>
      );
    }

    return null;
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Function to generate secure password
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    
    // Ensure at least one uppercase letter, one lowercase letter and one number
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    
    // Generate the rest of the password
    for (let i = 0; i < length - 3; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle characters in the password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    // Set password in the form
    form.setValue("password", password, { shouldDirty: true, shouldValidate: true });
    
    // Show password
    setShowPassword(true);
    
    toast.success("Password generated!");
  };

  // Enhanced handleSave function with better error recovery
  const handleSave = useCallback(() => {
    if (formIsValid) {
      
      // Get form values
      const data = form.getValues();
      
      // Create a copy to avoid modifying the original data
      const submitData = { ...data };
      
      // Always remove status field regardless of edit mode
      if (submitData.status !== undefined) {
        const { status, ...restData } = submitData;
        Object.assign(submitData, restData);
      }
      
      // Execute validation before continuing
      form.trigger().then(isValid => {
        if (isValid || isEditing) { // Always consider edit mode as valid
          
          setIsSubmitting(true);
          
          // Call handleFormSubmit with the processed data
          handleFormSubmit(submitData)
            .then(() => {
            })
            .catch(error => {
              console.error("Form submission error:", error);
            })
            .finally(() => {
              setIsSubmitting(false);
            });
        } else {
          toast.error("Please fill in all required fields correctly");
        }
      }).catch(error => {
        console.error("Form validation error:", error);
        toast.error("Form validation failed. Please check your inputs.");
        setIsSubmitting(false);
      });
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  }, [formIsValid, form, isEditing, handleFormSubmit]);
  

  const handleDiscardClick = useCallback(() => {
    handleDiscard();
  }, [handleDiscard]);

  return (
    <>
      <FormHeader
        title={isEditing ? `${initialData.fullName || ""}` : "Add new user"}
        titleContent={renderStatusBadge()}
        titleActions={renderStatusActions()}
        onSave={handleSave} // Make sure this reference is correct
        onDiscard={handleDiscardClick}
        saveButtonText={isEditing ? "Save changes" : "Add new user"}
        saveButtonDisabled={!formIsValid || isSubmitting}
        isSubmitting={isSubmitting}
      />
      
      <Form {...form}>
        <h2 className="text-xl font-semibold mb-4">User details</h2>
        <div className="space-y-6 max-w-2xl">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter full user name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Address */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* User Role */}
          <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>User role <span className="text-destructive">*</span></FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  // Find the selected role to get its name
                  const selectedRole = roles.find(role => role.id === value);
                  if (selectedRole) {
                    // Set the role field (name) for compatibility
                    form.setValue("role", selectedRole.name, { shouldDirty: true });
                  }
                }} 
                defaultValue={field.value}
                value={field.value || ""}
                disabled={isLoadingRoles}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select user role"}>
                      {field.value && roles.length > 0 && (() => {
                        const selectedRole = roles.find(role => role.id === field.value);
                        return selectedRole ? (selectedRole.formattedName || capitalizeWords(selectedRole.name)) : "";
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingRoles ? (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                      Loading roles...
                    </div>
                  ) : roles.length > 0 ? (
                    roles.map((userRole) => (
                      <SelectItem key={userRole.id} value={userRole.id}>
                        {userRole.formattedName || capitalizeWords(userRole.name)}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                      No roles available
                    </div>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

          {/* Password */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Password</h2>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Logic for sending reset link would go here
                      toast.success("Reset link successfully sent to user's email");
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" /> Send reset link
                  </Button>
                  
                  {!showPasswordField ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordField(true)}
                    >
                      Set password
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowPasswordField(false);
                        form.setValue("password", "", { shouldDirty: true });
                      }}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel password change
                    </Button>
                  )}
                </>
              ) : null}
            </div>
          </div>
          
          {/* 
            Password Field - always show when creating a new user,
            and only when showPasswordField = true when editing 
          */}
          {(!isEditing || (isEditing && showPasswordField)) && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password {!isEditing && <span className="text-destructive">*</span>}</FormLabel>
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <FormControl>
                        <Input 
                          placeholder={isEditing ? "Leave empty to keep current password" : "Enter password"} 
                          type={showPassword ? "text" : "password"} 
                          {...field} 
                        />
                      </FormControl>
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={generatePassword}
                      title="Generate password"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Password
                    </Button>
                  </div>
                  <FormDescription>
                    Password must be at least 8 characters, one uppercase letter, one lowercase letter and one number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Send Email Toggle - only when creating a new user */}
          {!isEditing && (
            <FormField
              control={form.control}
              name="sendEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Send email to new user</FormLabel>
                    <FormDescription>
                      New user will receive an email with account information and a link to set the password.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>
      </Form>

      {/* Discard Modal */}
      <DiscardModal
        isOpen={showDiscardModal}
        onClose={handleCancelDiscard}
        onConfirm={handleConfirmDiscard}
      />
      
      {/* Warning for unsaved changes */}
      <UnsavedChangesWarning hasUnsavedChanges={hasUnsavedChanges} />
      
      {/* Suspend User Confirmation Modal - only shown in edit mode */}
      {isEditing && (
        <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Suspend user?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to suspend this user? This will prevent them from accessing the platform.
                You can reactivate the user later if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => {
                  setShowSuspendDialog(false);
                  setPendingStatus(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleSuspend}
                className="bg-destructive text-white hover:bg-destructive/80 transition-colors cursor-pointer"
              >
                <CircleMinus className="h-4 w-4 mr-2" />
                Suspend User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default UserForm;