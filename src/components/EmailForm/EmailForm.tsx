'use client';

import { useState } from 'react';
import { useStyle } from '@/contexts/StyleContext';
import styles from './EmailForm.module.scss';

interface EmailFormProps {
  compositeUrl: string | null;
  gifUrl: string | null;
}

type SendState = 'idle' | 'sending' | 'sent' | 'error';

export function EmailForm({ compositeUrl, gifUrl }: EmailFormProps) {
  const { cls } = useStyle();
  const [email, setEmail] = useState('');
  const [sendState, setSendState] = useState<SendState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [includeGif, setIncludeGif] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !compositeUrl) return;

    setSendState('sending');
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          imageUrl: compositeUrl,
          gifUrl: includeGif ? gifUrl : null,
        }),
      });

      if (res.ok) {
        setSendState('sent');
      } else {
        const data = await res.json();
        setErrorMsg(data.error ?? 'Failed to send');
        setSendState('error');
      }
    } catch {
      setErrorMsg('Network error — check your connection');
      setSendState('error');
    }
  };

  return (
    <div className={cls(styles['email-form'], 'flex flex-col gap-4 w-full')}>
      <h3 className={cls(styles['email-form__title'], 'text-lg font-bold text-white')}>
        📨 Send to Email
      </h3>

      {sendState === 'sent' ? (
        <div className={cls(styles['email-form__success'], 'bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-400 text-center')}>
          <div className="text-2xl mb-1">✓</div>
          <div className="font-semibold">Sent to {email}!</div>
          <div className="text-sm opacity-70 mt-1">Check your inbox</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={cls(styles['email-form__form'], 'flex flex-col gap-3')}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className={cls(
              styles['email-form__input'],
              'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500 transition-colors'
            )}
          />

          {gifUrl && (
            <label className={cls(styles['email-form__checkbox'], 'flex items-center gap-2 cursor-pointer')}>
              <input
                type="checkbox"
                checked={includeGif}
                onChange={(e) => setIncludeGif(e.target.checked)}
                className="accent-pink-500"
              />
              <span className={cls(styles['email-form__checkbox-label'], 'text-white/70 text-sm')}>
                Include animated GIF
              </span>
            </label>
          )}

          {sendState === 'error' && (
            <p className={cls(styles['email-form__error'], 'text-red-400 text-sm')}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={sendState === 'sending' || !compositeUrl}
            className={cls(
              `${styles['email-form__btn']} ${sendState === 'sending' ? styles['email-form__btn--loading'] : ''}`,
              `py-3 px-6 rounded-xl font-bold text-white transition-all ${sendState === 'sending' ? 'bg-white/20 cursor-wait' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 active:scale-95'}`
            )}
          >
            {sendState === 'sending' ? 'Sending…' : 'Send Photo'}
          </button>
        </form>
      )}
    </div>
  );
}
