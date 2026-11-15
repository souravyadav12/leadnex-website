import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Mic, MicOff, ChevronDown, Send, Sparkles, BarChart3, Clock, Database, GitBranch, Radio } from 'lucide-react';
import { demo } from '../data/site';
import { Section, SectionHead, Reveal, Stagger, StaggerItem, Tilt, HoverLift, EASE, SPRING } from '../motion/kit';
import { cn } from '../utils/cn';
import { useNearView } from '../hooks/useNearView';

const HIGHLIGHT_ICONS = [Mic, BarChart3, Clock];
const INTEGRATION_ICONS = [Database, GitBranch, Radio, Sparkles];

function classifyIntent(text) {
  const t = text.toLowerCase();
  if (/price|cost|pricing|much/.test(t)) return 'pricing';
  if (/demo|meeting|schedule|book|call|thursday|friday|monday|time/.test(t)) return 'booking';
  if (/integrat|crm|salesforce|hubspot|api/.test(t)) return 'integration';
  if (/secur|hipaa|gdpr|complian|encrypt/.test(t)) return 'security';
  if (/human|agent|speak to|representative/.test(t)) return 'escalate';
  if (/hi|hello|hey/.test(t)) return 'greeting';
  return 'fallback';
}

function reply(intent) {
  if (intent === 'fallback') {
    const bank = demo.replies.fallback;
    return bank[Math.floor(Math.random() * bank.length)];
  }
  return demo.replies[intent];
}

/* ── Waveform ───────────────────────────────────────────────────────────── */
function Waveform({ active }) {
  return (
    <div className="flex h-10 items-center gap-[3px]" aria-hidden="true">
      {Array.from({ length: 34 }).map((_, i) => (
        <motion.span
          key={i}
          className={cn('w-[2px] rounded-full', active ? 'bg-gradient-to-t from-accent/40 to-accent-soft' : 'bg-white/15')}
          style={{ transformOrigin: 'bottom' }}
          animate={active ? { scaleY: [0.2, 0.6 + Math.abs(Math.sin(i * 2.1)) * 0.4, 0.2] } : { scaleY: 0.14 }}
          transition={{ duration: 0.85 + (i % 5) * 0.12, repeat: active ? Infinity : 0, ease: 'easeInOut', delay: i * 0.03 }}
        />
      ))}
    </div>
  );
}

