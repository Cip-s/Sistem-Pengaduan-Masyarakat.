import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppStyles } from "../../../components/ui/AppStyles";
import { apiFetch } from "../../../lib/api";
import StatusBadge from "../../../components/StatusBadge";
import { Image } from "expo-image";
import { getApiBaseUrl } from "../../../lib/config";
import Screen from "../../../components/ui/Screen";

function toStatusLabel(status?: string) {
  if (!status) return "Pending";
  const val = String(status).toLowerCase();
  if (val.includes("proses")) return "Diproses";
  if (val.includes("selesai")) return "Selesai";
  if (val.includes("tolak")) return "Ditolak";
  if (val.includes("pending") || val.includes("tunggu")) return "Pending";
  return status;
}

function extractLokasi(bodyText?: string) {
  if (!bodyText) return "-";
  const m = String(bodyText).match(/^\s*Lokasi:\s*(.+)\s*$/m);
  return m?.[1]?.trim() || "-";
}

export default function LaporanDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch(`/api/laporan/${id}`);
        if (mounted) setItem(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Gagal memuat detail.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const comments = useMemo(() => (Array.isArray(item?.komentar) ? item.komentar : []), [item]);
  const imageUrl = item?.image ? `${getApiBaseUrl()}/uploads/${item.image}` : "";

  async function postComment() {
    if (!comment.trim()) return;
    setPosting(true);
    try {
      await apiFetch(`/api/komentar/${id}`, {
        method: "POST",
        body: JSON.stringify({ body: comment }),
      });
      setComment("");
      const data = await apiFetch(`/api/laporan/${id}`);
      setItem(data);
    } catch (e: any) {
      Alert.alert("Gagal", e?.message || "Gagal kirim komentar.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <Screen contentContainerStyle={{ paddingBottom: 18 }}>
      <View style={[AppStyles.container, { paddingTop: 10 }]}>
        <Pressable
          onPress={() => router.back()}
          style={{ alignSelf: "flex-start", paddingVertical: 6, paddingHorizontal: 2 }}
        >
          <Text style={{ color: "#0B5ED7", fontWeight: "800" }}>&lt;- Kembali</Text>
        </Pressable>
        {loading ? (
          <View style={AppStyles.card}>
            <Text style={AppStyles.p}>Memuat...</Text>
          </View>
        ) : error ? (
          <View style={[AppStyles.card, { borderColor: "#FECACA" }]}>
            <Text style={{ color: "#B91C1C" }}>{error}</Text>
          </View>
        ) : (
          <>
            <View style={[AppStyles.card, { backgroundColor: "#EFF6FF", borderColor: "#DBEAFE" }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "900", color: "#0F172A" }}>
                    {item?.header || "-"}
                  </Text>
                  <Text style={{ marginTop: 6, color: "#64748B", fontSize: 12 }}>
                    Dibuat: {item?.created_at || "-"} • {item?.category_name || "-"}
                  </Text>
                </View>
                <StatusBadge status={toStatusLabel(item?.status)} />
              </View>
            </View>

            <View style={[AppStyles.card, { marginTop: 12 }]}>
              <Text style={AppStyles.label}>Deskripsi Pengaduan</Text>
              <Text style={[AppStyles.p, { marginTop: 8 }]}>{item?.body || "-"}</Text>
            </View>

            {imageUrl ? (
              <View style={[AppStyles.card, { marginTop: 12 }]}>
                <Text style={AppStyles.label}>Bukti Foto</Text>
                <View style={{ marginTop: 10, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#E2E8F0" }}>
                  <Image source={{ uri: imageUrl }} style={{ width: "100%", aspectRatio: 16 / 9 }} contentFit="cover" />
                </View>
              </View>
            ) : null}

            <View style={[AppStyles.card, { marginTop: 12 }]}>
              <Text style={AppStyles.label}>Lokasi Kejadian</Text>
              <Text style={[AppStyles.p, { marginTop: 8 }]}>{extractLokasi(item?.body)}</Text>
            </View>

            <View style={[AppStyles.card, { marginTop: 12 }]}>
              <Text style={AppStyles.h2}>Timeline</Text>
              <View style={{ marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", padding: 12 }}>
                <Text style={{ fontWeight: "900", color: "#0F172A" }}>Pengaduan Dibuat</Text>
                <Text style={{ marginTop: 4, color: "#64748B", fontSize: 12 }}>
                  {item?.created_at || "-"}
                </Text>
              </View>
            </View>

            <View style={[AppStyles.card, { marginTop: 12 }]}>
              <Text style={AppStyles.h2}>Informasi Pelapor</Text>
              <View style={{ marginTop: 10, gap: 10 }}>
                <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", padding: 12 }}>
                  <Text style={{ color: "#64748B", fontSize: 12 }}>Nama</Text>
                  <Text style={{ marginTop: 4, fontWeight: "900", color: "#0F172A" }}>{item?.username || "-"}</Text>
                </View>
                <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", padding: 12 }}>
                  <Text style={{ color: "#64748B", fontSize: 12 }}>Email</Text>
                  <Text style={{ marginTop: 4, fontWeight: "900", color: "#0F172A" }}>{item?.email || "-"}</Text>
                </View>
              </View>
            </View>

            <View style={[AppStyles.card, { marginTop: 12 }]}>
              <Text style={AppStyles.h2}>Komentar ({comments.length})</Text>
              <View style={{ marginTop: 10, gap: 10 }}>
                {comments.length ? (
                  comments.map((c: any, idx: number) => (
                    <View key={c?.id || idx} style={[AppStyles.card]}>
                      <Text style={{ fontWeight: "900", color: "#0F172A" }}>
                        {c?.username || "Pengguna"}
                      </Text>
                      <Text style={{ marginTop: 6, color: "#334155" }}>{c?.body || "-"}</Text>
                    </View>
                  ))
                ) : (
                  <View style={[AppStyles.card, { backgroundColor: "#F1F5F9" }]}>
                    <Text style={{ textAlign: "center", color: "#64748B" }}>Belum ada komentar</Text>
                  </View>
                )}
              </View>

              <View style={{ marginTop: 12 }}>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Tulis komentar..."
                  style={[AppStyles.input, { height: 96, textAlignVertical: "top" }]}
                  multiline
                />
                <View style={{ height: 10 }} />
                <Pressable style={AppStyles.btnPrimary} onPress={posting ? undefined : postComment}>
                  <Text style={AppStyles.btnPrimaryText}>
                    {posting ? "Mengirim..." : "Kirim Komentar"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
      </View>
    </Screen>
  );
}
