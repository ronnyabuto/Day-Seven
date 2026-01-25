import { useState, useRef } from "react"
import { Upload, X, Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
    label: string
    onChange: (file: File | null) => void
    error?: string
    value?: File | null
}

export function FileUpload({ label, onChange, error, value }: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = (file: File) => {
        // Basic validation
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert("File is too large. Max 5MB.")
            return
        }

        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            alert("Only images and PDFs are allowed.")
            return
        }

        onChange(file)
    }

    const removeFile = () => {
        onChange(null)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Encrypted & Secure
                </span>
            </div>

            {!value ? (
                <div
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 text-center ${dragActive
                            ? "border-primary bg-primary/10"
                            : "border-white/20 hover:border-white/40 bg-white/5"
                        } ${error ? "border-red-500/50 hover:border-red-500" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleChange}
                    />

                    <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => inputRef.current?.click()}>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Passport or National ID (Max 5MB)
                        </p>
                    </div>
                </div>
            ) : (
                <div className="relative border border-white/20 rounded-xl p-4 bg-white/10 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium truncate max-w-[200px]">
                                {value.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {(value.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={removeFile}
                        className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-500 mt-1">
                    {error}
                </p>
            )}
        </div>
    )
}
