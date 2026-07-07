import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { AppStyles } from "../../../components/ui/AppStyles";
import Screen from "../../../components/ui/Screen";
import { apiFetch } from "../../../lib/api";
import { getApiBaseUrl } from "../../../lib/config";

type StepKey = "kategori" | "detail" | "bukti" | "review";
const steps: { key: StepKey; label: string }[] = [
  { key: "kategori", label: "Kategori" },
  { key: "detail", label: "Detail" },
  { key: "bukti", label: "Bukti" },
  { key: "review", label: "Review" },
];

function iconForCategory(name?: string): keyof typeof Ionicons.glyphMap {
  const n = String(name || "").toLowerCase();
  if (n.includes("infra")) return "build-outline";
  if (n.includes("sanit") || n.includes("air")) return "water-outline";
  if (n.includes("aman") || n.includes("keamanan")) return "shield-outline";
  if (n.includes("lingkung")) return "leaf-outline";
  if (n.includes("sehat")) return "medkit-outline";
  if (n.includes("didik") || n.includes("pendidikan")) return "school-outline";
  if (n.includes("transport")) return "bus-outline";
  if (n.includes("layan")) return "briefcase-outline";
  return "grid-outline";
}

export default function Buat() {
  const router = useRouter();
  const [step, setStep] = useState<StepKey>("kategori");
  const [categories, setCategories] = useState<any[]>([]);
  const [kategoriId, setKategoriId] = useState<string>("");
  const [judul, setJudul] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiFetch("/api/kategori");
        if (!mounted) return;
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const currentIndex = useMemo(() => steps.findIndex((s) => s.key === step), [step]);
  const selectedCategory = useMemo(
    () => categories.find((c) => String(c.id) === String(kategoriId)),
    [categories, kategoriId]
  );

  const bodyText = useMemo(() => {
    return `Lokasi: ${lokasi}\n\nDeskripsi:\n${deskripsi}`;
  }, [lokasi, deskripsi]);

  async function pickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert("Izin", "Izin akses galeri dibutuhkan.");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
    });
    if (!res.canceled) setImage(res.assets[0]);
  }

  function next() {
    if (step === "kategori") {
      if (!kategoriId) return Alert.alert("Validasi", "Pilih kategori terlebih dahulu.");
      setStep("detail");
      return;
    }
    if (step === "detail") {
      if (!judul.trim()) return Alert.alert("Validasi", "Judul wajib diisi.");
      if (deskripsi.trim().length < 50) return Alert.alert("Validasi", "Deskripsi minimal 50 karakter.");
      if (!lokasi.trim()) return Alert.alert("Validasi", "Lokasi wajib diisi.");
      setStep("bukti");
      return;
    }
    if (step === "bukti") {
      setStep("review");
      return;
    }
  }

  function back() {
    if (step === "kategori") return router.back();
    const idx = Math.max(0, currentIndex - 1);
    setStep(steps[idx].key);
  }

  async function submit() {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("header", judul);
      fd.append("body", bodyText);
      if (kategoriId) fd.append("category_id", kategoriId);
      if (image?.uri) {
        // @ts-expect-error FormData file for RN
        fd.append("image", { uri: image.uri, name: "upload.jpg", type: "image/jpeg" });
      }
      await apiFetch("/api/laporan", { method: "POST", body: fd });
      Alert.alert("Sukses", "Pengaduan berhasil dikirim.");
      router.replace("/(user)/(tabs)/riwayat");
    } catch (e: any) {
      Alert.alert("Gagal", e?.message || "Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen contentContainerStyle={{ paddingBottom: 18 }}>
      <View style={[AppStyles.container, { paddingTop: 10 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Pressable onPress={back} style={{ paddingVertical: 8, paddingHorizontal: 6 }}>
            <Ionicons name="chevron-back" size={22} color="#0B5ED7" />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontWeight: "900", color: "#0F172A" }}>Buat Pengaduan</Text>
            <Text style={{ marginTop: 2, color: "#64748B", fontSize: 12 }}>
              Langkah {currentIndex + 1} dari {steps.length}
            </Text>
          </View>
          <View style={{ width: 34 }} />
        </View>

        <View style={{ marginTop: 12, flexDirection: "row", gap: 8 }}>
          {steps.map((s, idx) => {
            const active = idx <= currentIndex;
            return (
              <View key={s.key} style={{ flex: 1 }}>
                <View
                  style={{
                    height: 5,
                    borderRadius: 999,
                    backgroundColor: active ? "#0B5ED7" : "#E2E8F0",
                  }}
                />
                <Text style={{ marginTop: 6, fontSize: 11, fontWeight: "800", color: active ? "#0B5ED7" : "#94A3B8", textAlign: "center" }}>
                  {s.label}
                </Text>
              </View>
            );
          })}
        </View>

        {step === "kategori" ? (
          <View style={{ marginTop: 14 }}>
            <Text style={AppStyles.h2}>Pilih Kategori Pengaduan</Text>
            <View style={{ height: 12 }} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {categories.map((c) => {
                const selected = String(c.id) === String(kategoriId);
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setKategoriId(String(c.id))}
                    style={{
                      width: "48%",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: selected ? "#93C5FD" : "#E2E8F0",
                      backgroundColor: selected ? "#EFF6FF" : "#FFFFFF",
                      padding: 14,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 12,
                          backgroundColor: "#F1F5F9",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name={iconForCategory(c.category_name)} size={18} color="#0B5ED7" />
                      </View>
                      <Text style={{ fontWeight: "900", color: "#0F172A", flex: 1 }} numberOfLines={2}>
                        {c.category_name}
                      </Text>
                    </View>
                    <Ionicons name={selected ? "checkmark-circle" : "ellipse-outline"} size={20} color={selected ? "#0B5ED7" : "#CBD5E1"} />
                  </Pressable>
                );
              })}
            </View>
            <View style={{ height: 16 }} />
            <Pressable style={AppStyles.btnPrimary} onPress={next}>
              <Text style={AppStyles.btnPrimaryText}>Lanjutkan</Text>
            </Pressable>
          </View>
        ) : null}

        {step === "detail" ? (
          <View style={{ marginTop: 14 }}>
            <View style={[AppStyles.card]}>
              <Text style={AppStyles.label}>JUDUL PENGADUAN</Text>
              <TextInput
                value={judul}
                onChangeText={setJudul}
                style={AppStyles.input}
                placeholder="Deskripsikan masalah secara singkat"
              />

              <View style={{ height: 12 }} />
              <Text style={AppStyles.label}>DESKRIPSI LENGKAP</Text>
              <TextInput
                value={deskripsi}
                onChangeText={setDeskripsi}
                style={[AppStyles.input, { height: 120, textAlignVertical: "top" }]}
                placeholder="Jelaskan masalah secara detail: lokasi, waktu kejadian, dampak yang ditimbulkan..."
                multiline
              />
              <Text style={{ marginTop: 6, color: "#94A3B8", fontSize: 12 }}>
                {Math.max(0, 50 - deskripsi.trim().length)} karakter lagi untuk memenuhi minimal.
              </Text>

              <View style={{ height: 12 }} />
              <Text style={AppStyles.label}>LOKASI KEJADIAN</Text>
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
                <Ionicons name="location-outline" size={18} color="#64748B" />
                <TextInput
                  value={lokasi}
                  onChangeText={setLokasi}
                  placeholder="Nama jalan, kelurahan, kecamatan..."
                  style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 14, color: "#0F172A" }}
                />
              </View>
            </View>

            <View style={{ height: 16 }} />
            <Pressable style={AppStyles.btnPrimary} onPress={next}>
              <Text style={AppStyles.btnPrimaryText}>Lanjutkan</Text>
            </Pressable>
          </View>
        ) : null}

        {step === "bukti" ? (
          <View style={{ marginTop: 14 }}>
            <View style={[AppStyles.card]}>
              <Text style={{ fontWeight: "900", color: "#0F172A" }}>Unggah Bukti Foto / Video</Text>
              <Text style={{ marginTop: 4, color: "#64748B", fontSize: 12 }}>
                Maks. 5 file • JPG, PNG • Maks. 10MB/file
              </Text>

              <View style={{ height: 14 }} />
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={pickImage}
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    backgroundColor: "#FFFFFF",
                    padding: 14,
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <View style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="cloud-upload-outline" size={22} color="#0B5ED7" />
                  </View>
                  <Text style={{ fontWeight: "900", color: "#0F172A" }}>Unggah</Text>
                </Pressable>

                <View
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: image ? "#86EFAC" : "#E2E8F0",
                    backgroundColor: image ? "#ECFDF5" : "#FFFFFF",
                    padding: 14,
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <View style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: image ? "#BBF7D0" : "#F1F5F9", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name={image ? "checkmark" : "image-outline"} size={22} color={image ? "#166534" : "#64748B"} />
                  </View>
                  <Text style={{ fontWeight: "900", color: "#0F172A" }}>{image ? "Terpilih" : "Preview"}</Text>
                </View>
              </View>

              {image ? (
                <>
                  <View style={{ height: 12 }} />
                  <View style={{ borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "#E2E8F0" }}>
                    <Image
                      source={{ uri: image.uri }}
                      style={{ width: "100%", height: 180, backgroundColor: "#F1F5F9" }}
                      contentFit="cover"
                    />
                  </View>
                </>
              ) : null}

              <View style={{ height: 14 }} />
              <View style={{ borderRadius: 16, borderWidth: 1, borderColor: "#DBEAFE", backgroundColor: "#EFF6FF", padding: 14 }}>
                <Text style={{ fontWeight: "900", color: "#0F172A" }}>Tips Foto yang Baik</Text>
                <View style={{ height: 10 }} />
                {[
                  "Foto harus jelas dan tidak buram",
                  "Pastikan konteks lokasi terlihat",
                  "Hindari wajah orang tanpa izin",
                ].map((t) => (
                  <View key={t} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start", marginTop: 6 }}>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#0B5ED7" />
                    <Text style={{ color: "#334155", flex: 1 }}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ height: 16 }} />
            <Pressable style={AppStyles.btnPrimary} onPress={next}>
              <Text style={AppStyles.btnPrimaryText}>Lanjutkan</Text>
            </Pressable>
          </View>
        ) : null}

        {step === "review" ? (
          <View style={{ marginTop: 14 }}>
            <View style={[AppStyles.card]}>
              <Text style={AppStyles.h2}>Ringkasan Pengaduan</Text>
              <View style={{ height: 12 }} />

              <View style={{ borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#FFFFFF", padding: 14 }}>
                {[
                  { k: "Kategori", v: selectedCategory?.category_name || "-" },
                  { k: "Judul", v: judul || "-" },
                  { k: "Lokasi", v: lokasi || "-" },
                  { k: "Lampiran", v: image ? "1 foto dilampirkan" : "Tidak ada" },
                ].map((row) => (
                  <View key={row.k} style={{ flexDirection: "row", justifyContent: "space-between", gap: 10, marginTop: 8 }}>
                    <Text style={{ color: "#64748B" }}>{row.k}</Text>
                    <Text style={{ fontWeight: "900", color: "#0F172A", flex: 1, textAlign: "right" }} numberOfLines={2}>
                      {row.v}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={{ height: 12 }} />
              <View style={{ borderRadius: 16, borderWidth: 1, borderColor: "#FDE68A", backgroundColor: "#FFFBEB", padding: 14 }}>
                <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
                  <Ionicons name="information-circle-outline" size={20} color="#92400E" />
                  <Text style={{ color: "#92400E", flex: 1 }}>
                    Pastikan informasi akurat. Laporan palsu dapat dikenakan sanksi sesuai peraturan berlaku.
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ height: 16 }} />
            <Pressable
              style={[AppStyles.btnPrimary, { backgroundColor: "#16A34A" }]}
              onPress={submitting ? undefined : submit}
            >
              <Text style={AppStyles.btnPrimaryText}>{submitting ? "Mengirim..." : "Kirim Pengaduan"}</Text>
            </Pressable>

            {image?.uri ? (
              <Text style={{ marginTop: 12, color: "#94A3B8", fontSize: 12, textAlign: "center" }}>
                Upload akan dikirim ke: {getApiBaseUrl()}/uploads
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

