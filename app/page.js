'use client';

import { useState, useEffect, useCallback } from 'react';

const WARDS = ['Kaimbaga', 'Rurii', 'Karau', 'Mirangine'];
const SITE_URL = 'https://www.chokaraa.top';
const ELECTION_DATE = new Date('2026-07-16T06:00:00+03:00'); // Election day, polling opens 6am EAT

const DCP_SLOGANS = [
  "Kura ya DCP ni Kura ya Mwananchi",
  "Chokoraa ni Nguvu — Join the Movement",
  "Ol Kalou Inasimama na DCP",
  "KSh 10 Inabadilisha Historia",
  "Sisi ni Wengi, Sisi ni Chokoraa",
  "July 16th — Piga Kura DCP",
  "Mtu Wetu, Sammy Douglas Kamau Waweru",
  "Tusimame Pamoja — DCP Ol Kalou",
];

const FLASH_SLIDES = [
  "DCP: Sauti ya Mnyonge!",
  "Reject Finance Bill!",
  "Kura ya DCP ni Kura ya Mwananchi",
  "Chokoraa ni Nguvu — Join the Movement",
  "End corruption, vote for change!",
];

export default function HomePage() {
  const [stats, setStats] = useState({ total: 45231, raised: 452310, today: 1223 });
  const [modalStep, setModalStep] = useState('idle'); // idle | payment_choice | ward | share
  const [selectedWard, setSelectedWard] = useState('');
  const [chokoraaNum, setChokoraaNum] = useState(null);
  const [displayTotal, setDisplayTotal] = useState(null);
  const [showElectionPopup, setShowElectionPopup] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [slideIndex, setSlideIndex] = useState(0);

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

  // Countdown timer to election day
  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const diff = ELECTION_DATE - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Flash slides timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % FLASH_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Show payment modal immediately on load if not dismissed
  useEffect(() => {
    const dismissed = typeof window !== 'undefined' && sessionStorage.getItem('paymentPopupDismissed');
    if (!dismissed) {
      setModalStep('payment_choice');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('paymentPopupDismissed', 'true');
      }
    }
  }, []);

  function dismissElectionPopup() {
    setShowElectionPopup(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('electionPopupDismissed', 'true');
    }
  }

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
    setModalStep('payment_choice');
  }

  function closeModal() {
    setModalStep('idle');
    setSelectedWard('');
  }

  async function handleWardSubmit() {
    if (!selectedWard) { goToShare(); return; }
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
      
      {/* ── Sticky Election Countdown Banner ── */}
      <div className="election-banner" role="banner">
        <div className="election-banner-inner">
          <span className="election-banner-label">Election Day — July 16, 2026</span>
          <div className="countdown-row">
            <div className="countdown-unit">
              <span className="countdown-num">{countdown.days}</span>
              <span className="countdown-label">Days</span>
            </div>
            <span className="countdown-sep">:</span>
            <div className="countdown-unit">
              <span className="countdown-num">{String(countdown.hours).padStart(2, '0')}</span>
              <span className="countdown-label">Hrs</span>
            </div>
            <span className="countdown-sep">:</span>
            <div className="countdown-unit">
              <span className="countdown-num">{String(countdown.mins).padStart(2, '0')}</span>
              <span className="countdown-label">Min</span>
            </div>
            <span className="countdown-sep">:</span>
            <div className="countdown-unit">
              <span className="countdown-num">{String(countdown.secs).padStart(2, '0')}</span>
              <span className="countdown-label">Sec</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-brand">
          <span className="brand-dot" />
          <span>Chokoraa</span>
        </div>
        <span className="navbar-badge">Ol Kalou By-Election</span>
      </nav>

      {/* ── DCP Slogan Marquee ── */}
      <div className="slogan-marquee" aria-hidden="true">
        <div className="slogan-track">
          {[...DCP_SLOGANS, ...DCP_SLOGANS].map((slogan, i) => (
            <span className="slogan-item" key={i}>{slogan}</span>
          ))}
        </div>
      </div>

      {/* ── Landing Page ── */}
      <main className="landing-page" role="main">
        
        {/* ── Hero Section ── */}
        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-content">
            <div className="hero-tag">
              <span>The People&apos;s Movement — 2026</span>
            </div>

            <div className="hero-candidate-image">
              <img 
                src="/candidate-face.png" 
                alt="Sammy Douglas Kamau Waweru — DCP Candidate for Ol Kalou"
                width="160"
                height="160"
                loading="eager"
              />
            </div>

            <h1 id="hero-heading" className="hero-title">CHOKORAA</h1>
            <p className="hero-subtitle">They called us Chokoraa. We turned it into a movement.</p>

            <div className="flash-slider-container">
              {FLASH_SLIDES.map((slide, i) => (
                <div key={i} className={`flash-slide ${i === slideIndex ? 'active' : ''}`}>
                  {slide}
                </div>
              ))}
            </div>

            <blockquote className="hero-quote">
              &ldquo;Join with only <span>KSh 10</span> and become part of the most powerful grassroots movement Ol Kalou has ever seen.&rdquo;
            </blockquote>

            <div className="face-pile-wrapper">
              <div className="face-pile">
                {[1,2,3,4,5,6,7].map(n => (
                  <img key={n} src={`/portrait-${n}.png`} alt="Supporter" className="face-avatar" width="40" height="40" loading="lazy" style={{ zIndex: 8 - n }} />
                ))}
              </div>
              <div className="face-pile-text">
                Joined by <strong>{liveTotal.toLocaleString()}</strong> others
              </div>
            </div>


          </div>
        </section>

        {/* ── DCP Ad Banner ── */}
        <section className="dcp-ad-banner" aria-label="DCP Campaign Message">
          <div className="dcp-ad-content">
            <div className="dcp-ad-text">
              <h2 className="dcp-ad-title">Piga Kura DCP — July 16th</h2>
              <p className="dcp-ad-desc">Sammy Douglas Kamau Waweru ni mtu wa wananchi. Tusimame naye!</p>
            </div>
            <button className="btn-cta-small" onClick={openModal}>
              Join Now
            </button>
          </div>
        </section>

        {/* ── Stats Section ── */}
        <section className="stats-section" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="section-title">Live Impact</h2>
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
            <div className="stat-card">
              <div className="stat-value">{countdown.days}</div>
              <div className="stat-label">Days to Election</div>
            </div>
          </div>
        </section>

        {/* ── Opinion Poll Section ── */}
        <section className="poll-section" aria-labelledby="poll-heading">
          <div className="poll-content">
            <h2 id="poll-heading" className="section-title">Ol Kalou Opinion Poll</h2>
            <p className="section-subtitle">Who would you vote for if elections were held today?</p>
            
            <div className="poll-container">
              <div className="poll-item">
                <div className="poll-header">
                  <span className="poll-name">Sammy Douglas Kamau Waweru (DCP)</span>
                  <span className="poll-percent">80%</span>
                </div>
                <div className="poll-bar-bg">
                  <div className="poll-bar-fill" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className="poll-item">
                <div className="poll-header">
                  <span className="poll-name">Samuel Muchina (UDA)</span>
                  <span className="poll-percent">10%</span>
                </div>
                <div className="poll-bar-bg">
                  <div className="poll-bar-fill secondary" style={{ width: '10%' }}></div>
                </div>
              </div>

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

        {/* ── Bottom CTA Strip ── */}
        <section className="bottom-cta-section" aria-label="Final call to action">
          <h2 className="bottom-cta-title">Usiachwe Nyuma!</h2>
          <p className="bottom-cta-desc">
            Over <strong>{liveTotal.toLocaleString()}</strong> Chokoraas have already joined. 
            Be part of history — contribute KSh 10 and stand with DCP on July 16th.
          </p>
          <button className="btn-cta pulse-glow" onClick={openModal}>
            <span>JIUNGE SASA — KSH 10</span>
          </button>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="footer" role="contentinfo">
        <div className="footer-inner">
          <p className="footer-text">© 2026 Chokoraa Movement · Ol Kalou By-Election · DCP</p>
          <p className="footer-slogan">Kura ya DCP ni Kura ya Mwananchi</p>
        </div>
      </footer>

      {/* ── Floating CTA Button ── */}
      <div className="floating-cta">
        <button
          id="join-movement-btn"
          className="btn-cta pulse-glow"
          onClick={openModal}
          aria-label="Join the Chokoraa Movement for KSh 10"
        >
          <span>JOIN THE MOVEMENT — KSH 10</span>
        </button>
      </div>

      {/* ─────────────────── ELECTION DAY POPUP ─────────────────── */}
      {showElectionPopup && (
        <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && dismissElectionPopup()}>
          <div className="popup-card election-popup">
            <button className="popup-close" onClick={dismissElectionPopup} aria-label="Close">✕</button>
            <h2 className="popup-title">Election Day is Coming!</h2>
            <p className="popup-date">July 16, 2026</p>
            <div className="popup-countdown">
              <div className="popup-cd-unit">
                <span className="popup-cd-num">{countdown.days}</span>
                <span className="popup-cd-label">Days</span>
              </div>
              <div className="popup-cd-unit">
                <span className="popup-cd-num">{String(countdown.hours).padStart(2, '0')}</span>
                <span className="popup-cd-label">Hours</span>
              </div>
              <div className="popup-cd-unit">
                <span className="popup-cd-num">{String(countdown.mins).padStart(2, '0')}</span>
                <span className="popup-cd-label">Mins</span>
              </div>
            </div>
            <p className="popup-slogan">&ldquo;Piga Kura DCP — Mtu Wetu Sammy Douglas&rdquo;</p>
            <button className="btn-cta" onClick={() => { dismissElectionPopup(); openModal(); }} style={{ width: '100%', marginTop: '16px' }}>
              JOIN THE MOVEMENT — KSH 10
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────── PAYMENT MODAL ─────────────────── */}
      {modalStep !== 'idle' && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <button className="modal-close" onClick={closeModal} aria-label="Close">✕</button>

            {modalStep === 'payment_choice' && (
              <div className="payment-choice-state">
                <h2 className="modal-title">Join the Movement</h2>
                <p className="modal-subtitle">Contribute KSh 10 to support DCP Ol Kalou.</p>
                
                <div className="mpesa-payment-box">
                  <div className="mpesa-icon">M-PESA</div>
                  <p className="mpesa-instructions">Send money directly to this number:</p>
                  <div className="phone-number-container">
                    <span className="phone-number">0708272930</span>
                    <button className="btn-copy" onClick={async (e) => {
                       await navigator.clipboard.writeText("0708272930");
                       const origText = e.target.innerText;
                       e.target.innerText = "Copied!";
                       setTimeout(() => e.target.innerText = origText, 2000);
                    }}>Copy</button>
                  </div>
                  <p className="mpesa-note">After sending, click below to confirm you've joined!</p>
                  <button className="btn-confirm-mpesa" onClick={() => setModalStep('ward')}>
                    I have sent KSh 10 via M-Pesa
                  </button>
                </div>
              </div>
            )}

            {modalStep === 'ward' && (
              <div className="ward-state">
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
                  <button className="btn-ward-submit" onClick={handleWardSubmit} disabled={!selectedWard}>Submit</button>
                  <button className="btn-ward-skip" onClick={goToShare}>Skip</button>
                </div>
              </div>
            )}

            {modalStep === 'share' && (
              <div className="share-state">
                <div className="chokoraa-number">
                  <p className="chokoraa-label">You are officially</p>
                  <div className="chokoraa-num-display">CHOKORAA #{chokoraaNum?.toLocaleString() || liveTotal.toLocaleString()}</div>
                </div>
                <h2 className="share-title">Hongera!</h2>
                <p className="share-subtitle">Welcome to the movement. Share on WhatsApp and recruit more Chokoraas!</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
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
