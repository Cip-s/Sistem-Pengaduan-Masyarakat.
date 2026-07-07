import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import LaporanCard from "../../../components/LaporanCard";
import { AppStyles } from "../../../components/ui/AppStyles";
import Screen from "../../../components/ui/Screen";
import { getProfile } from "../../../lib/auth";
import { apiFetch } from "../../../lib/api";

export default function Dashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [p, laporan, statistik] = await Promise.all([
          getProfile().catch(() => null),
          apiFetch("/api/laporan"),
          apiFetch("/api/laporan/statistik"),
        ]);
        if (!mounted) return;
        setProfile(p);
        setItems(Array.isArray(laporan) ? laporan : []);
        setStats(statistik);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Gagal memuat data.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const headlineStats = useMemo(() => {
    const s = stats || { total: 0, diproses: 0, selesai: 0 };
    return [
      { label: "Total Laporan", value: s.total ?? 0 },
      { label: "Diproses", value: s.diproses ?? 0 },
      { label: "Selesai", value: s.selesai ?? 0 },
    ];
  }, [stats]);

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
          <View
            style={{
              position: "absolute",
              left: -40,
              bottom: -50,
              width: 140,
              height: 140,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.10)",
            }}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontWeight: "800" }}>
                Selamat datang kembali,
              </Text>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "900", marginTop: 4 }} numberOfLines={1}>
                {profile?.username || "Warga"}
              </Text>
            </View>

            <Link href="/(user)/(tabs)/profile" asChild>
              <Pressable
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.16)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="person-outline" size={20} color="#FFFFFF" />
              </Pressable>
            </Link>
          </View>

          <View style={{ height: 14 }} />
          <View style={{ flexDirection: "row", gap: 10 }}>
            {headlineStats.map((c) => (
              <View
                key={c.label}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.16)",
                  borderRadius: 14,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.18)",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 18 }}>{c.value}</Text>
                <Text style={{ marginTop: 2, color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: "700" }}>
                  {c.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[AppStyles.card, { marginTop: 14 }]}>
          <Text style={{ fontWeight: "900", color: "#0F172A" }}>AKSI CEPAT</Text>
          <View style={{ height: 10 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
            {[
              { label: "Buat Laporan", icon: "add-outline" as const, href: "/(user)/(tabs)/buat" as const },
              { label: "Lacak Status", icon: "search-outline" as const, href: "/(user)/(tabs)/riwayat" as const },
              { label: "Riwayat", icon: "time-outline" as const, href: "/(user)/(tabs)/riwayat" as const },
              { label: "Profil", icon: "person-outline" as const, href: "/(user)/(tabs)/profile" as const },
            ].map((a) => (
              <Link key={a.label} href={a.href} asChild>
                <Pressable style={{ flex: 1, alignItems: "center", gap: 8, paddingVertical: 10 }}>
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      backgroundColor: "#EEF2FF",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name={a.icon} size={20} color="#0B5ED7" />
                  </View>
                  <Text
                    style={{ fontSize: 11, fontWeight: "900", color: "#334155", textAlign: "center" }}
                    numberOfLines={2}
                  >
                    {a.label}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <View style={[AppStyles.card, { marginTop: 14, backgroundColor: "#EFF6FF", borderColor: "#DBEAFE" }]}>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: "#0B5ED7",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="chatbubbles-outline" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "900", color: "#0F172A" }}>Laporan Anda Penting!</Text>
              <Text style={{ marginTop: 4, color: "#475569" }} numberOfLines={2}>
                Bantu pemerintah memperbaiki layanan publik di sekitar Anda.
              </Text>
              <View style={{ height: 10 }} />
              <Link href="/(user)/(tabs)/buat" asChild>
                <Pressable
                  style={{
                    alignSelf: "flex-start",
                    paddingVertical: 9,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    backgroundColor: "#0B5ED7",
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>Buat Laporan</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={AppStyles.h2}>Laporan Terbaru</Text>
          <Link href="/(user)/(tabs)/riwayat" style={{ color: "#0B5ED7", fontWeight: "900" }}>
            Lihat Semua
          </Link>
        </View>

        {loading ? (
          <View style={[AppStyles.card, { marginTop: 10 }]}>
            <Text style={AppStyles.p}>Memuat...</Text>
          </View>
        ) : error ? (
          <View style={[AppStyles.card, { marginTop: 10, borderColor: "#FECACA" }]}>
            <Text style={{ color: "#B91C1C" }}>{error}</Text>
          </View>
        ) : (
          <View style={{ marginTop: 10, gap: 10 }}>
            {items.slice(0, 3).map((r) => (
              <Link key={r.id} href={{ pathname: "/(user)/laporan/[id]", params: { id: String(r.id) } }} asChild>
                <LaporanCard item={r} />
              </Link>
            ))}
          </View>
        )}

      </View>
    </Screen>
  );
}
