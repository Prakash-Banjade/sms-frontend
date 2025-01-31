import { defaultThemeColor, THEME_COLOR_KEY, ThemeColor, themeColorSchema } from "@/apps/common/components/settings/appearance/appearance";
import { defaultRadius, RADIUS_KEY, radiusSchema } from "@/apps/common/components/settings/appearance/radius-selector";

export function useLoadApperance() {
    const { success: themeColorSuccess, data: themeColor } = themeColorSchema.safeParse(localStorage.getItem(THEME_COLOR_KEY) ?? defaultThemeColor);
    const { success: radiusSuccess, data: radius } = radiusSchema.safeParse(localStorage.getItem(RADIUS_KEY) ?? defaultRadius);

    if (themeColorSuccess) {
        document.documentElement.classList.remove(...Object.values(ThemeColor));
        document.documentElement.classList.add(themeColor);
    }
    if (radiusSuccess) {
        document.documentElement.style.setProperty('--radius', radius);
    }
}