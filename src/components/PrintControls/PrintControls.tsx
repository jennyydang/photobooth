'use client';

import { useState } from 'react';
import { usePhotoBooth } from '@/contexts/PhotoBoothContext';
import { useStyle } from '@/contexts/StyleContext';
import { PRINTERS } from '@/utils/layoutConfigs';
import styles from './PrintControls.module.scss';

interface PrintControlsProps {
  compositeUrl: string | null;
}

export function PrintControls({ compositeUrl }: PrintControlsProps) {
  const { cls } = useStyle();
  const { selectedLayout } = usePhotoBooth();
  const [selectedPrinter, setSelectedPrinter] = useState(PRINTERS[0].id);
  const [copies, setCopies] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    if (!compositeUrl || !selectedLayout) return;
    setIsPrinting(true);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Allow popups to print');
      setIsPrinting(false);
      return;
    }

    const { canvasWidth, canvasHeight, size, orientation } = selectedLayout;
    const [wIn, hIn] = size.split('x').map(Number);
    const isLandscape = orientation === 'horizontal';

    const pageW = isLandscape ? hIn : wIn;
    const pageH = isLandscape ? wIn : hIn;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Photo Booth Print</title>
          <style>
            @page {
              size: ${pageW}in ${pageH}in;
              margin: 0;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: ${pageW}in; height: ${pageH}in; overflow: hidden; }
            .copies { display: flex; flex-wrap: wrap; width: 100%; height: 100%; }
            .copy { width: ${100 / (copies > 1 ? 2 : 1)}%; height: ${copies > 2 ? '50%' : '100%'}; }
            img { width: 100%; height: 100%; object-fit: contain; display: block; }
          </style>
        </head>
        <body>
          <div class="copies">
            ${Array.from({ length: copies })
              .map(() => `<div class="copy"><img src="${compositeUrl}" /></div>`)
              .join('')}
          </div>
          <script>
            window.onload = () => { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setIsPrinting(false);
  };

  return (
    <div className={cls(styles['print-controls'], 'flex flex-col gap-4 w-full')}>
      <h3 className={cls(styles['print-controls__title'], 'text-lg font-bold text-white')}>
        🖨️ Print Settings
      </h3>

      <div className={cls(styles['print-controls__field'], 'flex flex-col gap-1.5')}>
        <label className={cls(styles['print-controls__label'], 'text-white/60 text-sm font-medium')}>
          Printer
        </label>
        <select
          value={selectedPrinter}
          onChange={(e) => setSelectedPrinter(e.target.value as typeof selectedPrinter)}
          className={cls(
            styles['print-controls__select'],
            'bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-pink-500 transition-colors'
          )}
        >
          {PRINTERS.map((p) => (
            <option key={p.id} value={p.id} className="bg-gray-900">
              {p.name} — {p.description}
            </option>
          ))}
        </select>
      </div>

      <div className={cls(styles['print-controls__field'], 'flex flex-col gap-1.5')}>
        <label className={cls(styles['print-controls__label'], 'text-white/60 text-sm font-medium')}>
          Copies: {copies}
        </label>
        <input
          type="range"
          min={1}
          max={4}
          value={copies}
          onChange={(e) => setCopies(Number(e.target.value))}
          className={cls(styles['print-controls__range'], 'w-full accent-pink-500')}
        />
        <div className={cls(styles['print-controls__range-labels'], 'flex justify-between text-white/30 text-xs')}>
          <span>1</span><span>2</span><span>3</span><span>4</span>
        </div>
      </div>

      {selectedLayout && (
        <div className={cls(styles['print-controls__info'], 'bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white/50')}>
          <div>Size: <span className="text-white/80">{selectedLayout.size}"</span></div>
          <div>Orientation: <span className="text-white/80 capitalize">{selectedLayout.orientation}</span></div>
          <div>DPI: <span className="text-white/80">{PRINTERS.find(p => p.id === selectedPrinter)?.dpi ?? 300}</span></div>
        </div>
      )}

      <button
        onClick={handlePrint}
        disabled={isPrinting || !compositeUrl}
        className={cls(
          `${styles['print-controls__btn']} ${isPrinting || !compositeUrl ? styles['print-controls__btn--disabled'] : ''}`,
          `py-3 px-6 rounded-xl font-bold text-white transition-all ${isPrinting || !compositeUrl ? 'bg-white/20 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 active:scale-95'}`
        )}
      >
        {isPrinting ? 'Opening Print Dialog…' : `Print ${copies > 1 ? `${copies} Copies` : 'Strip'}`}
      </button>
    </div>
  );
}
