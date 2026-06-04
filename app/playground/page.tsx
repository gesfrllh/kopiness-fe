'use client'

import React, { useMemo, useState } from "react";

const ICONS: Record<string, string> = {
  file: "📄",
  message: "💬",
  check: "✓",
  clock: "⏱",
  alert: "⚠",
  download: "↓",
  send: "➤",
  scale: "⚖",
  building: "🏢",
  user: "👤",
  upload: "⇧",
  history: "↺",
  paperclip: "📎",
  lock: "🔒",
  branch: "⑂",
  merge: "⇄",
  shield: "🛡",
  play: "▶",
};

const agreement = {
  id: "DP-2026-0018",
  sp2k: "SP2K-LEG-2026-0042",
  title: "Perjanjian Pengadaan Jasa Konsultasi IT",
  vendor: "PT Mitra Solusi Digital",
  requester: "Divisi Teknologi Informasi",
  legalPic: "Ayu Prameswari",
  value: "Rp 850.000.000",
};

const simulationSteps = [
  {
    id: 0,
    title: "Legal kirim draft awal",
    actor: "Legal",
    icon: "scale",
    mainDraft: "v3 Baseline Legal",
    status: "Draft utama terkunci",
    explanation: "Legal mengirim draft pertama ke Rekanan dan User. Draft ini menjadi baseline. Tidak ada pihak yang boleh menimpa file utama ini.",
  },
  {
    id: 1,
    title: "Rekanan balas revisi",
    actor: "Rekanan",
    icon: "building",
    mainDraft: "v3 Baseline Legal",
    status: "Cabang Rekanan dibuat",
    explanation: "Rekanan mengunggah dokumen revisi. Sistem menyimpannya sebagai cabang R-1, bukan mengganti draft utama v3.",
  },
  {
    id: 2,
    title: "User Pengaju balas masukan",
    actor: "User Pengaju",
    icon: "user",
    mainDraft: "v3 Baseline Legal",
    status: "Cabang User dibuat",
    explanation: "User Pengaju memberi masukan atau upload lampiran. Sistem menyimpannya sebagai cabang U-1. File Rekanan tetap aman, file utama juga tetap aman.",
  },
  {
    id: 3,
    title: "Legal bandingkan revisi",
    actor: "Legal",
    icon: "merge",
    mainDraft: "v3 Baseline Legal",
    status: "Menunggu keputusan merge",
    explanation: "Legal melihat perbandingan: draft utama v3, revisi Rekanan R-1, dan masukan User U-1. Legal memilih perubahan mana yang diterima.",
  },
  {
    id: 4,
    title: "Legal terbitkan draft gabungan",
    actor: "Legal",
    icon: "check",
    mainDraft: "v3.1 Draft Gabungan Legal",
    status: "Draft utama versi baru",
    explanation: "Setelah merge, Legal menerbitkan v3.1. Baseline baru adalah v3.1. Kalau ada revisi lagi, Rekanan dan User membalas dari v3.1, bukan dari R-1 atau U-1 lama.",
  },
];

const discussionRooms = [
  {
    id: "legal-vendor",
    title: "Room Legal ↔ Rekanan",
    subtitle: "Diskusi klausul komersial, termin, kewajiban rekanan, dan lampiran dari vendor.",
    participants: ["Legal", "Rekanan"],
    branch: "R-1",
    icon: "building",
  },
  {
    id: "legal-user",
    title: "Room Legal ↔ User Pengaju",
    subtitle: "Diskusi scope pekerjaan, milestone, SLA, deliverable, dan validasi kebutuhan user.",
    participants: ["Legal", "User Pengaju"],
    branch: "U-1",
    icon: "user",
  },
];

