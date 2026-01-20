"use client"; // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileuploadProps {
    onSuccess: (response: any) => void;
    onProgress: (progress: number) => void;
    fileType?: "image" | "video";
}

// Fileupload component demonstrates file uploading using ImageKit's Next.js SDK.
const Fileupload = ({ onSuccess, onProgress, fileType }: FileuploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //optional validation

    const validateFile = (file: File): string | null => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid video file.");
            }
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("File size must be less then 100MB ");
        }
        return null;
    };
    /**
     * Handles the file upload process.
     *
     * This function:
     * - Validates file selection.
     * - Retrieves upload authentication credentials.
     * - Initiates the file upload via the ImageKit SDK.
     * - Updates the upload progress.
     * - Catches and processes errors accordingly.
     */

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !validateFile(file)) return;
        setUploading(true);
        setError(null);
        try {
            const authRes = await fetch("/api/imagekit/upload-auth")
            const auth = await authRes.json();

           const res = await upload({
                file,
                fileName: file.name, 
                publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) { {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent));
                    }
                }
                  
              
                },
            });
            onSuccess(res);

        }
        catch (err){
        console.error("Upload Failed:", err);
        } finally {
            setUploading(false);
        }
  };

    return (
        <>
            <input
                type="file"
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
            />
            {uploading && <p>Uploading...</p>}
        </>
    );
};

export default Fileupload;
