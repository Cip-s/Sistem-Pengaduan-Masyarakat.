import { Platform } from "react-native";

const primary = "#0B5ED7";

export const Colors = {
  light: {
    text: "#0F172A",
    background: "#F8FAFC",
    card: "#FFFFFF",
    border: "#E2E8F0",
    tint: primary,
    icon: "#64748B",
    tabIconDefault: "#64748B",
    tabIconSelected: primary,
  },
  dark: {
    text: "#ECEDEE",
    background: "#0B1220",
    card: "#0F172A",
    border: "#1F2937",
    tint: "#60A5FA",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#60A5FA",
  },
};

export const Fonts = Platform.select({
  ios: { sans: "system-ui", serif: "ui-serif", rounded: "ui-rounded", mono: "ui-monospace" },
  default: { sans: "normal", serif: "serif", rounded: "normal", mono: "monospace" },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

