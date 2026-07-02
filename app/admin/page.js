'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setLastUpdated(new Date());
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const ALL_WARDS = ['Kaimbaga', 'Rurii', 'Karau', 'Mirangine'];
  const wardMap = {};
  if (stats?.wards) {
    stats.wards.forEach(w => { wardMap[w.ward] = w.count; });
  }

  const totalWithWard = ALL_WARDS.reduce((sum, w) => sum + (wardMap[w] || 0), 0);
  const maxWard = Math.max(...ALL_WARDS.map(w => wardMap[w] || 0), 1);

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-dot" />
          <span>Chokoraa</span>
        </div>
        <Link href="/" className="footer-link" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          ← Back to Site
        </Link>
      </nav>

      <div className="admin-page">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">📊 Admin Dashboard</h1>
            <p className="admin-subtitle">
              {lastUpdated
                ? `Last updated: ${lastUpdated.toLocaleTimeString()} · Auto-refreshes every 10s`
                : 'Loading...'}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
            <p>Loading campaign data…</p>
          </div>
        ) : (
          <>
            {/* ── Key Metrics ── */}
            <div className="admin-grid">
              <div className="admin-card">
                <div className="admin-card-icon">🏴</div>
                <div className="admin-card-value">
                  {(stats?.total || 0).toLocaleString()}
                </div>
                <div className="admin-card-label">Total Chokoraas</div>
              </div>

              <div className="admin-card">
                <div className="admin-card-icon">💰</div>
                <div className="admin-card-value">
                  KES {(stats?.raised || 0).toLocaleString()}
                </div>
                <div className="admin-card-label">Total Raised</div>
              </div>

              <div className="admin-card">
                <div className="admin-card-icon">📅</div>
                <div className="admin-card-value">
                  {(stats?.today || 0).toLocaleString()}
                </div>
                <div className="admin-card-label">Today&apos;s Chokoraas</div>
              </div>

              <div className="admin-card">
                <div className="admin-card-icon">🗳️</div>
                <div className="admin-card-value">
                  {totalWithWard.toLocaleString()}
                </div>
                <div className="admin-card-label">Ward Responses</div>
              </div>
            </div>

            {/* ── Ward Support ── */}
            <p className="admin-section-title">Ward Support Breakdown</p>
            <table className="ward-table" aria-label="Ward support statistics">
              <thead>
                <tr>
                  <th>Ward</th>
                  <th>Chokoraas</th>
                  <th style={{ width: '40%' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {ALL_WARDS.map((ward) => {
                  const count = wardMap[ward] || 0;
                  const pct = totalWithWard > 0 ? Math.round((count / totalWithWard) * 100) : 0;
                  const barWidth = maxWard > 0 ? (count / maxWard) * 100 : 0;
                  return (
                    <tr key={ward}>
                      <td style={{ fontWeight: 600 }}>{ward}</td>
                      <td style={{ color: 'var(--color-green)', fontWeight: 700 }}>
                        {count.toLocaleString()}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                          {pct}%
                        </div>
                        <div className="ward-bar">
                          <div
                            className="ward-bar-fill"
                            style={{ width: `${barWidth}%` }}
                            role="progressbar"
                            aria-valuenow={count}
                            aria-valuemax={maxWard}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ── Quick Test Section ── */}
            <div style={{ marginTop: '40px' }}>
              <p className="admin-section-title">Quick Actions</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  id="admin-refresh-btn"
                  onClick={fetchStats}
                  style={{
                    padding: '12px 24px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  🔄 Refresh Now
                </button>
                <Link
                  href="/"
                  style={{
                    padding: '12px 24px',
                    background: 'var(--color-green-muted)',
                    border: '1px solid rgba(0,200,100,0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-green)',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  🔥 Test Join Flow
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="footer">
        <p className="footer-text">Chokoraa Movement Admin · Ol Kalou By-Election 2026</p>
      </footer>
    </div>
  );
}
