import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Colors } from "../../../constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          height: 62,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopColor: "#E2E8F0",
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="buat"
        options={{
          title: "Lapor",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