const allThreadItems = [
  {
    step: 0,
    roomId: "legal-vendor",
    role: "Legal",
    name: "Ayu Prameswari",
    icon: "scale",
    type: "Baseline Draft",
    title: "Legal mengirim Draft v3 ke Rekanan",
    text: "Berikut Draft Perjanjian v3 untuk direview dari sisi Rekanan. Mohon masukan terkait termin, kewajiban, dan klausul komersial.",
    attachment: "Draft Perjanjian v3 - Baseline Legal.docx",
    branch: "MAIN",
    target: "Keseluruhan Dokumen",
  },
  {
    step: 0,
    roomId: "legal-user",
    role: "Legal",
    name: "Ayu Prameswari",
    icon: "scale",
    type: "Baseline Draft",
    title: "Legal mengirim Draft v3 ke User Pengaju",
    text: "Berikut Draft Perjanjian v3 untuk direview dari sisi User Pengaju. Mohon validasi scope, deliverable, SLA, dan milestone pekerjaan.",
    attachment: "Draft Perjanjian v3 - Baseline Legal.docx",
    branch: "MAIN",
    target: "Keseluruhan Dokumen",
  },
  {
    step: 1,
    roomId: "legal-vendor",
    role: "Rekanan",
    name: "PT Mitra Solusi Digital",
    icon: "building",
    type: "Revisi Dokumen",
    title: "Rekanan mengusulkan perubahan termin",
    text: "Kami mengusulkan termin pembayaran menjadi 40%-30%-30% sesuai milestone implementasi.",
    attachment: "R-1 Masukan Rekanan atas Draft v3.docx",
    branch: "R-1",
    target: "Pasal 6 - Termin Pembayaran",
  },
  {
    step: 2,
    roomId: "legal-user",
    role: "User Pengaju",
    name: "Divisi Teknologi Informasi",
    icon: "user",
    type: "Masukan User",
    title: "User memvalidasi scope dan milestone",
    text: "Termin 40%-30%-30% dapat diterima selama deliverable tahap pertama mencakup kickoff, desain solusi, dan rencana implementasi.",
    attachment: "U-1 Masukan User atas Draft v3.pdf",
    branch: "U-1",
    target: "Lampiran Scope of Work",
  },
  {
    step: 3,
    roomId: "legal-vendor",
    role: "Legal",
    name: "Ayu Prameswari",
    icon: "merge",
    type: "Review Merge",
    title: "Legal menandai masukan Rekanan untuk merge",
    text: "Revisi Rekanan diterima sebagian dan akan dibandingkan dengan validasi dari User Pengaju di proses merge Legal.",
    attachment: null,
    branch: "REVIEW",
    target: "Pasal 6 - Termin Pembayaran",
  },
  {
    step: 3,
    roomId: "legal-user",
    role: "Legal",
    name: "Ayu Prameswari",
    icon: "merge",
    type: "Review Merge",
    title: "Legal menandai masukan User untuk merge",
    text: "Catatan User dimasukkan sebagai syarat deliverable tahap pertama dan akan digabungkan oleh Legal.",
    attachment: null,
    branch: "REVIEW",
    target: "Lampiran Scope of Work",
  },
  {
    step: 4,
    roomId: "legal-vendor",
    role: "Legal",
    name: "Ayu Prameswari",
    icon: "check",
    type: "Draft Gabungan",
    title: "Legal menerbitkan v3.1 ke Rekanan",
    text: "Draft gabungan v3.1 sudah dibuat berdasarkan hasil merge Legal dan dikirim ke Rekanan untuk diketahui/review lanjutan bila diperlukan.",
    attachment: "Draft Gabungan Legal v3.1.docx",
    branch: "MAIN",
    target: "Keseluruhan Dokumen",
  },
  {
    step: 4,
    roomId: "legal-user",
    role: "Legal",
    name: "Ayu Prameswari",
    icon: "check",
    type: "Draft Gabungan",
    title: "Legal menerbitkan v3.1 ke User Pengaju",
    text: "Draft gabungan v3.1 sudah dibuat berdasarkan hasil merge Legal dan dikirim ke User Pengaju untuk validasi akhir bila diperlukan.",
    attachment: "Draft Gabungan Legal v3.1.docx",
    branch: "MAIN",
    target: "Keseluruhan Dokumen",
  },
];

const revisionTargets = [
  "Pasal 1 - Para Pihak",
  "Pasal 2 - Ruang Lingkup Pekerjaan",
  "Pasal 6 - Termin Pembayaran",
  "Pasal 8 - SLA dan Kewajiban Rekanan",
  "Lampiran Scope of Work",
  "Lampiran Jadwal & Milestone",
  "Keseluruhan Dokumen",
];

