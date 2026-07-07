import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { AppStyles } from "../../../components/ui/AppStyles";
import Screen from "../../../components/ui/Screen";
import { getProfile, logout } from "../../../lib/auth";
import { useRouter } from "expo-router";

function Row({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: danger ? "#FFE4E6" : "#F1F5F9",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={18} color={danger ? "#BE123C" : "#0B5ED7"} />
      </View>
      <Text style={{ flex: 1, fontWeight: "900", color: danger ? "#BE123C" : "#0F172A" }}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const p = await getProfile();
        if (!mounted) return;
        setProfile(p);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Screen contentContainerStyle={{ paddingBottom: 18 }}>
      <View style={[AppStyles.container, { paddingTop: 10 }]}>
        <View style={AppStyles.headerCard}>
          <View
            style={{
              position: "absolute",
              right: -50,
              top: -40,
              width: 170,
              height: 170,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          />
          <View style={{ alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.18)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.22)",
              }}
            >
              <Ionicons name="person-outline" size={30} color="#FFFFFF" />
            </View>
            <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 18 }}>
              {profile?.username || (loading ? "Memuat..." : "Warga")}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.75)" }}>{profile?.email || ""}</Text>
            <View style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.16)" }}>
              <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 12 }}>Warga Terverifikasi</Text>
            </View>
          </View>
        </View>

        <View style={[AppStyles.card, { marginTop: 14 }]}>
          <Row icon="person-circle-outline" label="Informasi Akun" onPress={() => Alert.alert("Info", "Fitur ini belum digunakan di mobile.")} />
          <View style={{ height: 1, backgroundColor: "#E2E8F0" }} />
          <Row icon="lock-closed-outline" label="Keamanan & Password" onPress={() => Alert.alert("Info", "Fitur ini belum digunakan di mobile.")} />
          <View style={{ height: 1, backgroundColor: "#E2E8F0" }} />
          <Row icon="settings-outline" label="Pengaturan Aplikasi" onPress={() => Alert.alert("Info", "Fitur ini belum digunakan di mobile.")} />
          <View style={{ height: 1, backgroundColor: "#E2E8F0" }} />
          <Row icon="help-circle-outline" label="Bantuan & FAQ" onPress={() => Alert.alert("Info", "Fitur ini belum digunakan di mobile.")} />
          <View style={{ height: 1, backgroundColor: "#E2E8F0" }} />
          <Row icon="information-circle-outline" label="Tentang LAPOR!" onPress={() => Alert.alert("Info", "Versi mobile untuk sistem pengaduan masyarakat.")} />
        </View>

        <View style={{ height: 12 }} />
        <Pressable
          style={AppStyles.btnDangerOutline}
          onPress={async () => {
            await logout();
            router.replace("/(auth)/login");
          }}
        >
          <Text style={AppStyles.btnDangerOutlineText}>Keluar dari Akun</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
