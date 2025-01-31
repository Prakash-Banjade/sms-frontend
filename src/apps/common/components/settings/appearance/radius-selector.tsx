import { cn } from "@/lib/utils";
import { useState } from "react";
import { z } from "zod";


const radiusOptions = [
    {
        label: "None",
        value: "0rem",
    },
    {
        label: "Small",
        value: "0.25rem",
    },
    {
        label: "Medium",
        value: "0.5rem",
    },
    {
        label: "Large",
        value: "0.75rem",
    },
    {
        label: "Full",
        value: "1rem",
    }
];

export const radiusSchema = z.enum(["0rem", "0.25rem", "0.5rem", "0.75rem", "1rem"]);
export type Radius = z.infer<typeof radiusSchema>;
export const defaultRadius: Radius = "0.5rem" as const;
export const RADIUS_KEY = "radius" as const;

export default function RadiusSelector() {
    const { success, data } = radiusSchema.safeParse(localStorage.getItem(RADIUS_KEY) ?? defaultRadius);

    const [activeRadius, setActiveRadius] = useState<Radius>(success ? data : defaultRadius);

    const handleRadiusChange = (radius: Radius) => {
        setActiveRadius(radius)
        localStorage.setItem(RADIUS_KEY, radius);
        document.documentElement.style.setProperty('--radius', radius);
    }

    return (
        <ul className="flex gap-3 mt-4">
            {radiusOptions.map((option) => (
                <li key={option.value}>
                    <button
                        type="button"
                        onClick={() => handleRadiusChange(option.value as Radius)}
                        className={cn(
                            "border px-3 py-2 transition-all",
                            option.value === activeRadius && "border-primary text-primary"
                        )}
                        style={{
                            borderRadius: option.value
                        }}
                    >
                        {option.label}
                    </button>
                </li>
            ))}
        </ul>
    )
}