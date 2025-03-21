"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
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
  userRoles, 
  UserFormValues, 
  initialUserValues 
} from "@/app/schemas/user";
import { Eye, EyeOff, Wand2, X, CircleMinus, Mail } from "lucide-react";

const getStatusBadgeStyle = (status: string) => {
  switch(status) {
    case "Active":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "Invited":
      return "bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50";
    case "Suspended":
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
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema) as any,
    defaultValues: initialData,
    mode: "onChange", // Validate on change
  });

  // Watch required form fields
  const fullName = form.watch("fullName");
  const email = form.watch("email");
  const role = form.watch("role");
  const password = form.watch("password");
  const sendEmail = form.watch("sendEmail");

  useEffect(() => {
    // Ako smo u režimu uređivanja i inicijalni podaci imaju password ili je korisnik već postavio password
    if (isEditing && initialData.password) {
      setShowPasswordField(true);
    }
    
    // Ako kreiramo novog korisnika, automatski prikaži polje za lozinku
    if (!isEditing) {
      setShowPasswordField(true);
    }
  }, [isEditing, initialData.password]);

  useEffect(() => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    // Različita validacija passworda za kreiranje i uređivanje
    let passwordValid = true;
    
    if (isEditing) {
      // U režimu uređivanja, prazan password je validan
      // Ako je prikazano polje za lozinku i uneta je vrednost, mora zadovoljiti kompleksnost
      if (showPasswordField && password && password.trim() !== '') {
        passwordValid = passwordRegex.test(password);
      }
    } else {
      // U režimu kreiranja, password je obavezan i mora da zadovolji kompleksnost
      passwordValid = !!password && passwordRegex.test(password);
    }
    
    const emailValid = !!email && /^\S+@\S+\.\S+$/.test(email);
    const nameValid = !!fullName && fullName.trim().length >= 3;
    const roleValid = !!role && role.trim() !== '';
    
    const valid = nameValid && emailValid && roleValid && passwordValid;
    
    setFormIsValid(valid);
    
  }, [fullName, email, role, password, isEditing, showPasswordField]);

  // Check if form has unsaved changes
  const hasUnsavedChanges = form.formState.isDirty;

  // Za debugging - prati promene u isDirty stanju
  useEffect(() => {
    console.log('Form dirty state changed:', form.formState.isDirty);
    console.log('Form dirty fields:', form.formState.dirtyFields);
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
      
      // Double check that all required fields are present
      if (!data.fullName || !data.email || !data.role || (!isEditing && !data.password)) {
        if (!data.fullName) {
          form.setError("fullName", { type: "required", message: "Full name is required" });
        }
        if (!data.email) {
          form.setError("email", { type: "required", message: "Email address is required" });
        }
        if (!data.role) {
          form.setError("role", { type: "required", message: "User role is required" });
        }
        if (!isEditing && !data.password) {
          form.setError("password", { type: "required", message: "Password is required" });
        }
        
        toast.error("Popunite sva obavezna polja");
        return;
      }
      
      // Priprema podataka za slanje na backend
      const submitData = { ...data };
      
      // Ako smo u režimu uređivanja i password je prazan ili nije prikazano polje za lozinku,
      // uklonimo ga iz podataka za slanje
      if (isEditing && (!showPasswordField || !submitData.password || submitData.password.trim() === '')) {
        delete submitData.password;
        
        console.log('Sending data without password:', submitData);
        
        // Nastavi sa postojećom logikom
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("User updated successfully!");
        form.reset(data);
        router.push("/user-management");
        return;
      }
      
      // Nastavi sa postojećom logikom za ostale slučajeve
      console.log('Sending data with password:', submitData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(isEditing ? "User updated successfully!" : "User created successfully!");
      
      form.reset(data);
      
      router.push("/user-management");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    console.log('Discard clicked, hasUnsavedChanges:', hasUnsavedChanges, 'isDirty:', form.formState.isDirty);
    
    // Provera da li zaista ima promena
    const isDirty = Object.keys(form.formState.dirtyFields).length > 0;
    
    // Ako postoje nesačuvane promene, prikaži modal za potvrdu
    if (isDirty) {
      console.log('There are dirty fields, showing modal');
      // Koristim navigateTo koja će automatski prikazati modal
      navigateTo("/user-management");
    } else {
      console.log('No dirty fields, navigating directly');
      // Ako nema promena, direktno preusmeri na user management
      router.push("/user-management");
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      // Ovde bi išla logika za brisanje
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("User deleted successfully!");
      router.push("/user-management");
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

    const allowedStatuses = ["Active", "Suspended"];

    return (
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <Select 
            onValueChange={(value) => {
              if (value === "Suspended" && field.value !== "Suspended") {
                // Ako korisnik pokušava da suspenduje, prikaži modal za potvrdu
                setPendingStatus(value);
                setShowSuspendDialog(true);
              } else {
                field.onChange(value);
                toast.success(`User status updated to ${value}`);
              }
            }} 
            value={field.value}
          >
            <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
              <Badge 
                className={`${getStatusBadgeStyle(field.value)} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80`}
              >
                {field.value}
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

    // Specifične akcije za status Invited
    if (form.watch("status") === "Invited") {
      return (
        <Button
          variant="outline"
          onClick={() => {
            // Simulacija slanja pozivnice
            toast.success("Invitation email resent successfully!");
          }}
        >
          <Mail className="h-4 w-4" />
          Resend invite mail
        </Button>
      );
    }

    return null;
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Funkcija za generisanje sigurne lozinke
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    
    // Osiguravamo da ima bar jedno veliko slovo, jedno malo slovo i jedan broj
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    
    // Generišemo ostatak lozinke
    for (let i = 0; i < length - 3; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Promešamo karaktere u lozinci
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    // Postavimo lozinku u formu
    form.setValue("password", password, { shouldDirty: true, shouldValidate: true });
    
    // Prikažemo lozinku
    setShowPassword(true);
    
    toast.success("Password generated!");
  };

  return (
    <>
      <FormHeader
        title={isEditing ? `${initialData.fullName || ""}` : "Add new user"}
        titleContent={renderStatusBadge()}
        titleActions={renderStatusActions()}
        onSave={form.handleSubmit(onSubmit)}
        onDiscard={handleDiscard}
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
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>User role <span className="text-destructive">*</span></FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Dodatno logovanje za proveru
                    console.log('Role selected:', value);
                  }} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userRoles.map((userRole) => (
                      <SelectItem key={userRole} value={userRole}>
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                      </SelectItem>
                    ))}
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
                      // Ovde bi trebalo implementirati logiku za slanje reset linka
                      toast.success("Reset link successfully sent to user's email");
                    }}
                  >
                    <Mail className="h-4 w-4" /> Send reset link
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
                      <X className="h-4 w-4" /> Cancel password change
                    </Button>
                  )}
                </>
              ) : null}
            </div>
          </div>
          
          {/* 
            Password Field - uvek prikazujemo kod kreiranja novog korisnika,
            a kod izmene samo kad je showPasswordField = true 
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
                      <Wand2 className="h-4 w-4" />
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

          {/* Profile Image - samo ako smo u režimu uređivanja */}
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
                              // Ako je File objekat, kreiraj URL
                              const imageUrl = URL.createObjectURL(file);
                              field.onChange(imageUrl);
                            } else {
                              // Ako je null, resetuj polje
                              field.onChange(null);
                            }
                            setProfileImageValid(true); // Pretpostavljamo da je validacija uvek uspešna
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
                      checked={field.value}
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
              <CircleMinus className="h-4 w-4" />
              Suspend User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserForm;