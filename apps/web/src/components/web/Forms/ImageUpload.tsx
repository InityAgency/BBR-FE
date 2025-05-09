import React, { useRef, useState } from "react";
import { Plus, X } from "lucide-react";

const MAX_SIZE_MB = 1;
const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

export default function ImageUpload({ onFileChange }: { onFileChange: (file: File | null) => void }) {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        if (!file) return;

        if (!SUPPORTED_FORMATS.includes(file.type)) {
            setError("Only JPG, JPEG, PNG files are supported.");
            onFileChange(null);
            return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setError("File size exceeds 1 MB.");
            onFileChange(null);
            return;
        }

        setFile(file);
        setPreview(URL.createObjectURL(file));
        onFileChange(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        setPreview(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = '';
        onFileChange(null);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Ako je kliknuto na X dugme, ignorisi
        if ((e.target as HTMLElement).closest('button')) return;
        inputRef.current?.click();
    };

    return (
        <div
            className="flex items-center gap-6 border rounded-2xl p-4 cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="logo-upload relative w-[100px] h-[100px] min-w-[100px] min-h-[100px] max-w-[100px] max-h-[100px] flex items-center justify-center border border-dashed rounded-lg bg-secondary">
                {preview ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img src={preview} alt="Logo preview" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }} />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-1 right-1 bg-secondary border hover:bg-white/20 transition-all duration-300 rounded-full p-1 shadow"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="placeholder flex items-center justify-center w-[40%] h-[40%] flex items-center justify-center text-3xl text-muted-foreground bg-[#F6F4ED] rounded-full">
                        <Plus size={24} color="#000"/>
                    </div>
                )}
                <input
                    id="logo-input"
                    type="file"
                    accept="image/png, image/jpeg"
                    style={{ display: "none" }}
                    ref={inputRef}
                    onChange={handleFileChange}
                />
            </div>
            <div>
                <div className="text-white text-md font-medium mb-1">Upload your company logo</div>
                <div className="text-muted-foreground text-sm">
                    JPG, JPEG, PNG, files are supported. Optimal dimensions 500×500 px. Optimal size – up to 1 MB.
                </div>
                {error && <div className="text-red-400 text-md font-medium mt-2">{error}</div>}
            </div>
        </div>
    );
}