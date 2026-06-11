import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <WifiOff className="h-16 w-16 text-gray-400" />
      <h1 className="text-2xl font-bold text-gray-800">Kamu Sedang Offline</h1>
      <p className="max-w-md text-gray-600">
        Koneksi internet terputus. Beberapa halaman mungkin tidak bisa diakses
        sampai koneksi kembali.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-black px-6 py-2 text-white transition hover:bg-gray-800"
      >
        Coba Lagi
      </Link>
    </div>
  );
}
