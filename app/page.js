'use client';

import { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';

const WARDS = ['Kaimbaga', 'Rurii', 'Karau', 'Mirangine'];
const SITE_URL = 'https://www.chokaraa.top';

export default function HomePage() {
  const [stats, setStats] = useState({ total: 45231, raised: 452310, today: 1223 });
  const [modalStep, setModalStep] = useState('idle'); // idle | ward | share
  const [loading, setLoading] = useState(false);
  const [selectedWard, setSelectedWard] = useState('');
  const [chokoraaNum, setChokoraaNum] = useState(null);
  const [displayTotal, setDisplayTotal] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/stats.json');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Animated number counter
  function AnimatedNumber({ value, prefix = '', suffix = '' }) {
    const [display, setDisplay] = useState(value);
    useEffect(() => {
      const target = value;
      const start = display;
      const diff = target - start;
      if (diff === 0) return;
      const steps = 30;
      let i = 0;
      const timer = setInterval(() => {
        i++;
        setDisplay(Math.round(start + (diff * i) / steps));
        if (i >= steps) clearInterval(timer);
      }, 30);
      return () => clearInterval(timer);
    }, [value]);
    return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
  }

  // ─── Handlers ───────────────────────────────────────────────────────────
  function openModal() {
    payWithPaystack();
  }

  function payWithPaystack() {
    if (typeof window === 'undefined' || !window.PaystackPop) {
      alert("Payment system is loading, please try again in a second.");
      return;
    }

    const paystack = new window.PaystackPop();
    paystack.newTransaction({
      key: 'pk_test_bc37bd7729c674fabbd651273dec9feeebd6fc19', // User's public key
      email: 'donor@chokoraa.co.ke', // Paystack requires email, using a dummy one
      amount: 10 * 100, // 10 KES in kobo/cents
      currency: 'KES',
      onSuccess: (transaction) => {
        const num = (stats.total || 0) + 1;
        setChokoraaNum(num);
        setDisplayTotal(num);
        fetchStats();
        setModalStep('ward');
      },
      onCancel: () => {
        console.log('Payment cancelled');
      }
    });
  }

  function closeModal() {
    setModalStep('idle');
    setSelectedWard('');
  }

  async function handleWardSubmit() {
    if (!selectedWard) { goToShare(); return; }
    // In a real app, send to backend here
    goToShare();
  }

  function goToShare() {
    setModalStep('share');
  }

  const whatsappText = encodeURIComponent(
    `I have joined the Chokoraa Movement for the Ol Kalou By-Election by contributing KSh 10.\n\nJoin the movement:\n${SITE_URL}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  const liveTotal = displayTotal || stats.total || 45231;
  const liveRaised = (stats.raised || 452310);

  return (
    <div className="page-wrapper">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-dot" />
          <span>Chokoraa</span>
        </div>
        <span className="navbar-badge">Ol Kalou By-Election</span>
      </nav>

      {/* ── Clean Landing Page Layout ── */}
      <main className="landing-page">
        
        {/* ── Hero Section ── */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-tag">
              <span className="hero-tag-icon">🏴</span>
              <span>The People&apos;s Movement — 2026</span>
            </div>

            <div className="hero-candidate-image">
              <img 
                src="/candidate-face.png" 
                alt="Sammy Douglas Kamau Waweru" 
              />
            </div>

            <h1 className="hero-title">CHOKORAA</h1>
            <p className="hero-subtitle">They called us Chokoraa. We turned it into a movement.</p>

            <blockquote className="hero-quote">
              &ldquo;Join with only <span>KSh 10</span> and become part of the most powerful grassroots movement Ol Kalou has ever seen.&rdquo;
            </blockquote>

            <div className="face-pile-wrapper">
              <div className="face-pile">
                <img src="/portrait-1.png" alt="Supporter" className="face-avatar" style={{ zIndex: 7 }} />
                <img src="/portrait-2.png" alt="Supporter" className="face-avatar" style={{ zIndex: 6 }} />
                <img src="/portrait-3.png" alt="Supporter" className="face-avatar" style={{ zIndex: 5 }} />
                <img src="/portrait-4.png" alt="Supporter" className="face-avatar" style={{ zIndex: 4 }} />
                <img src="/portrait-5.png" alt="Supporter" className="face-avatar" style={{ zIndex: 3 }} />
                <img src="/portrait-6.png" alt="Supporter" className="face-avatar" style={{ zIndex: 2 }} />
                <img src="/portrait-7.png" alt="Supporter" className="face-avatar" style={{ zIndex: 1 }} />
              </div>
              <div className="face-pile-text">
                Joined by <strong>{liveTotal.toLocaleString()}</strong> others
              </div>
            </div>

            <div className="cta-block">
              <button
                id="join-movement-btn"
                className="btn-cta"
                onClick={openModal}
              >
                <span>🔥</span>
                <span>JOIN THE MOVEMENT — KSH 10</span>
              </button>
              <p className="cta-note">No registration. No forms. Just your phone number.</p>
            </div>
          </div>
        </section>

        {/* ── Stats Section ── */}
        <section className="stats-section">
          <h2 className="section-title">Live Impact</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">
                <AnimatedNumber value={liveTotal} />
              </div>
              <div className="stat-label">Chokoraas Joined</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                <AnimatedNumber value={liveRaised} prefix="KES " />
              </div>
              <div className="stat-label">Total Raised</div>
            </div>
          </div>
        </section>

        {/* ── Opinion Poll Section ── */}
        <section className="poll-section">
          <div className="poll-content">
            <h2 className="section-title">Ol Kalou Opinion Poll</h2>
            <p className="section-subtitle">Who would you vote for if elections were held today?</p>
            
            <div className="poll-container">
              {/* Candidate 1 */}
              <div className="poll-item">
                <div className="poll-header">
                  <span className="poll-name">Sammy Douglas Kamau Waweru (DCP)</span>
                  <span className="poll-percent">80%</span>
                </div>
                <div className="poll-bar-bg">
                  <div className="poll-bar-fill" style={{ width: '80%' }}></div>
                </div>
              </div>

              {/* Candidate 2 */}
              <div className="poll-item">
                <div className="poll-header">
                  <span className="poll-name">Samuel Muchina (UDA)</span>
                  <span className="poll-percent">10%</span>
                </div>
                <div className="poll-bar-bg">
                  <div className="poll-bar-fill secondary" style={{ width: '10%' }}></div>
                </div>
              </div>

              {/* Candidate 3 */}
              <div className="poll-item">
                <div className="poll-header">
                  <span className="poll-name">Others</span>
                  <span className="poll-percent">10%</span>
                </div>
                <div className="poll-bar-bg">
                  <div className="poll-bar-fill secondary" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
            <p className="poll-source">Source: Recent Constituency Poll</p>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <p className="footer-text">© 2026 Chokoraa Movement · Ol Kalou By-Election</p>
        <nav className="footer-links">
          <a href="/admin" className="footer-link">Admin</a>
        </nav>
      </footer>

      {/* ─────────────────── MODAL ─────────────────── */}
      {modalStep !== 'idle' && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal">
            <button className="modal-close" onClick={closeModal} aria-label="Close">✕</button>

            {/* ── STEP 3: Ward Selection ── */}
            {modalStep === 'ward' && (
              <div className="ward-state">
                <div className="success-tick">✅</div>
                <h2 className="modal-title">Asante Chokoraa!</h2>
                <p className="modal-subtitle">Payment confirmed. You&apos;re officially part of the movement.</p>

                <h3 className="ward-question">Which ward are you from?</h3>
                <p className="ward-note">Optional — helps us understand where our support comes from.</p>

                <div className="ward-options">
                  {WARDS.map((ward) => (
                    <button
                      key={ward}
                      className={`ward-option${selectedWard === ward ? ' selected' : ''}`}
                      onClick={() => setSelectedWard(selectedWard === ward ? '' : ward)}
                    >
                      {ward}
                    </button>
                  ))}
                </div>

                <div className="ward-actions">
                  <button className="btn-ward-submit" onClick={handleWardSubmit} disabled={!selectedWard}>
                    Submit
                  </button>
                  <button className="btn-ward-skip" onClick={goToShare}>
                    Skip
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Viral Share ── */}
            {modalStep === 'share' && (
              <div className="share-state">
                <div className="chokoraa-number">
                  <p className="chokoraa-label">You are officially</p>
                  <div className="chokoraa-num-display">CHOKORAA #{chokoraaNum?.toLocaleString() || liveTotal.toLocaleString()}</div>
                </div>

                <h2 className="share-title">🎉 Congratulations!</h2>
                <p className="share-subtitle">
                  Welcome to the movement. Share on WhatsApp and recruit more Chokoraas!
                </p>

                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                  <span className="wa-icon">💬</span> Share on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
