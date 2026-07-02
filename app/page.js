'use client';

import { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';

const WARDS = ['Kaimbaga', 'Rurii', 'Karau', 'Mirangine'];
const SITE_URL = 'https://chokoraa.co.ke';

// ─── State machine for the modal flow ───────────────────────────────────────
// idle → phone → waiting → ward → share

export default function HomePage() {
  const [stats, setStats] = useState({ total: 45231, raised: 452310, today: 1223 });
  const [modalStep, setModalStep] = useState('idle'); // idle | phone | waiting | ward | share
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkoutId, setCheckoutId] = useState(null);
  const [supporterId, setSupporterId] = useState(null);
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
    }, [value]); // eslint-disable-line
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
        // Payment complete! Transition to ward selection or directly share
        const num = (stats.total || 0) + 1;
        setChokoraaNum(num);
        setDisplayTotal(num);
        fetchStats();
        setModalStep('ward'); // Ask for their ward for grassroots mapping
      },
      onCancel: () => {
        console.log('Payment cancelled');
      }
    });
  }

  function closeModal() {
    setModalStep('idle');
    setPhone('');
    setError('');
    setSelectedWard('');
  }

  async function handleWardSubmit() {
    if (!selectedWard || !supporterId) { goToShare(); return; }
    try {
      await fetch(`/api/supporter/${supporterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ward: selectedWard }),
      });
      await fetchStats();
    } catch { /* silent */ }
    goToShare();
  }

  function goToShare() {
    setModalStep('share');
  }

  const whatsappText = encodeURIComponent(
    `I have joined the Chokoraa Movement for the Ol Kalou By-Election by contributing KSh 10.\n\nJoin the movement:\n${SITE_URL}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  // ─── Total for display (adding 1 for new joiner) ────────────────────────
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

      {/* ── Mobile Feed Layout ── */}
      <main className="mobile-feed">
        
        {/* Feed Item 1: Hero & CTA (Top Priority) */}
        <section className="feed-card bento-hero">

          <div className="hero-tag">
            <span className="hero-tag-icon">🏴</span>
            <span>The People&apos;s Movement — 2026</span>
          </div>

          <div className="hero-title-block">
            <p className="hero-eyebrow">Ol Kalou By-Election</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', marginTop: '8px' }}>
              <img 
                src="/candidate-face.png" 
                alt="Sammy Douglas Kamau Waweru" 
                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', border: '4px solid var(--color-primary)' }} 
              />
            </div>
            <h1 className="hero-title">CHOKORAA</h1>
            <p className="hero-subtitle">They called us Chokoraa. We turned it into a movement.</p>
          </div>

          <div className="hero-quote">
            <blockquote>
              &ldquo;Join with only <span>KSh 10</span> and become part of the most powerful grassroots movement Ol Kalou has ever seen.&rdquo;
            </blockquote>
          </div>

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

          <div className="cta-block" style={{ marginTop: '16px', marginBottom: '8px' }}>
            <button
              id="join-movement-btn"
              className="btn-cta"
              onClick={openModal}
              aria-haspopup="dialog"
            >
              <span>🔥</span>
              <span>JOIN THE MOVEMENT — KSH 10</span>
            </button>
            <p className="cta-note">No registration. No forms. Just your phone number.</p>
          </div>
        </section>

        {/* Feed Item 2: Opinion Poll */}
        <section className="feed-card opinion-poll">
          <h3 className="bento-header">Ol Kalou Opinion Poll</h3>
          <p className="hero-subtitle" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
            Who would you vote for if elections were held today?
          </p>
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
                <span className="poll-name" style={{ fontWeight: 500 }}>Samuel Muchina (UDA)</span>
                <span className="poll-percent" style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>10%</span>
              </div>
              <div className="poll-bar-bg">
                <div className="poll-bar-fill secondary" style={{ width: '10%' }}></div>
              </div>
            </div>

            {/* Candidate 3 */}
            <div className="poll-item">
              <div className="poll-header">
                <span className="poll-name" style={{ fontWeight: 500 }}>Others</span>
                <span className="poll-percent" style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>10%</span>
              </div>
              <div className="poll-bar-bg">
                <div className="poll-bar-fill secondary" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
          <p className="poll-source">Source: Recent Constituency Poll</p>
        </section>

        {/* Feed Item 2.5: Splash Advert */}
        <section className="feed-card feed-advert">
          <div className="advert-container">
            <img src="/img-massive-rally.png" alt="Chokoraas rally" className="advert-img" />
            <div className="advert-caption">
              This is not just politics. It&apos;s a <span>Movement</span>.
            </div>
            <img src="/img-bucket-filling.png" alt="Chokoraas contributing" className="advert-img" />
          </div>
        </section>

        {/* Feed Item 3: Live Stats */}
        <section className="feed-card bento-stats">
          <h3 className="bento-header">Live Impact</h3>
          <div className="stats-row">
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
              <div className="stat-label">Raised</div>
            </div>
          </div>
        </section>

        {/* Feed Item 4: Voices on the Ground (TikToks) */}
        <section className="feed-card bento-tiktoks">
          <div className="bento-header-wrapper">
            <h3 className="bento-header">Voices on the Ground</h3>
            <span className="swipe-hint">Swipe to see more ➔</span>
          </div>
          <div className="horizontal-scroll-container">
            {[
              "7650919635537104135", "7650883168202951943", "7654851826285612308",
              "7654481920021056788", "7650198646129986834", "7654481794141605140",
              "7654616033067633927", "7648787490786233608", "7654510946769046791",
              "7654502242329922836", "7654492894589472021", "7654488946767826183",
              "7651290144993037588", "7654485692743011604", "7634952945716481288"
            ].map((id) => (
              <div className="tiktok-wrapper" key={id}>
                <iframe 
                  src={`https://www.tiktok.com/embed/v2/${id}`}
                  className="tiktok-iframe" 
                  allowFullScreen 
                  scrolling="no" 
                  allow="encrypted-media;">
                </iframe>
              </div>
            ))}
          </div>
        </section>

        {/* Feed Item 5: The Movement is Real (Images) */}
        <section className="feed-card bento-gallery">
          <div className="bento-header-wrapper">
            <h3 className="bento-header">The Movement is Real</h3>
            <span className="swipe-hint">Swipe to see more ➔</span>
          </div>
          <div className="horizontal-scroll-container">
            <div className="gallery-item large">
              <img src="/img-massive-rally.png" alt="Massive crowd rally for DCP candidate" className="gallery-img" />
            </div>
            <div className="gallery-item">
              <img src="/img-bucket-filling.png" alt="Residents contributing 10 bob to buy a suit" className="gallery-img" />
            </div>
            <div className="gallery-item">
              <img src="/img-machokora-poster.png" alt="Mimi ni chokora poster embracing the term" className="gallery-img" />
            </div>
            <div className="gallery-item">
              <img src="/img-caravan-poster.png" alt="Ol Kalou Chokoraa Edition Caravan Poster" className="gallery-img" />
            </div>
            <div className="gallery-item">
              <img src="/img-mk-warning.png" alt="News quote on insults in politics" className="gallery-img" />
            </div>
            <div className="gallery-item">
              <img src="/img-senator-fundraiser.png" alt="Senator Methu leading 10 bob fundraiser" className="gallery-img" />
            </div>
            <div className="gallery-item large">
              <img src="/img-news-rally.png" alt="People of Ol Kalou continuing to support Kamau" className="gallery-img" />
            </div>
            <div className="gallery-item">
              <img src="/img-lightcast-tv.png" alt="Lightcast TV coverage of the contributions" className="gallery-img" />
            </div>
            <div className="gallery-item">
              <img src="/img-bodaboda-riders.png" alt="Bodaboda riders chip in 10 bob each" className="gallery-img" />
            </div>
            <div className="gallery-item">
              <img src="/img-crowd-green-caps.png" alt="Crowd in green caps contributing" className="gallery-img" />
            </div>
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
          aria-label="Join the Chokoraa Movement"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal">
            <button className="modal-close" onClick={closeModal} aria-label="Close">✕</button>

            {/* ── STEP 1 & 2 Removed: Using Paystack Popup instead ── */}

            {/* ── STEP 3: Ward Selection ── */}
            {modalStep === 'ward' && (
              <div className="ward-state">
                <div className="success-tick">✅</div>
                <h2 className="modal-title" style={{ marginBottom: '4px' }}>Asante Chokoraa!</h2>
                <p className="modal-subtitle">Payment confirmed. You&apos;re officially part of the movement.</p>

                <h3 className="ward-question">Which ward are you from?</h3>
                <p className="ward-note">Optional — helps us understand where our support comes from.</p>

                <div className="ward-options" role="radiogroup" aria-label="Select your ward">
                  {WARDS.map((ward) => (
                    <button
                      key={ward}
                      role="radio"
                      aria-checked={selectedWard === ward}
                      className={`ward-option${selectedWard === ward ? ' selected' : ''}`}
                      onClick={() => setSelectedWard(selectedWard === ward ? '' : ward)}
                      id={`ward-${ward.toLowerCase()}`}
                    >
                      {ward}
                    </button>
                  ))}
                </div>

                <div className="ward-actions">
                  <button
                    id="ward-submit-btn"
                    className="btn-ward-submit"
                    onClick={handleWardSubmit}
                    disabled={!selectedWard}
                  >
                    Submit
                  </button>
                  <button
                    id="ward-skip-btn"
                    className="btn-ward-skip"
                    onClick={goToShare}
                  >
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

                <a
                  id="whatsapp-share-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  <span className="wa-icon">💬</span>
                  Share on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
