import React, { useEffect, useRef, useState } from 'react';

export default function PipelineVisualizer() {
  const stages = [
    { id: 1, name: 'Clone', emoji: '📥' },
    { id: 2, name: 'Test', emoji: '🧪' },
    { id: 3, name: 'Remove image', emoji: '🗑️' },
    { id: 4, name: 'Image Build', emoji: '🛠️' },
    { id: 5, name: 'Container run', emoji: '🐳' },
    { id: 6, name: 'Push image', emoji: '📤' }
  ];

  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1200);
  const timerRef = useRef(null);

  useEffect(() => {
    startAuto();
    return () => stopAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  function startAuto() {
    stopAuto();
    setRunning(true);
    timerRef.current = setInterval(() => {
      setActive(prev => {
        if (prev >= stages.length - 1) {
          stopAuto();
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  }

  function stopAuto() {
    setRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function restart() {
    stopAuto();
    setActive(0);
    setTimeout(() => startAuto(), 300);
  }

  function jumpTo(i) {
    stopAuto();
    setActive(i);
  }

  const styles = {
    page: {
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg,#021124 0%,#04293a 50%,#064663 100%)',
      color: '#e6f7ff',
      fontFamily: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`,
      padding: 24,
      boxSizing: 'border-box'
    },
    title: { fontSize: 28, marginBottom: 12, fontWeight: 700, textShadow: '0 6px 18px rgba(0,0,0,0.6)' },
    subtitle: { fontSize: 13, color: 'rgba(230,247,255,0.8)', marginBottom: 28 },
    stageArea: { position: 'relative', width: '100%', maxWidth: 1100, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    stageCard: () => ({
      position: 'absolute',
      width: 280,
      height: 220,
      borderRadius: 18,
      boxShadow: '0 20px 50px rgba(2,9,23,0.6)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      color: '#071e2f',
      background: 'linear-gradient(180deg,#ffffff,#dff6ff)',
      transformOrigin: 'center',
      transition: 'transform 600ms cubic-bezier(.2,.9,.2,1), opacity 400ms ease, filter 400ms ease, box-shadow 400ms ease'
    }),
    smallLabel: { fontSize: 14, marginTop: 10, fontWeight: 700 },
    emoji: { fontSize: 48, marginBottom: 8 },
    controls: { marginTop: 28, display: 'flex', gap: 12, alignItems: 'center' },
    btn: primary => ({
      padding: '10px 16px',
      borderRadius: 10,
      border: 'none',
      cursor: 'pointer',
      fontWeight: 700,
      background: primary ? 'linear-gradient(90deg,#37b6ff,#0066cc)' : 'rgba(255,255,255,0.08)',
      color: primary ? '#fff' : '#dff6ff',
      boxShadow: primary ? '0 10px 30px rgba(3,102,214,0.28)' : '0 6px 18px rgba(0,0,0,0.5)'
    }),
    progressWrap: { width: 680, height: 14, borderRadius: 12, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginTop: 18, boxShadow: 'inset 0 -2px 8px rgba(0,0,0,0.5)' },
    progressBar: pct => ({ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#4ce0ff,#007acc)', transition: 'width 600ms cubic-bezier(.2,.9,.2,1)' })
  };

  return (
    <div style={styles.page}>
      <div style={{ textAlign: 'center' }}>
        <div style={styles.title}>Jenkins Pipeline — Animated Stages</div>
        <div style={styles.subtitle}>Stages from Jenkinsfile run one-by-one. Click any card to jump, or control playback.</div>
      </div>

      <div style={styles.stageArea}>
        {stages.map((s, i) => {
          const delta = i - active;
          const base = styles.stageCard();
          let style = { ...base };

          if (delta < -1) {
            style.transform = 'translateX(-420px) scale(0.8) rotate(-6deg)';
            style.opacity = 0.5;
            style.filter = 'grayscale(0.1)';
            style.zIndex = 10 + i;
          } else if (delta === -1) {
            style.transform = 'translateX(-220px) scale(0.92) rotate(-3deg)';
            style.opacity = 0.7;
            style.zIndex = 20 + i;
          } else if (delta === 0) {
            style.transform = 'translateX(0px) scale(1)';
            style.opacity = 1;
            style.boxShadow = '0 30px 80px rgba(3,102,214,0.28)';
            style.zIndex = 999;
          } else if (delta === 1) {
            style.transform = 'translateX(220px) scale(0.92) rotate(3deg)';
            style.opacity = 0.85;
            style.zIndex = 20 - i;
          } else {
            style.transform = 'translateX(420px) scale(0.8) rotate(6deg)';
            style.opacity = 0.55;
            style.zIndex = 10 - i;
          }

          return (
            <div key={s.id} onClick={() => jumpTo(i)} style={style}>
              <div style={styles.emoji}>{s.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{s.name}</div>
              <div style={styles.smallLabel}>{i === active ? 'Running' : i < active ? 'Done' : 'Pending'}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={styles.progressWrap}>
          <div style={styles.progressBar(((active + 1) / stages.length) * 100)} />
        </div>

        <div style={styles.controls}>
          <button onClick={() => (running ? stopAuto() : startAuto())} style={styles.btn(true)}>
            {running ? 'Pause' : 'Play'}
          </button>
          <button onClick={restart} style={styles.btn(false)}>Restart</button>
          <label style={{ marginLeft: 12, color: '#dff6ff', fontWeight: 700 }}>Speed</label>
          <input
            type="range"
            min="400"
            max="2200"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          />
          <div style={{ marginLeft: 12, color: '#cfeffd', fontWeight: 700 }}>{Math.round(speed)} ms</div>
        </div>
      </div>
    </div>
  );
}
