"use client";

import { forwardRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormTextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    helperText?: string;
    showCharCount?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ label, error, helperText, showCharCount, className, maxLength, ...props }, ref) => {
        const [charCount, setCharCount] = useState(0);

        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor={props.id || props.name}>
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {showCharCount && maxLength && (
                        <span className="text-sm text-gray-500">
                            {charCount}/{maxLength}
                        </span>
                    )}
                </div>
                <Textarea
                    ref={ref}
                    className={cn(error && "border-red-500", className)}
                    maxLength={maxLength}
                    onChange={(e) => {
                        setCharCount(e.target.value.length);
                        props.onChange?.(e);
                    }}
                    {...props}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

FormTextarea.displayName = "FormTextarea";
