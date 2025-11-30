'use client'
import { useEffect, useState } from "react";

type Health = {
  backend: string;
  db: string;
  secrets: string;
  timestamp: string;
} | null;

export default function Home() {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);

  // Use NEXT_PUBLIC_API_URL at build/runtime
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    let mounted = true;
    const fetchHealth = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/health`);
        if (!res.ok) throw new Error("network");
        const j = await res.json();
        if (mounted) setHealth(j);
      } catch (e) {
        if (mounted) setHealth(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHealth();
    const id = setInterval(fetchHealth, 10000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-semibold mb-4">ERP — Frontend</h1>
        <p className="mb-6 text-slate-300">
          Frontend: <span className="font-medium text-green-400">Active</span>
        </p>

        <div className="p-4 bg-slate-900 rounded-lg">
          <h2 className="font-medium">Backend / Database</h2>

          {loading ? (
            <p className="text-slate-400 mt-2">Checking services...</p>
          ) : health ? (
            <ul className="mt-2 space-y-1 text-sm text-slate-200">
              <li>Backend: <strong>{health.backend}</strong></li>
              <li>Database: <strong>{health.db}</strong></li>
              <li>Secrets: <strong>{health.secrets}</strong></li>
              <li className="text-xs text-slate-400">Checked at: {new Date(health.timestamp).toLocaleString()}</li>
            </ul>
          ) : (
            <p className="text-red-400 mt-2">Cannot reach backend. Check CORS and backend status.</p>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-400">
          API base: <code className="bg-slate-700 px-1 rounded">{API_BASE}</code>
        </p>
      </div>
    </main>
  );
}
