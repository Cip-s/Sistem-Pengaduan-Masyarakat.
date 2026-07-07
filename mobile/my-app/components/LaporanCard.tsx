import React, { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import StatusBadge from "./StatusBadge";

function extractLokasi(bodyText?: string) {
  if (!bodyText) return "-";
  const m = String(bodyText).match(/^\s*Lokasi:\s*(.+)\s*$/m);
  return m?.[1]?.trim() || "-";
}

export default function LaporanCard({
  item,
  onPress,
}: {
  item: any;
  onPress?: () => void;
}) {
  const lokasi = useMemo(() => item?.lokasi || extractLokasi(item?.body), [item]);
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        padding: 14,
        shadowColor: "#0F172A",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "900", color: "#0F172A" }} numberOfLines={1}>
            {item?.header || "-"}
          </Text>
          <View style={{ height: 8 }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="location-outline" size={14} color="#64748B" />
            <Text style={{ color: "#64748B", fontSize: 12, flex: 1 }} numberOfLines={1}>
              {lokasi}
            </Text>
          </View>
          <View style={{ height: 6 }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="time-outline" size={14} color="#94A3B8" />
            <Text style={{ color: "#94A3B8", fontSize: 12 }} numberOfLines={1}>
              {item?.created_at || "-"}
            </Text>
          </View>
        </View>
        <StatusBadge status={item?.status} />
      </View>
    </Pressable>
  );
}

