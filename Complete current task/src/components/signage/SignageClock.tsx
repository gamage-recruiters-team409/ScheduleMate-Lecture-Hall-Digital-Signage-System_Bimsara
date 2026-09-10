import { useState, useEffect } from 'react';

export default function SignageClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="text-right">
      <div className="font-mono text-5xl font-800 text-white leading-none tracking-tight">
        {hh}<span className="animate-pulse text-white/60">:</span>{mm}<span className="text-white/40 text-3xl">.{ss}</span>
      </div>
      <p className="text-sm text-white/50 mt-1 font-500">{dateStr}</p>
    </div>
  );
}
