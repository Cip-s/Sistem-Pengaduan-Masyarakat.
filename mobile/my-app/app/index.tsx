import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { getToken } from "../lib/auth";
import BrandMark from "../components/ui/BrandMark";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [minSplashDone, setMinSplashDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const t = await getToken();
      if (!mounted) return;
      setHasToken(!!t);
      setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMinSplashDone(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (!ready || !minSplashDone) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0B5ED7" }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <BrandMark size={74} />
          <View style={{ height: 14 }} />
          <Text style={{ color: "#93C5FD", fontSize: 10, fontWeight: "800", letterSpacing: 2 }}>
            REPUBLIK INDONESIA
          </Text>
          <View style={{ height: 8 }} />
          <Text style={{ color: "#FFFFFF", fontSize: 34, fontWeight: "900" }}>LAPOR!</Text>
          <Text style={{ color: "#DBEAFE", marginTop: 4, fontWeight: "700" }}>
            Sistem Pengaduan Masyarakat
          </Text>

          <View style={{ height: 22 }} />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.45)" }} />
            <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.72)" }} />
            <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.45)" }} />
          </View>
          <View style={{ height: 18 }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={{ color: "rgba(255,255,255,0.75)", fontWeight: "700" }}>
              Memuat aplikasi...
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, paddingBottom: 22 }}>
          <Text style={{ textAlign: "center", color: "rgba(255,255,255,0.55)", fontSize: 11 }}>
            Kemudahan Pelayanan untuk Warga
          </Text>
          <Text style={{ textAlign: "center", color: "rgba(255,255,255,0.55)", fontSize: 11 }}>
            dan Informasi Birokrasi
          </Text>
        </View>
      </View>
    );
  }
  return hasToken ? <Redirect href="/(user)/(tabs)/dashboard" /> : <Redirect href="/(auth)/login" />;
}
