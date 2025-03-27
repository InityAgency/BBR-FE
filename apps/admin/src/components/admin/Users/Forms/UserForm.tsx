"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
import apiClient from "@/lib/api.client";
import { 
  createUserSchema, 
  updateUserSchema, 
  UserFormValues, 
  initialUserValues,
  userStatuses 
} from "@/app/schemas/user";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Eye, EyeOff, Wand2, X, CircleMinus, Mail } from "lucide-react";

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

const getStatusBadgeStyle = (status: string) => {
  switch(status?.toLowerCase()) {
    case "active":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "invited":
      return "bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50";
    case "suspended":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
    default:
      return "";
  }
};

interface UserFormProps {
  initialData?: Partial<UserFormValues>;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData = initialUserValues,
  isEditing = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
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
    // If roles are already loaded or loading is in progress, do nothing
    if (rolesInitialized.current || isLoadingRoles) return;
    
    setIsLoadingRoles(true);
    try {
      // First check if we have cached roles in localStorage
      const cachedRoles = localStorage.getItem('userRolesCache');
      const cacheTimestamp = localStorage.getItem('userRolesCacheTimestamp');
      
      // If we have cached roles and cache is not older than 24h (86400000 ms)
      const cacheIsValid = cachedRoles && cacheTimestamp && 
                          (Date.now() - parseInt(cacheTimestamp) < 86400000);
      
      // If we have valid cached roles, use them instead of API call
      if (cacheIsValid && cachedRoles) {
        const parsedRoles = JSON.parse(cachedRoles);
        
        // Format role names for display
        const formattedRoles = parsedRoles.map((role: RoleType) => ({
          ...role,
          formattedName: capitalizeWords(role.name)
        }));
        
        setRoles(formattedRoles);
        
        // Set up roles in the form
        handleFormRoleSetup(formattedRoles);
        
        // Mark roles as initialized
        rolesInitialized.current = true;
      } else {
        // If we don't have cached roles or they're expired, load them from the server
        // Mark initialization started
        rolesInitialized.current = true;
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/roles?limit=10&page=1`, {
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
          
          // Set roles in the state
          if (result.data && Array.isArray(result.data)) {
            // Format role names for display
            const formattedRoles = result.data.map((role: RoleType) => ({
              ...role,
              formattedName: capitalizeWords(role.name)
            }));
            
            // Save roles in localStorage for future use
            localStorage.setItem('userRolesCache', JSON.stringify(result.data));
            localStorage.setItem('userRolesCacheTimestamp', Date.now().toString());
            
            setRoles(formattedRoles);
            
            // Set up roles in the form
            handleFormRoleSetup(formattedRoles);
          } else {
            console.error('API did not return roles in expected format:', result);
            // If API fails, set mock roles at least
            setMockRoles();
          }
        } catch (error) {
          console.error('Error when loading roles:', error);
          toast.error('Error loading user roles');
          // In case of error, reset the flag to allow re-loading
          rolesInitialized.current = false;
          // Set mock roles as a fallback
          setMockRoles();
        }
      }
    } catch (error) {
      console.error('Error loading user roles:', error);
      toast.error('Error loading user roles');
      // In case of error, reset the flag to allow re-loading
      rolesInitialized.current = false;
      // Set mock roles as a fallback
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
        const roleByName = formattedRoles.find(
          (r: RoleType) => r.name.toLowerCase() === initialData.role?.toLowerCase()
        );
        
        if (roleByName) {
          form.setValue("roleId", roleByName.id, { shouldDirty: false });
        }
      }
    } else if (formattedRoles.length > 0) {
      // When creating a new user, set the first role from the list as default
      form.setValue("roleId", formattedRoles[0].id, { shouldDirty: false });
    }
  }, [form, isEditing, initialData.roleId, initialData.role]);

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

  // Update validation state whenever form fields change
  useEffect(() => {
    // If still in initial loading of role, don't validate
    if (isInitialRender.current) {
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    // Different password validation for create vs. edit
    let passwordValid = true;
    
    if (isEditing) {
      // In edit mode, empty password is valid
      // If password field is shown and a value is entered, it must meet complexity requirements
      if (showPasswordField && password && password.trim() !== '') {
        passwordValid = passwordRegex.test(password);
      }
    } else {
      // In create mode, password is required and must meet complexity requirements
      passwordValid = !!password && passwordRegex.test(password);
    }
    
    const emailValid = !!email && /^\S+@\S+\.\S+$/.test(email);
    const nameValid = !!fullName && fullName.trim().length >= 3;
    const roleValid = !!roleId;

    const valid = nameValid && emailValid && roleValid && passwordValid;
    
    setFormIsValid(valid);
    
  }, [fullName, email, roleId, password, isEditing, showPasswordField]);

  // Check if form has unsaved changes
  const hasUnsavedChanges = form.formState.isDirty;

  // For debugging - track changes in isDirty state
  useEffect(() => {
  }, [form.formState.isDirty, form.formState.dirtyFields]);

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

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsSubmitting(true);
  
      // Prepare data for API - only include required fields
      const submitData: {
        fullName: string;
        email: string;
        roleId: string;
        signupMethod: string;
        emailNotifications: boolean;
        password?: string;
        status?: string;
        profileImage?: string | null;
      } = {
        fullName: data.fullName,
        email: data.email,
        roleId: data.roleId,
        signupMethod: "email",
        emailNotifications: data.sendEmail || false,
        status: data.status || "Active",
        profileImage: data.profileImage || null
      };
  
      // Only include password if it's not empty (for updates)
      if (data.password && data.password.trim() !== '') {
        submitData.password = data.password;
      }
  
      // Determine the API endpoint and method based on isEditing
      const endpoint = isEditing && initialData.id 
        ? `${API_BASE_URL}/api/${API_VERSION}/users/${initialData.id}`
        : `${API_BASE_URL}/api/${API_VERSION}/users`;
      
      const method = isEditing ? 'PUT' : 'POST';
  
      // Make API call
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData),
        credentials: 'include'
      });
  
      // Handle response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
  
      // Success
      toast.success(isEditing ? "User updated successfully!" : "User created successfully!");
      if (!isEditing && submitData.emailNotifications) {
        toast.success("Email with access credentials has been sent to the user.");
      }
      
      // Reset form and redirect
      form.reset(initialUserValues);
      router.push("/user-management");
  
    } catch (error) {
      console.error(isEditing ? "Error updating user:" : "Error creating user:", error);
      toast.error((error as Error).message || `Failed to ${isEditing ? 'update' : 'create'} user`);
      
      // Handle duplicate email error
      if ((error as Error).message?.toLowerCase().includes('email')) {
        form.setError("email", { 
          type: "server", 
          message: "Email address is already taken" 
        });
      }
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
      // If no changes, directly redirect to user management
      router.push("/user-management");
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      // Here would be the logic for deletion
      
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

  const handleBlock = () => {
    form.setValue("status", "Blocked", { shouldDirty: true });
    toast.success("User blocked successfully!");
    setShowBlockDialog(false);
  };

  const handleSuspend = () => {
    form.setValue("status", "Suspended", { shouldDirty: true });
    toast.success("User suspended successfully!");
    setShowSuspendDialog(false);
    setPendingStatus(null);
  };

  const renderStatusBadge = () => {
    if (!isEditing) return null;

    const allowedStatuses = userStatuses;

    return (
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <Select 
            onValueChange={(value) => {
              if (value === "Suspended" && field.value !== "Suspended") {
                // If user tries to suspend, show confirmation modal
                setPendingStatus(value);
                setShowSuspendDialog(true);
              } else {
                field.onChange(value);
                toast.success(`User status updated to ${value}`);
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
              {allowedStatuses.map((status) => (
                <SelectItem 
                  key={status} 
                  value={status}
                  className="text-sm"
                >
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    );
  };

  const renderStatusActions = () => {
    if (!isEditing) return null;

    // Specific actions for Invited status
    if (form.watch("status") === "Invited") {
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

  const handleSave = useCallback(() => {


    if (formIsValid) {
      form.handleSubmit((data) => {
        onSubmit(data);
      })();
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  }, [formIsValid, form, onSubmit, fullName, email, roleId, password, isEditing, showPasswordField]);

  const handleDiscardClick = useCallback(() => {
    handleDiscard();
  }, [handleDiscard]);

  return (
    <>
      <FormHeader
        title={isEditing ? `${initialData.fullName || ""}` : "Add new user"}
        titleContent={renderStatusBadge()}
        titleActions={renderStatusActions()}
        onSave={() => handleSave()}
        onDiscard={() => handleDiscardClick()}
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

          {/* Profile Image - only in edit mode */}
          {isEditing && (
            <div className="mt-8 mb-4">
              <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <ImageUpload
                          onChange={(file) => {
                            if (file) {
                              // If file is provided, handle it as a File object
                              if (file instanceof File) {
                                // For actual implementation, you'd upload the file to your server here
                                // and then get back a URL to store in the form
                                const fileReader = new FileReader();
                                fileReader.onload = (e) => {
                                  // Store the base64 encoded image or URL in the form
                                  const imageUrl = e.target?.result as string;
                                  field.onChange(imageUrl);
                                  form.setValue("profileImage", imageUrl, { shouldDirty: true });
                                };
                                fileReader.readAsDataURL(file);
                              } else if (typeof file === 'string') {
                                // If it's already a string (URL), just use it
                                field.onChange(file);
                                form.setValue("profileImage", file, { shouldDirty: true });
                              }
                            } else {
                              // If null, reset field
                              field.onChange(null);
                              form.setValue("profileImage", null, { shouldDirty: true });
                            }
                            setProfileImageValid(true); // Assume validation is always successful
                          }}
                          value={field.value}
                          supportedFormats={["JPG", "JPEG", "PNG"]}
                          maxSize={5}
                          aspectRatio="1:1"
                          onValidation={setProfileImageValid}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Recommended size 500x500 pixels<br />
                          JPG, JPEG and PNG formats are supported<br />
                          Max. upload size - 5MB
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Send Email Toggle */}
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
      
      {/* Suspend User Confirmation Modal */}
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
    </>
  );
};

export default UserForm;