"use client";

import { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, helperText, className, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <Label htmlFor={props.id || props.name}>
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                    ref={ref}
                    className={cn(error && "border-red-500", className)}
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

FormInput.displayName = "FormInput";
