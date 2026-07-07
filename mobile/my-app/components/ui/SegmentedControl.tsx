import React from "react";
import { Pressable, Text, View } from "react-native";

type Option = { key: string; label: string };

export default function SegmentedControl({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Option[];
  onChange: (key: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        borderRadius: 999,
        backgroundColor: "#E2E8F0",
        padding: 3,
        gap: 3,
      }}
    >
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 999,
              backgroundColor: active ? "#FFFFFF" : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontWeight: "900", color: active ? "#0B5ED7" : "#475569" }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