/* ── Conversation bubbles ───────────────────────────────────────────────── */
function Conversation({ messages, thinking, scrollRef }) {
  return (
    <div ref={scrollRef} className="no-scrollbar min-h-[132px] max-h-[210px] sm:min-h-[168px] sm:max-h-[230px] space-y-2.5 overflow-y-auto px-0.5" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        {messages.map((m, i) => (
          <motion.div
            key={`${m.role}-${i}-${m.text.slice(0, 8)}`}
            layout
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[82%] rounded-2xl border px-3.5 py-2 text-[12.5px] leading-relaxed',
                m.role === 'ai'
                  ? 'rounded-tl-sm border-accent/20 bg-accent/10 text-white/90'
                  : 'rounded-tr-sm border-line bg-white/[0.05] text-muted',
              )}
            >
              <span className={cn('mb-0.5 block font-mono text-[9px] uppercase tracking-wider', m.role === 'ai' ? 'text-accent-soft' : 'text-dim')}>
                {m.role === 'ai' ? 'LEADNEX AI' : 'Customer'}
              </span>
              {m.text}
            </div>
          </motion.div>
        ))}

        {thinking && (
          <motion.div
            key="thinking"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-accent/20 bg-accent/10 px-3.5 py-2.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */
export default function DemoSection() {
  const [scenario, setScenario] = useState(demo.scenarios[0].id);
  const [voice, setVoice] = useState(demo.voices[0].id);
  const [muted, setMuted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | live | ended
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [value, setValue] = useState('');
  const [logIndex, setLogIndex] = useState(0);
  const [stageRef, nearDemo] = useNearView('320px');
  const scrollRef = useRef(null);
  const replyTimer = useRef(null);
  const active = demo.scenarios.find((s) => s.id === scenario);

  useEffect(() => {
    if (status !== 'live') return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  useEffect(() => {
    if (!nearDemo) return;
    const t = setInterval(() => setLogIndex((i) => (i + 1) % demo.panel.logs.length), 3200);
    return () => clearInterval(t);
  }, [nearDemo]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, thinking]);

  useEffect(() => () => clearTimeout(replyTimer.current), []);

  const startCall = useCallback(() => {
    clearTimeout(replyTimer.current);
    setStatus('live');
    setSeconds(0);
    setThinking(false);
    setMessages([{ role: 'ai', text: active.opener }]);
  }, [active]);

  const endCall = useCallback(() => {
    clearTimeout(replyTimer.current);
    setStatus('ended');
    setThinking(false);
  }, []);

  const reset = useCallback(() => {
    clearTimeout(replyTimer.current);
    setStatus('idle');
    setMessages([]);
    setThinking(false);
    setSeconds(0);
    setValue('');
  }, []);

  const send = useCallback(
    (text) => {
      const t = (text ?? value).trim();
      if (!t || status !== 'live') return;
      setMessages((m) => [...m, { role: 'user', text: t }]);
      setValue('');
      setThinking(true);
      replyTimer.current = setTimeout(() => {
        setThinking(false);
        setMessages((m) => [...m, { role: 'ai', text: reply(classifyIntent(t)) }]);
      }, 950);
    },
    [status, value],
  );

  const isLive = status === 'live';
  const suggestions = ['What does this cost?', 'Can you book a demo?', 'Is my data secure?'];

  return (
    <Section id="demo">
      <SectionHead
        anchor3d="orb"
        index={demo.index}
        badge={demo.badge}
        title={demo.title}
        titleAccent={demo.titleAccent}
        subtitle={demo.subtitle}
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* console */}
        <div className="lg:col-span-7">
          <Reveal direction="left">
            <div className="mb-4 flex flex-wrap gap-2">
              {demo.scenarios.map((s) => (
                <motion.button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setScenario(s.id);
                    reset();
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={SPRING}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 font-mono text-[10.5px] font-semibold transition-colors',
                    scenario === s.id
                      ? 'border-accent/40 bg-accent text-white shadow-lg shadow-accent/20'
                      : 'border-line bg-white/[0.04] text-muted hover:bg-white/[0.08] hover:text-white',
                  )}
                >
                  {s.title}
                </motion.button>
              ))}
            </div>

            <div ref={stageRef} className="gborder overflow-hidden rounded-2xl border border-white/10 bg-[rgba(4,8,20,0.65)] backdrop-blur-xl shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)]">
              {/* control bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
                <div>
                  <div className="label-mono-xs text-dim">Scenario</div>
                  <div className="mt-0.5 flex items-center gap-2 text-[12.5px] font-bold text-white">
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                      animate={{ opacity: [1, 0.35, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    {active.title}
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-3 py-1.5">
                  <span className="label-mono-xs shrink-0 text-dim">Model:</span>
                  <div className="relative flex items-center">
                    <select
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      aria-label="Voice model"
                      className="cursor-pointer appearance-none bg-transparent pr-5 text-[11.5px] font-semibold text-white focus:outline-none"
                    >
                      {demo.voices.map((v) => (
                        <option key={v.id} value={v.id} className="bg-[var(--base-2)]">
                          {v.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0 h-3 w-3 text-dim" />
                  </div>
                </div>
              </div>

              {/* status tracker */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-black/30 px-4 py-2 font-mono text-[9.5px]">
                <span className="flex items-center gap-2 text-dim">
                  <motion.span
                    className={cn('h-1.5 w-1.5 rounded-full', isLive ? 'bg-mint' : 'bg-white/15')}
                    animate={isLive ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                  RTC Network:{' '}
                  {isLive ? <span className="font-semibold text-mint">CONNECTED · 210ms latency</span> : 'IDLE'}
                </span>
                <span className="text-dim">
                  Sentiment Analysis:{' '}
                  <span className={isLive ? 'font-bold text-accent-soft' : 'text-dim'}>
                    {isLive ? (messages.length > 1 ? 'Intent: High Interest (94%)' : 'Listening…') : 'STANDBY'}
                  </span>
                </span>
                <span className="text-dim">
                  {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
                </span>
              </div>

              {/* body */}
              <div className="p-4 sm:p-5">
                <div className="mb-4 flex min-h-[74px] flex-col items-center justify-center rounded-xl border border-line bg-black/30 p-3">
                  <span className="label-mono-xs mb-1.5 text-dim">Live WebRTC Audio Channel</span>
                  <Waveform active={isLive && !thinking && !muted} />
                </div>

                <Conversation messages={messages} thinking={thinking} scrollRef={scrollRef} />

                <div className="mt-4 space-y-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s) => (
                      <motion.button
                        key={s}
                        type="button"
                        disabled={!isLive}
                        onClick={() => send(s)}
                        whileHover={isLive ? { y: -2 } : undefined}
                        whileTap={isLive ? { scale: 0.96 } : undefined}
                        className="rounded-full border border-line bg-white/[0.05] px-2.5 py-1 text-[10.5px] text-muted transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      send();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      disabled={!isLive}
                      placeholder={isLive ? 'Type what the caller would say…' : 'Start the call to chat with the AI…'}
                      aria-label="Message the AI agent"
                      className="flex-1 rounded-xl border border-line bg-white/[0.04] px-3.5 py-2.5 text-[12.5px] text-white outline-none transition-colors placeholder:text-dim focus:border-accent/60 disabled:opacity-50"
                    />
                    <motion.button
                      type="submit"
                      disabled={!isLive || !value.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.94 }}
                      aria-label="Send message"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </motion.button>
                  </form>
                </div>
              </div>

              {/* controls */}
              <div className="flex items-center justify-center gap-4 border-t border-line bg-black/20 px-4 py-3.5">
                <motion.button
                  onClick={() => setMuted((v) => !v)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border transition-colors',
                    muted ? 'border-danger/30 bg-danger/20 text-danger' : 'border-line bg-white/[0.05] text-muted hover:bg-white/10',
                  )}
                >
                  {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </motion.button>

                <AnimatePresence mode="wait">
                  {!isLive ? (
                    <motion.button
                      key="start"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={startCall}
                      aria-label="Start call"
                      className="flex h-13 w-13 items-center justify-center rounded-full border border-accent/20 bg-gradient-to-r from-accent to-[var(--a2)] p-3.5 text-white shadow-lg shadow-accent/25"
                    >
                      <Phone className="h-5 w-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      key="end"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={endCall}
                      aria-label="End call"
                      className="flex items-center justify-center rounded-full border border-danger/20 bg-danger p-3.5 text-white shadow-lg shadow-danger/20"
                    >
                      <PhoneOff className="h-5 w-5" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={reset}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="rounded-full border border-line bg-white/[0.05] px-3.5 py-2 font-mono text-[10.5px] font-semibold text-muted transition-colors hover:text-white"
                >
                  Reset
                </motion.button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* advantages panel */}
        <div className="lg:col-span-5">
          <Reveal direction="right" delay={0.1}>
            <Tilt max={5}>
              <div className="glass relative overflow-hidden rounded-2xl border-accent/20 p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-accent"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="label-mono text-accent-soft">{demo.panel.kicker}</span>
                </div>

                <h3 className="mt-3 text-[19px] font-bold leading-tight tracking-tight text-white sm:text-[21px]">
                  {demo.panel.title} <span className="gradient-text">{demo.panel.titleAccent}</span>
                </h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{demo.panel.body}</p>

                <Stagger className="mt-4 space-y-2.5" step={0.08}>
                  {demo.panel.highlights.map((h, i) => {
                    const Icon = HIGHLIGHT_ICONS[i];
                    return (
                      <StaggerItem key={h.title} distance={14}>
                        <HoverLift lift={-3} scale={1.01}>
                          <div className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-white/[0.02] p-3 transition-colors hover:border-accent/25 hover:bg-white/[0.04]">
                            <div className="flex items-center gap-3">
                              <motion.span
                                whileHover={{ rotate: 8, scale: 1.08 }}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10"
                              >
                                <Icon className="h-3.5 w-3.5 text-accent-soft" strokeWidth={2.25} />
                              </motion.span>
                              <div>
                                <div className="text-[12px] font-semibold text-white/95">{h.title}</div>
                                <div className="mt-0.5 text-[10.5px] text-muted">{h.desc}</div>
                              </div>
                            </div>
                            <span className="hidden shrink-0 rounded border border-line bg-white/[0.04] px-1.5 py-0.5 font-mono text-[8.5px] text-dim sm:inline">
                              {h.tag}
                            </span>
                          </div>
                        </HoverLift>
                      </StaggerItem>
                    );
                  })}
                </Stagger>

                {/* live log ticker */}
                <div className="mt-4 overflow-hidden rounded-xl border border-line bg-black/40 px-3 py-2.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="label-mono-xs text-dim">live activity</span>
                    <span className="flex items-center gap-1 font-mono text-[8.5px] uppercase tracking-wider text-mint/70">
                      <motion.span
                        className="h-1 w-1 rounded-full bg-mint"
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                      />
                      streaming
                    </span>
                  </div>
                  <div className="relative min-h-[2.4rem] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={logIndex}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="font-mono text-[10.5px] leading-relaxed text-mint/90"
                      >
                        <span className="mr-1.5 text-dim">›</span>
                        {demo.panel.logs[logIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  {/* countdown to the next event */}
                  <div className="mt-2 h-[2px] overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      key={logIndex}
                      className="h-full rounded-full bg-gradient-to-r from-accent via-mint to-accent"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3.2, ease: 'linear' }}
                    />
                  </div>
                </div>

                {/* integrations */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                  {demo.panel.integrations.map((name, i) => {
                    const Icon = INTEGRATION_ICONS[i];
                    return (
                      <motion.span
                        key={name}
                        whileHover={{ y: -2, scale: 1.04 }}
                        className="flex items-center gap-1.5 rounded-lg border border-line bg-white/[0.03] px-2 py-1 text-[10px] text-muted"
                      >
                        <Icon className="h-3 w-3 text-accent-soft/80" strokeWidth={2} />
                        {name}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            </Tilt>
          </Reveal>

          <Stagger className="mt-4 grid grid-cols-2 gap-2" step={0.06} delay={0.15}>
            {demo.panel.stats.map((s) => (
              <StaggerItem key={s.label} distance={12}>
                <HoverLift lift={-3} className="rounded-xl border border-line bg-white/[0.02] p-3">
                  <div className="font-mono text-[14px] font-bold text-white">{s.value}</div>
                  <div className="mt-0.5 text-[9.5px] text-muted">{s.label}</div>
                  <div className="mt-0.5 text-[8.5px] text-dim">{s.note}</div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
