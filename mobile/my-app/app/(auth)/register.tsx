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
import { register } from "../../lib/auth";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (password.length < 6) return Alert.alert("Validasi", "Password minimal 6 karakter.");
    if (password !== confirm) return Alert.alert("Validasi", "Konfirmasi password tidak sama.");
    setLoading(true);
    try {
      await register({ username, email, password });
      Alert.alert("Sukses", "Registrasi berhasil. Silakan login.");
      router.replace("/(auth)/login");
    } catch (e: any) {
      Alert.alert("Registrasi gagal", e?.message || "Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function InputRow({
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    placeholder: string;
    value: string;
    onChangeText: (v: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address";
    autoCapitalize?: "none" | "sentences";
  }) {
    return (
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
        <Ionicons name={icon} size={18} color="#64748B" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 14, color: "#0F172A" }}
        />
      </View>
    );
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
                value="register"
                options={[
                  { key: "login", label: "Masuk" },
                  { key: "register", label: "Daftar Baru" },
                ]}
                onChange={(k) => {
                  if (k === "login") router.replace("/(auth)/login");
                }}
              />

              <View style={[AppStyles.card, { marginTop: 14 }]}>
                <Text style={AppStyles.label}>NAMA LENGKAP</Text>
                <InputRow
                  icon="person-outline"
                  placeholder="Sesuai KTP"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="sentences"
                />

                <View style={{ height: 12 }} />
                <Text style={AppStyles.label}>EMAIL</Text>
                <InputRow
                  icon="mail-outline"
                  placeholder="warga@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View style={{ height: 12 }} />
                <Text style={AppStyles.label}>KATA SANDI</Text>
                <InputRow
                  icon="lock-closed-outline"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <View style={{ height: 12 }} />
                <Text style={AppStyles.label}>KONFIRMASI KATA SANDI</Text>
                <InputRow
                  icon="lock-closed-outline"
                  placeholder="Ulangi kata sandi"
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry
                />

                <View style={{ height: 14 }} />
                <Pressable style={AppStyles.btnPrimary} onPress={loading ? undefined : onSubmit}>
                  <Text style={AppStyles.btnPrimaryText}>{loading ? "Memproses..." : "Buat Akun Warga"}</Text>
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
                  Dengan mendaftar, Anda menyetujui syarat & ketentuan dan kebijakan privasi.
                </Text>

                <View style={{ height: 12 }} />
                <Text style={{ textAlign: "center", color: "#64748B" }}>
                  Sudah punya akun?{" "}
                  <Link href="/(auth)/login" style={{ color: "#0B5ED7", fontWeight: "900" }}>
                    Masuk
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

