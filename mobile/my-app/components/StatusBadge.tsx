import React from "react";
import { Text, View } from "react-native";
import { AppStyles } from "./ui/AppStyles";

const STATUS: Record<string, { bg: string; text: string; border: string }> = {
  Pending: { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
  Diproses: { bg: "#E0F2FE", text: "#075985", border: "#BAE6FD" },
  Selesai: { bg: "#DCFCE7", text: "#166534", border: "#BBF7D0" },
  Ditolak: { bg: "#FFE4E6", text: "#9F1239", border: "#FECDD3" },
};

function toLabel(status?: string) {
  if (!status) return "Pending";
  const val = String(status).toLowerCase();
  if (val.includes("proses")) return "Diproses";
  if (val.includes("selesai")) return "Selesai";
  if (val.includes("tolak")) return "Ditolak";
  if (val.includes("pending") || val.includes("tunggu")) return "Pending";
  return status;
}

export default function StatusBadge({ status }: { status?: string }) {
  const label = toLabel(status);
  const s = STATUS[label] || { bg: "#F1F5F9", text: "#334155", border: "#E2E8F0" };
  return (
    <View
      style={[
        AppStyles.badge,
        { backgroundColor: s.bg, borderColor: s.border, alignSelf: "flex-start" },
      ]}
    >
      <Text style={[AppStyles.badgeText, { color: s.text }]}>{label}</Text>
    </View>
  );
}
