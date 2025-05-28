import Image from 'next/image';
import { useState, useEffect } from 'react';

export type Track = {
  title: string;
  description: string;
  file: string;
  category: string;
};

const tracks: Track[] = [
  {
    title: 'ゆったりBGM',
    description: '穏やかな気分にさせてくれる曲です。',
    file: 'sample1.mp3',
    category: 'リラックス',
  },
  {
    title: '朝のランニング',
    description: 'テンションを上げたいときに。',
    file: 'sample2.mp3',
    category: 'アップテンポ',
  },
  {
    title: '夜のチルアウト',
    description: '睡眠前に最適。',
    file: 'sample3.mp3',
    category: 'リラックス',
  },
  {
    title: 'ドライブ',
    description: '車で聴きたい爽快な曲。',
    file: 'sample4.mp3',
    category: 'アップテンポ',
  },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const handleShare = async (track: Track) => {
    const url = `${window.location.origin}/bgm/${track.file}`;
    const data = { title: track.title, text: track.description, url };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (e) {
        console.error(e);
      }
    } else {
      const twitter =
        'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(track.title) +
        '&url=' +
        encodeURIComponent(url);
      window.open(twitter, '_blank');
    }
  };

  const handleShare = async (track: Track) => {
    const url = `${window.location.origin}/bgm/${track.file}`;
    const data = { title: track.title, text: track.description, url };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (e) {
        console.error(e);
      }
    } else {
      const twitter =
        'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(track.title) +
        '&url=' +
        encodeURIComponent(url);
      window.open(twitter, '_blank');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('downloadCounts');
    if (saved) {
      setCounts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const savedFav = localStorage.getItem('favorites');
    if (savedFav) {
      setFavorites(JSON.parse(savedFav));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('downloadCounts', JSON.stringify(counts));
  }, [counts]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const filtered = tracks.filter(
    (t) =>
      (t.title + t.description)
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!onlyFavorites || favorites.includes(t.file))
  );
  const categories = Array.from(new Set(filtered.map((t) => t.category)));

  const handleDownload = (file: string) => {
    setCounts((prev) => ({ ...prev, [file]: (prev[file] || 0) + 1 }));
  };

  const toggleFavorite = (file: string) => {
    setFavorites((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="fixed top-0 w-full z-50 bg-white dark:bg-gray-900 shadow">
        <div className="max-w-screen-md mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="サイトロゴ" width={32} height={32} />
            <span className="font-bold">音楽ダウンロードサイト</span>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="text-2xl">
            {isDark ? '🌙' : '🌞'}
          </button>
        </div>
      </header>
      <main className="pt-20 max-w-screen-md mx-auto p-4 flex flex-col gap-4">
        <input
          type="text"
          placeholder="検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded self-start"
        >
          {onlyFavorites ? 'すべて表示' : 'お気に入りのみ'}
        </button>
        {categories.map((cat) => (
          <section key={cat} className="flex flex-col gap-2">
            <h2 className="text-lg font-bold mb-2">{cat}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered
                .filter((t) => t.category === cat)
                .map((track) => (
                  <div
                    key={track.file}
                    className="bg-gray-100 dark:bg-gray-800 rounded p-4 shadow transform transition duration-300 hover:scale-105 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{track.title}</h3>
                      <button
                        onClick={() => toggleFavorite(track.file)}
                        className="text-yellow-400 text-xl"
                      >
                        {favorites.includes(track.file) ? '★' : '☆'}
                      </button>
                    </div>
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
                      ダウンロード ({counts[track.file] || 0})
                    </a>
                    <button
                      onClick={() => handleShare(track)}
                      className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded"
                    >
                      共有
                    </button>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </main>
      <footer className="text-center text-sm text-gray-500 py-4">© 2025 music-dl</footer>
    </div>
  );
}
