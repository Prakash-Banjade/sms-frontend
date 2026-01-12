import { cn } from "@/lib/utils";
import { Check } from "lucide-react"
import { useState } from "react"
import { z } from "zod";
import RadiusSelector from "./radius-selector";
import { ThemeToggle } from "./theme-toggle";

export enum ThemeColor {
    Abhyam = "abhyam",
    Zinc = "zinc",
    Orange = "orange",
    Green = "green",
    Blue = "blue",
    Red = "red",
    Yellow = "yellow",
    Rose = "rose",
    Violet = "violet"
}

const themeColors: {
    name: string;
    value: ThemeColor;
    code: string;
}[] = [
        {
            name: "Abhyam",
            value: ThemeColor.Abhyam,
            code: "#04413d",
        },
        {
            name: "Zinc",
            value: ThemeColor.Zinc,
            code: "#52525b"
        },
        {
            name: "Orange",
            value: ThemeColor.Orange,
            code: "#ea580c"
        },
        {
            name: "Green",
            value: ThemeColor.Green,
            code: "#22c55e"
        },
        {
            name: "Blue",
            value: ThemeColor.Blue,
            code: "#3b82f6"
        },
        {
            name: "Red",
            value: ThemeColor.Red,
            code: "#dc2626"
        },
        {
            name: "Yellow",
            value: ThemeColor.Yellow,
            code: "#facc15"
        },
        {
            name: "Rose",
            value: ThemeColor.Rose,
            code: "#e11d48"
        },
        {
            name: "Violet",
            value: ThemeColor.Violet,
            code: "#6d28d9"
        },
    ]

export const THEME_COLOR_KEY = "theme-color" as const;

export const themeColorSchema = z.nativeEnum(ThemeColor);
export const defaultThemeColor: ThemeColor = ThemeColor.Zinc;

export default function Appearance() {
    const { success, data } = themeColorSchema.safeParse(localStorage.getItem(THEME_COLOR_KEY) ?? defaultThemeColor);

    const [activeTheme, setActiveTheme] = useState<ThemeColor>(success ? data : defaultThemeColor);

    const handleThemeChange = (color: ThemeColor) => {
        setActiveTheme(color)

        localStorage.setItem(THEME_COLOR_KEY, color);
        document.documentElement.classList.remove(...Object.values(ThemeColor));
        document.documentElement.classList.add(color);
    }

    return (
        <section className='px-1 space-y-8'>
            <header>
                <h2 className="text-2xl font-medium">Appearance</h2>
                <p className='text-muted-foreground text-sm'>Customize your experience.</p>
            </header>

            <section className="md:space-y-12 space-y-8">
                <section>
                    <header>
                        <h3 className="text-lg font-medium">Theme</h3>
                        <p className="text-muted-foreground text-sm">Toggle between the light and dark themes.</p>
                    </header>
                    <ThemeToggle />
                </section>

                <section>
                    <header>
                        <h3 className="text-lg font-medium">Primary Color</h3>
                        <p className="text-muted-foreground text-sm">Choose a primary color for your theme.</p>
                    </header>

                    <div className="flex flex-wrap gap-4 mt-2">
                        {themeColors.map((color) => (
                            <div key={color.value}>
                                <button
                                    className={cn(
                                        "xl:size-28 lg:size-20 size-16 rounded-md focus:outline-hidden focus:ring-2 focus:ring-offset-2",
                                        activeTheme === color.value && "ring-2 ring-offset-2"
                                    )}
                                    style={{ backgroundColor: color.code }}
                                    onClick={() => handleThemeChange(color.value as ThemeColor)}
                                    aria-label={`Select ${color.name} theme`}
                                    aria-pressed={activeTheme === color.value}
                                >
                                    {activeTheme === color.value && <Check className="w-6 h-6 text-white mx-auto" />}
                                </button>
                                <p className="text-center text-sm">{color.name}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <header>
                        <h3 className="text-lg font-medium">Curve Radius</h3>
                        <p className="text-muted-foreground text-sm">Adjust the curve radius of the components.</p>
                    </header>

                    <RadiusSelector />
                </section>
            </section>
        </section>
    )
}