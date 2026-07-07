import React from "react";
import { ScrollView, ScrollViewProps, StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStyles } from "./AppStyles";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
  scroll?: boolean;
};

export default function Screen({ children, style, contentContainerStyle, scroll = true }: Props) {
  if (!scroll) {
    return (
      <SafeAreaView style={[AppStyles.screen, style]} edges={["top"]}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[AppStyles.screen, style]} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

