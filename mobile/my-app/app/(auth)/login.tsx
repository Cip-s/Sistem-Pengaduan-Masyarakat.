import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BrandMark from "../../components/ui/BrandMark";
import { AppStyles } from "../../components/ui/AppStyles";
import SegmentedControl from "../../components/ui/SegmentedControl";
import { login } from "../../lib/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    try {
      await login({ email, password });
      router.replace("/(user)/(tabs)/dashboard");
    } catch (e: any) {
      Alert.alert("Login gagal", e?.message || "Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[AppStyles.screen, { backgroundColor: "#0B5ED7" }]} edges={["top"]}>
      <KeyboardAvoidingView
        style={[AppStyles.screen, { backgroundColor: "#0B5ED7" }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: 18, alignItems: "center" }}>
            <BrandMark size={64} />
            <View style={{ height: 10 }} />
            <Text style={{ color: "#93C5FD", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 }}>
              Portal Resmi Pengaduan Masyarakat
            </Text>
            <View style={{ height: 6 }} />
            <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "900" }}>LAPOR!</Text>
          </View>

          <View style={{ flex: 1, backgroundColor: "#F8FAFC", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
            <View style={[AppStyles.container, { paddingTop: 14 }]}>
              <SegmentedControl
                value="login"
                options={[
                  { key: "login", label: "Masuk" },
                  { key: "register", label: "Daftar Baru" },
                ]}
                onChange={(k) => {
                  if (k === "register") router.replace("/(auth)/register");
                }}
              />

              <View style={[AppStyles.card, { marginTop: 14 }]}>
                <Text style={AppStyles.label}>EMAIL</Text>
                <View
                  style={{
                    marginTop: 6,
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    backgroundColor: "#FFFFFF",
                    paddingHorizontal: 12,
                  }}
                >
                  <Ionicons name="mail-outline" size={18} color="#64748B" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="warga@email.com"
                    style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 14, color: "#0F172A" }}
                  />
                </View>

                <View style={{ height: 12 }} />
                <Text style={AppStyles.label}>KATA SANDI</Text>
                <View
                  style={{
                    marginTop: 6,
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    backgroundColor: "#FFFFFF",
                    paddingHorizontal: 12,
                  }}
                >
                  <Ionicons name="lock-closed-outline" size={18} color="#64748B" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="••••••••"
                    style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 14, color: "#0F172A" }}
                  />
                </View>

                <View style={{ height: 14 }} />
                <Pressable style={AppStyles.btnPrimary} onPress={loading ? undefined : onSubmit}>
                  <Text style={AppStyles.btnPrimaryText}>{loading ? "Memproses..." : "Masuk sebagai Warga"}</Text>
                </Pressable>

                <View style={{ height: 10 }} />
                <Text style={{ textAlign: "center", color: "#94A3B8", fontWeight: "800", fontSize: 12 }}>atau</Text>
                <View style={{ height: 10 }} />

                <Pressable
                  style={AppStyles.btnOutline}
                  onPress={() => Alert.alert("Info", "Login administrator tidak digunakan di versi mobile.")}
                >
                  <Text style={AppStyles.btnOutlineText}>Masuk sebagai Administrator</Text>
                </Pressable>

                <View style={{ height: 12 }} />
                <Text style={{ textAlign: "center", color: "#94A3B8", fontSize: 12 }}>
                  Dengan masuk, Anda menyetujui syarat & ketentuan dan kebijakan privasi.
                </Text>

                <View style={{ height: 12 }} />
                <Text style={{ textAlign: "center", color: "#64748B" }}>
                  Belum punya akun?{" "}
                  <Link href="/(auth)/register" style={{ color: "#0B5ED7", fontWeight: "900" }}>
                    Daftar Baru
                  </Link>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

