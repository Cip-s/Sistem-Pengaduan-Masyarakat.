import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import LaporanCard from "../../../components/LaporanCard";
import { AppStyles } from "../../../components/ui/AppStyles";
import Screen from "../../../components/ui/Screen";
import { apiFetch } from "../../../lib/api";

function toStatusLabel(status?: string) {
  if (!status) return "Pending";
  const val = String(status).toLowerCase();
  if (val.includes("proses")) return "Diproses";
  if (val.includes("selesai")) return "Selesai";
  if (val.includes("tolak")) return "Ditolak";
  if (val.includes("pending") || val.includes("tunggu")) return "Pending";
  return status;
}

const FILTERS = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "diproses", label: "Diproses" },
  { key: "selesai", label: "Selesai" },
  { key: "ditolak", label: "Ditolak" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function Riwayat() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch("/api/laporan");
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
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

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    let out = items;
    if (filter !== "all") {
      out = out.filter((r) => {
        const s = toStatusLabel(r?.status);
        if (filter === "pending") return s === "Pending";
        if (filter === "diproses") return s === "Diproses";
        if (filter === "selesai") return s === "Selesai";
        if (filter === "ditolak") return s === "Ditolak";
        return true;
      });
    }
    if (!qq) return out;
    return out.filter((r) => {
      const h = String(r?.header || "").toLowerCase();
      const b = String(r?.body || "").toLowerCase();
      return h.includes(qq) || b.includes(qq);
    });
  }, [items, q, filter]);

  return (
    <Screen contentContainerStyle={{ paddingBottom: 18 }}>
      <View style={[AppStyles.container, { paddingTop: 10 }]}>
        <Text style={AppStyles.h1}>Riwayat Pengaduan</Text>
        <Text style={[AppStyles.p, { marginTop: 6 }]}>Pantau semua pengaduan yang telah Anda sampaikan.</Text>

        <View style={{ height: 12 }} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 12,
          }}
        >
          <Ionicons name="search-outline" size={18} color="#64748B" />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Cari pengaduan..."
            style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 14, color: "#0F172A" }}
          />
          {q ? (
            <Pressable onPress={() => setQ("")} style={{ padding: 6 }}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          ) : null}
        </View>

        <View style={{ height: 12 }} />
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {FILTERS.map((f) => {
            const active = f.key === filter;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: active ? "#93C5FD" : "#E2E8F0",
                  backgroundColor: active ? "#0B5ED7" : "#FFFFFF",
                }}
              >
                <Text style={{ fontWeight: "900", color: active ? "#FFFFFF" : "#475569", fontSize: 12 }}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 12 }} />
        {loading ? (
          <View style={AppStyles.card}>
            <Text style={AppStyles.p}>Memuat...</Text>
          </View>
        ) : error ? (
          <View style={[AppStyles.card, { borderColor: "#FECACA" }]}>
            <Text style={{ color: "#B91C1C" }}>{error}</Text>
          </View>
        ) : filtered.length ? (
          <View style={{ gap: 10 }}>
            {filtered.map((r) => (
              <Link key={r.id} href={{ pathname: "/(user)/laporan/[id]", params: { id: String(r.id) } }} asChild>
                <LaporanCard item={r} />
              </Link>
            ))}
          </View>
        ) : (
          <View style={[AppStyles.card, { backgroundColor: "#F1F5F9" }]}>
            <Text style={{ textAlign: "center", color: "#64748B" }}>Belum ada pengaduan.</Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

