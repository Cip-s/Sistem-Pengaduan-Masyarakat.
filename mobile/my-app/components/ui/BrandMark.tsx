import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BrandMark({ size = 64 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.16)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="shield-checkmark-outline" size={Math.round(size * 0.52)} color="#FFFFFF" />
    </View>
  );
}

