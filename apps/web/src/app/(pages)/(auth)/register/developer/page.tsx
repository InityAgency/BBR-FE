import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RegisterDeveloperForm from "@/components/web/Auth/Forms/RegisterDeveloper";

const RegisterDeveloper = () => {
    return (
        <div className="flex items-center justify-center w-full">
            <div className="w-full py-6 lg:p-8">
                <div className="flex flex-col gap-3 mb-1">
                    <div className="flex w-full flex-row items-center justify-between">
                        <Link href="/register" className="text-balance cursor-pointer text-md font-medium text-primary-foreground flex items-center gap-1 hover:text-primary transition-all mb-3"> 
                        <ArrowLeft size={20} />
                        Return back
                        </Link>
                        <span className="text-muted-foreground text-md font-medium">Developer account</span>
                    </div>
                    <h1 className="text-4xl font-bold text-left lg:text-left">Just a few clicks from creating your BBR account</h1>
                    <p className="mb-6 text-muted-foreground text-md">
                        It takes less then 2 minutes to join our community to access exclusive features and elevate your property experience. 
                    </p>
                </div>
                <h2 className="text-sans text-xl lg:text-2xl">Create BBR account as a developer</h2>
                <RegisterDeveloperForm />
            </div>
        </div>
    )
}

export default RegisterDeveloper;