const baseDraftSections = [
  {
    title: "Pasal 6 - Termin Pembayaran",
    before: "Pembayaran dilakukan 30% setelah kickoff, 40% setelah implementasi tahap pertama, dan 30% setelah pekerjaan selesai.",
    vendor: "Rekanan mengusulkan 40% setelah kickoff, 30% setelah implementasi tahap pertama, dan 30% setelah pekerjaan selesai.",
    user: "User setuju 40%-30%-30%, tetapi tahap pertama wajib mencakup kickoff, desain solusi, dan rencana implementasi.",
    merged: "Pembayaran dilakukan 40% setelah kickoff dan dokumen desain solusi disetujui, 30% setelah implementasi tahap pertama, dan 30% setelah pekerjaan selesai serta BAST ditandatangani.",
  },
  {
    title: "Lampiran Scope of Work",
    before: "Scope pekerjaan mengikuti lampiran SP2K.",
    vendor: "Tidak ada revisi dari Rekanan.",
    user: "User menambahkan deliverable desain solusi dan laporan progres mingguan.",
    merged: "Scope pekerjaan mengikuti lampiran SP2K, termasuk desain solusi, laporan progres mingguan, dan dokumen rencana implementasi.",
  },
];

const versionFlow = [
  { version: "v3", label: "Baseline Legal", owner: "Legal", branch: "MAIN", step: 0 },
  { version: "R-1", label: "Revisi Rekanan", owner: "Rekanan", branch: "CABANG", step: 1 },
  { version: "U-1", label: "Masukan User", owner: "User Pengaju", branch: "CABANG", step: 2 },
  { version: "Review", label: "Compare & Merge", owner: "Legal", branch: "LEGAL", step: 3 },
  { version: "v3.1", label: "Draft Gabungan", owner: "Legal", branch: "MAIN", step: 4 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getVisibleThreads(items: any[], activeStep: number, roomId: string) {
  return items.filter((item) => item.step <= activeStep && item.roomId === roomId);
}

function getCurrentMainDraft(activeStep: number) {
  return activeStep >= 4 ? "v3.1 Draft Gabungan Legal" : "v3 Baseline Legal";
}

function canPartyOverwriteMainDraft(role: string) {
  return role === "Legal";
}

function getBranchForRole(role: string) {
  if (role === "Rekanan") return "R-1";
  if (role === "User Pengaju") return "U-1";
  if (role === "Legal") return "MAIN";
  return "COMMENT";
}

function shouldShowMergeView(activeStep: number) {
  return activeStep >= 3;
}

function getRoomParticipants(roomId: string) {
  const room = discussionRooms.find((item) => item.id === roomId);
  return room ? room.participants : [];
}
function canParticipantAccessRoom(role: string, roomId: string) {
  return getRoomParticipants(roomId).includes(role);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasSeparatedDiscussionRooms(rooms: any[]) {
  return rooms.every((room) => (room as { participants: string[] }).participants.includes("Legal") && (room as { participants: string[] }).participants.length === 2);
}

function isValidRevisionTarget(target: string) {
  return revisionTargets.includes(target);
}

const __tests__ = {
  "visible threads follow active step in vendor room": () => getVisibleThreads(allThreadItems, 2, "legal-vendor").length === 2,
  "visible threads follow active step in user room": () => getVisibleThreads(allThreadItems, 2, "legal-user").length === 2,
  "main draft remains baseline before merge": () => getCurrentMainDraft(2) === "v3 Baseline Legal",
  "main draft changes after legal merge": () => getCurrentMainDraft(4) === "v3.1 Draft Gabungan Legal",
  "only legal can overwrite main draft": () => canPartyOverwriteMainDraft("Legal") && !canPartyOverwriteMainDraft("Rekanan") && !canPartyOverwriteMainDraft("User Pengaju"),
  "vendor and user have different branches": () => getBranchForRole("Rekanan") !== getBranchForRole("User Pengaju"),
  "merge view appears on legal compare step": () => shouldShowMergeView(3) === true,
  "discussion rooms are separated two-party rooms": () => hasSeparatedDiscussionRooms(discussionRooms) === true,
  "vendor cannot access legal user room": () => canParticipantAccessRoom("Rekanan", "legal-user") === false,
  "user cannot access legal vendor room": () => canParticipantAccessRoom("User Pengaju", "legal-vendor") === false,
  "revision target must be selected from known clauses": () => isValidRevisionTarget("Pasal 6 - Termin Pembayaran") === true && isValidRevisionTarget("Pasal Tidak Ada") === false,
};

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center leading-none ${className}`} role="img" aria-label={name}>
      {ICONS[name] || "•"}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[1.5rem] bg-white shadow-sm ${className}`}>{children}</div>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Button({ children, variant = "solid", className = "", ...props }: { children: React.ReactNode; variant?: string; className?: string; [key: string]: any }) {
  const variantClass =
    variant === "outline"
      ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      : variant === "soft"
        ? "border border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
        : "border border-slate-900 bg-slate-900 text-white hover:bg-slate-800";

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function StatusBadge({ children, tone = "slate" }: { children: React.ReactNode; tone?: string }) {
  const style = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-800",
    blue: "bg-blue-100 text-blue-800",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-100 text-rose-800",
    indigo: "bg-indigo-100 text-indigo-800",
  }[tone];

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>{children}</span>;
}

export default function SimulasiRevisiDokumenPerjanjian() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeRoomId, setActiveRoomId] = useState("legal-vendor");
  const [draftText, setDraftText] = useState("");
  const [draftFile, setDraftFile] = useState("");
  const [revisionTarget, setRevisionTarget] = useState("Pasal 6 - Termin Pembayaran");
  const [roomMessages, setRoomMessages] = useState<Record<string, unknown[]>>({});

  const currentStep = simulationSteps[activeStep];
  const baseThreads = useMemo(() => getVisibleThreads(allThreadItems, activeStep, activeRoomId), [activeStep, activeRoomId]);
  const extraThreads = roomMessages[activeRoomId] || [];
  const visibleThreads = [...baseThreads, ...extraThreads];

  const activeRoom = discussionRooms.find((room) => room.id === activeRoomId) || discussionRooms[0];
  const currentMainDraft = getCurrentMainDraft(activeStep);
  const showMerge = shouldShowMergeView(activeStep);

  function handleSend() {
    if (!draftText.trim()) return;

    const newItem = {
      step: activeStep,
      roomId: activeRoomId,
      role: "Legal",
      name: "Anda (Simulasi)",
      icon: "message",
      type: draftFile ? "Revisi Dokumen" : "Diskusi",
      title: draftFile ? "Mengirim revisi dokumen" : "Mengirim pesan diskusi",
      text: draftText,
      attachment: draftFile || null,
      branch: "COMMENT",
      target: revisionTarget,
    };

    setRoomMessages((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newItem],
    }));

    setDraftText("");
    setDraftFile("");
    setRevisionTarget("Pasal 6 - Termin Pembayaran");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
                <Icon name="play" /> Simulasi Alur Revisi Dokumen
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Anti Double Reply & Anti Tertimpa</h1>
              <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
                Simulasi ini menunjukkan bahwa room diskusi tidak boleh bertiga. Rekanan hanya berdiskusi dengan Legal, User Pengaju hanya berdiskusi dengan Legal, lalu Legal yang menggabungkan hasilnya.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:min-w-[520px] md:grid-cols-4">
              <SummaryCard value={agreement.id} label="Dokumen" />
              <SummaryCard value="v3" label="Baseline" />
              <SummaryCard value={currentMainDraft} label="Draft Utama Saat Ini" />
              <SummaryCard value={activeStep + 1 + "/5"} label="Langkah Simulasi" />
            </div>
          </div>
        </section>

        <Card>
          <div className="p-5 md:p-6">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Klik Langkah Simulasi</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Perhatikan bahwa ada dua room berbeda: <strong>Legal ↔ Rekanan</strong> dan <strong>Legal ↔ User Pengaju</strong>. Tidak ada room bertiga.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={activeStep === 0} onClick={() => setActiveStep((value) => Math.max(0, value - 1))}>
                  Sebelumnya
                </Button>
                <Button disabled={activeStep === simulationSteps.length - 1} onClick={() => setActiveStep((value) => Math.min(simulationSteps.length - 1, value + 1))}>
                  Berikutnya
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-5">
              {simulationSteps.map((step) => {
                const isActive = step.id === activeStep;
                const isDone = step.id < activeStep;
                return (
                  <button
                    type="button"
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${isActive ? "border-slate-900 bg-slate-900 text-white" : isDone ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50"
                      }`}
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-slate-800 shadow-sm">
                      <Icon name={step.icon} />
                    </div>
                    <p className="text-xs opacity-70">Langkah {step.id + 1}</p>
                    <h3 className="mt-1 text-sm font-bold leading-5">{step.title}</h3>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        <section className="grid gap-6 xl:grid-cols-[1fr_520px]">
          <div className="space-y-6">
            <Card>
              <div className="p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <StatusBadge tone="blue">{currentStep.actor}</StatusBadge>
                      <StatusBadge tone={activeStep >= 4 ? "green" : "amber"}>{currentStep.status}</StatusBadge>
                    </div>
                    <h2 className="text-2xl font-bold">{currentStep.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{currentStep.explanation}</p>
                  </div>
                  <div className="rounded-3xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
                    <p className="font-semibold">Draft utama:</p>
                    <p>{currentStep.mainDraft}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5 md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Peta Versi Dokumen</h3>
                    <p className="text-sm text-slate-500">R-1 dan U-1 tidak menimpa MAIN. Mereka hanya cabang masukan.</p>
                  </div>
                  <Icon name="branch" className="text-slate-400" />
                </div>

                <div className="space-y-3">
                  {versionFlow.map((item, index) => {
                    const visible = item.step <= activeStep;
                    const active = item.step === activeStep;
                    return (
                      <div key={item.version} className={`flex items-center gap-3 rounded-3xl border p-4 ${visible ? "border-slate-100 bg-white" : "border-slate-100 bg-slate-50 opacity-40"}`}>
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold ${active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>
                          {item.version}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{item.label}</p>
                            <StatusBadge tone={item.branch === "MAIN" ? "green" : item.branch === "CABANG" ? "blue" : "amber"}>{item.branch}</StatusBadge>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">Owner: {item.owner}</p>
                        </div>
                        {index < versionFlow.length - 1 && <Icon name="send" className="hidden text-slate-300 md:inline-flex" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5 md:p-6">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="font-semibold">Room Diskusi Terpisah</h3>
                    <p className="text-sm text-slate-500">Pilih room. Rekanan dan User tidak pernah berada di room yang sama.</p>
                  </div>
                  <StatusBadge tone="slate">{visibleThreads.length} aktivitas di room ini</StatusBadge>
                </div>

                <div className="mb-5 grid gap-3 md:grid-cols-2">
                  {discussionRooms.map((room) => {
                    const isActive = room.id === activeRoomId;
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setActiveRoomId(room.id)}
                        className={`rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${isActive ? "border-slate-900 bg-slate-900 text-white" : "border-slate-100 bg-slate-50"
                          }`}
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-slate-800 shadow-sm">
                            <Icon name={room.icon} />
                          </div>
                          <StatusBadge tone={isActive ? "indigo" : "blue"}>{room.branch}</StatusBadge>
                        </div>
                        <h4 className="font-bold">{room.title}</h4>
                        <p className={`mt-2 text-sm leading-6 ${isActive ? "text-slate-200" : "text-slate-500"}`}>{room.subtitle}</p>
                        <p className={`mt-3 text-xs font-semibold ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                          Peserta: {room.participants.join(" + ")}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mb-4 rounded-3xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                  <div className="flex gap-2">
                    <Icon name="shield" className="mt-0.5" />
                    <p>
                      Room aktif: <strong>{activeRoom.title}</strong>. Hanya peserta room ini yang bisa melihat dan membalas diskusi di sini.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {visibleThreads.map((item, idx) => (
                    <ThreadItem key={idx} item={item} />
                  ))}

                  <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 text-sm font-semibold text-slate-700">Kirim Diskusi di Room Ini</div>

                    <div className="mb-3">
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Bagian/Pasal yang dibahas</label>
                      <select
                        value={revisionTarget}
                        onChange={(e) => setRevisionTarget(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                      >
                        {revisionTargets.map((target) => (
                          <option key={target} value={target}>{target}</option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      placeholder="Tulis pesan diskusi atau penjelasan revisi..."
                      className="w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-slate-400"
                    />

                    <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <input
                        value={draftFile}
                        onChange={(e) => setDraftFile(e.target.value)}
                        placeholder="(Opsional) Nama file revisi..."
                        className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 md:max-w-xs"
                      />

                      <Button onClick={handleSend}>
                        <Icon name="send" className="mr-2" /> Kirim
                      </Button>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      Catatan: Jika isi file, sistem menganggap ini sebagai revisi dokumen (tidak menimpa draft utama).
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="sticky top-6">
              <div className="p-5 md:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">Preview Draft Utama</h3>
                    <p className="mt-1 text-sm text-slate-500">{currentMainDraft} · {agreement.value}</p>
                  </div>
                  <StatusBadge tone={activeStep >= 4 ? "green" : "indigo"}>{activeStep >= 4 ? "Sudah Merge" : "Terkunci"}</StatusBadge>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="border-b border-slate-200 pb-4 text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Draft Perjanjian</p>
                      <h4 className="mt-2 text-lg font-bold">{agreement.title}</h4>
                      <p className="mt-1 text-xs text-slate-500">Ref: {agreement.sp2k}</p>
                    </div>

                    <div className="mt-5 space-y-4">
                      {baseDraftSections.map((section) => (
                        <DraftCompareSection key={section.title} section={section} activeStep={activeStep} />
                      ))}
                    </div>
                  </div>
                </div>

                {!showMerge && (
                  <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <div className="flex gap-2">
                      <Icon name="lock" className="mt-0.5" />
                      <p>Draft utama belum berubah. Masukan Rekanan/User masih disimpan sebagai cabang terpisah.</p>
                    </div>
                  </div>
                )}

                {showMerge && activeStep < 4 && (
                  <div className="mt-4 rounded-3xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                    <div className="flex gap-2">
                      <Icon name="merge" className="mt-0.5" />
                      <p>Legal sedang membandingkan cabang Rekanan dan User. Draft utama baru belum dibuat sampai Legal klik merge.</p>
                    </div>
                  </div>
                )}

                {activeStep >= 4 && (
                  <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <div className="flex gap-2">
                      <Icon name="check" className="mt-0.5" />
                      <p>Merge selesai. v3.1 menjadi draft utama baru. Revisi berikutnya harus bercabang dari v3.1.</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white shadow-none backdrop-blur">
      <p className="truncate text-sm font-bold md:text-base">{value}</p>
      <p className="mt-1 text-xs text-slate-200">{label}</p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ThreadItem({ item }: { item: any }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
          <Icon name={item.icon} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{item.name}</p>
            <StatusBadge tone={item.branch === "MAIN" ? "green" : item.branch === "REVIEW" ? "amber" : "blue"}>{item.branch}</StatusBadge>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">{item.type}</span>
          </div>
          {item.target && (
            <div className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              Bagian: {item.target}
            </div>
          )}
          <h4 className="mt-2 font-semibold">{item.title}</h4>
          <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
          {item.attachment && (
            <div className="mt-3 rounded-2xl border border-indigo-100 bg-white p-3">
              <div className="flex min-w-0 gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <Icon name="paperclip" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800">{item.attachment}</p>
                  <p className="mt-1 text-xs text-slate-500">Tersimpan sebagai {item.branch}, bukan menimpa draft utama.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DraftCompareSection({ section, activeStep }: { section: string; activeStep: number }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h5 className="font-bold">{section.title}</h5>
        <StatusBadge tone={activeStep >= 4 ? "green" : activeStep >= 3 ? "amber" : "indigo"}>
          {activeStep >= 4 ? "Hasil Merge" : activeStep >= 3 ? "Dibandingkan" : "Baseline"}
        </StatusBadge>
      </div>

      <div className="space-y-3 text-sm leading-6">
        <TextBlock label="Draft Utama v3" text={section.before} active />
        {activeStep >= 1 && <TextBlock label="Cabang Rekanan R-1" text={section.vendor} tone="blue" />}
        {activeStep >= 2 && <TextBlock label="Cabang User U-1" text={section.user} tone="amber" />}
        {activeStep >= 4 && <TextBlock label="Draft Gabungan v3.1" text={section.merged} tone="green" />}
      </div>
    </section>
  );
}

function TextBlock({ label, text, tone = "slate", active = false }: { label: string; text: string; tone?: string; active?: boolean }) {
  const style = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  }[tone];

  return (
    <div className={`rounded-2xl border p-3 ${style}`}>
      <p className="mb-1 text-xs font-bold uppercase tracking-wide opacity-70">{label}</p>
      <p>{text}</p>
    </div>
  );
}