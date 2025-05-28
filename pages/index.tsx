import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";

// ────────────────────────────────────────────────────────────
// Font setup
// ────────────────────────────────────────────────────────────
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ────────────────────────────────────────────────────────────
// Data types & seed data
// ────────────────────────────────────────────────────────────
export type Track = {
  title: string;
  description: string;
  file: string;
  category: string;
};

const tracks: Track[] = [
  {
    title: "ゆったりBGM",
    description: "穏やかな気分にさせてくれる曲です。",
    file: "sample1.mp3",
    category: "リラックス",
  },
  {
    title: "朝のランニング",
    description: "テンションを上げたいときに。",
    file: "sample2.mp3",
    category: "アップテンポ",
  },
  {
    title: "夜のチルアウト",
    description: "睡眠前に最適。",
    file: "sample3.mp3",
    category: "リラックス",
  },
  {
    title: "ドライブ",
    description: "車で聴きたい爽快な曲。",
    file: "sample4.mp3",
    category: "アップテンポ",
  },
];

// ────────────────────────────────────────────────────────────
// Page component
// ────────────────────────────────────────────────────────────
export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({});

  // Load download counts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("downloadCounts");
    if (saved) setDownloadCounts(JSON.parse(saved));
  }, []);

  // Persist counts when they change
  useEffect(() => {
    localStorage.setItem("downloadCounts", JSON.stringify(downloadCounts));
  }, [downloadCounts]);

  // Toggle dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  // Derived data
  const filtered = tracks.filter((t) =>
    `${t.title}${t.description}`.toLowerCase().includes(search.toLowerCase())
  );
  const categories = Array.from(new Set(filtered.map((t) => t.category)));

  // Handlers
  const handleDownload = (file: string) => {
    setDownloadCounts((prev) => ({ ...prev, [file]: (prev[file] || 0) + 1 }));
  };

  // ──────────────────────────────────────────────────────────
  // JSX
  // ──────────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>music-dl</title>
        <meta name="description" content="Music download site built with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${geistSans.variable} ${geistMono.variable}`}
      >
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow">
          <div className="max-w-screen-md mx-auto flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" width={100} height={40} alt="logo" />
              <span className="font-bold">音楽ダウンロードサイト</span>
            </div>
            <button onClick={() => setIsDark(!isDark)} className="text-2xl">
              {isDark ? "🌙" : "🌞"}
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="pt-24 max-w-screen-md mx-auto p-4 space-y-6">
          <input
            type="text"
            placeholder="検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
          />

          {categories.map((cat) => (
            <section key={cat} className="space-y-4">
              <h2 className="text-lg font-bold">{cat}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered
                  .filter((t) => t.category === cat)
                  .map((track) => (
                    <div
                      key={track.file}
                      className="bg-gray-100 dark:bg-gray-800 rounded p-4 shadow flex flex-col gap-2"
                    >
                      <h3 className="font-semibold">{track.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {track.description}
                      </p>
                      <audio
                        controls
                        className="w-full"
                        src={`/bgm/${track.file}`}
                      />
                      <a
                        href={`/bgm/${track.file}`}
                        download
                        onClick={() => handleDownload(track.file)}
                        className="mt-auto px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                      >
                        ダウンロード ({downloadCounts[track.file] || 0})
                      </a>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </main>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-6">
          © 2025 music-dl
        </footer>
      </div>
    </>
  );
}
