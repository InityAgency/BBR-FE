import { Construction } from "lucide-react";

export default function UnderConstruction() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50svh] border rounded-lg p-8 bg-secondary w-full">
            <Construction width={100} height={100} className="text-muted-foreground mb-4" />
            <h1 className="text-4xl font-bold">Under Construction</h1>
            <p className="text-lg text-muted-foreground mt-4">This page is under construction. Please check back later.</p>
        </div>
    )
}