import { useEffect, useState } from 'react';
import { randomInt } from './lib/randomInt';

const CHARSET = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
};

const OPTIONS = [
  { id: 'uppercase', key: 'upper', label: 'Upper' },
  { id: 'lowercase', key: 'lower', label: 'Lower' },
  { id: 'numbers', key: 'number', label: 'Digits' },
  { id: 'symbols', key: 'symbol', label: 'Special' },
];

const PLACEHOLDER = '••••••••••••';
const MIN_LENGTH = 6;
const MAX_LENGTH = 32;
const INITIAL_LENGTH = 12;
const INITIAL_SELECTION = { upper: true, lower: true, number: true, symbol: false };

function buildPassword(length, selection) {
  const characters = OPTIONS.filter((option) => selection[option.key])
    .map((option) => CHARSET[option.key])
    .join('');

  if (characters === '') {
    return { value: '---', empty: true };
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(randomInt(characters.length));
  }
  return { value: password, empty: false };
}

function sliderFill(length) {
  return ((length - MIN_LENGTH) / (MAX_LENGTH - MIN_LENGTH)) * 100;
}

function ToggleOption({ id, label, checked, onChange }) {
  return (
    <div className="relative group">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="hidden toggle-checkbox"
      />
      <label
        htmlFor={id}
        className="toggle-label flex items-center justify-between px-5 py-4 bg-muted rounded-[var(--radius)] border border-border cursor-pointer transition-all duration-200 hover:border-accent"
        style={{ backgroundColor: 'var(--muted)' }}
      >
        <span className="text-[10px] font-bold tracking-widest uppercase">{label}</span>
        <i className="fa-solid fa-circle-check"></i>
      </label>
    </div>
  );
}

export default function App() {
  const [length, setLength] = useState(INITIAL_LENGTH);
  const [selection, setSelection] = useState(INITIAL_SELECTION);
  const [result, setResult] = useState(() => buildPassword(INITIAL_LENGTH, INITIAL_SELECTION));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  function handleLengthChange(event) {
    const next = Number(event.target.value);
    setLength(next);
    setResult(buildPassword(next, selection));
  }

  function handleToggle(key) {
    setSelection((previous) => ({ ...previous, [key]: !previous[key] }));
  }

  function handleGenerate() {
    setResult(buildPassword(length, selection));
  }

  function handleCopy() {
    const { value } = result;
    if (!value || value === '---' || value === PLACEHOLDER) return;

    navigator.clipboard.writeText(value).then(() => setCopied(true));
  }

  const copyIconClass = copied
    ? 'fa-solid fa-check text-lg text-green-400'
    : 'fa-regular fa-copy text-lg';

  return (
    <>
      <div id="generator-container" className="w-full max-w-md">
        {/* Main Card */}
        <div
          id="main-card"
          className="glass p-8 md:p-10 space-y-8 animate-in fade-in zoom-in duration-500"
        >
          {/* Password Display Area */}
          <div id="display-area" className="relative">
            <div
              className="bg-secondary rounded-[var(--radius)] p-8 border border-border flex justify-center items-center min-h-[120px] transition-all duration-300"
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              <div
                id="password-output"
                onClick={handleCopy}
                title="Click to copy"
                className={`mono text-2xl md:text-3xl font-bold tracking-widest text-center break-all text-primary select-all cursor-pointer${
                  result.empty ? ' text-slate-600' : ''
                }`}
                style={{ color: 'var(--primary)' }}
              >
                {result.value}
              </div>
            </div>
            <button
              id="copy-btn"
              type="button"
              onClick={handleCopy}
              className={`absolute -right-3 -top-3 ${
                copied ? 'bg-green-100' : 'bg-white'
              } text-primary w-12 h-12 rounded-full flex items-center justify-center border border-border shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 z-10`}
              title="Copy to Clipboard"
            >
              <i className={copyIconClass}></i>
            </button>
          </div>

          {/* Configuration Section */}
          <div id="controls" className="space-y-8">
            {/* Length Slider Control */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Key Complexity
                  </span>
                  <span className="text-xs font-semibold text-foreground/60">Length in chars</span>
                </div>
                <span
                  id="length-val"
                  className="mono text-3xl font-bold text-primary"
                  style={{ color: 'var(--primary)' }}
                >
                  {length}
                </span>
              </div>
              <input
                type="range"
                id="length-slider"
                min={MIN_LENGTH}
                max={MAX_LENGTH}
                value={length}
                onChange={handleLengthChange}
                className="w-full appearance-none cursor-pointer"
                style={{ backgroundSize: `${sliderFill(length)}% 100%` }}
              />
            </div>

            {/* Feature Toggles */}
            <div className="grid grid-cols-2 gap-4">
              {OPTIONS.map((option) => (
                <ToggleOption
                  key={option.id}
                  id={option.id}
                  label={option.label}
                  checked={selection[option.key]}
                  onChange={() => handleToggle(option.key)}
                />
              ))}
            </div>
          </div>

          {/* Primary Action */}
          <button
            id="generate-btn"
            type="button"
            onClick={handleGenerate}
            className="w-full bg-primary hover:opacity-90 text-white font-bold py-5 rounded-[var(--radius)] transition-all duration-300 transform active:scale-[0.98] shadow-xl shadow-primary/20 uppercase tracking-[0.25em] text-xs"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Generate Password
          </button>
        </div>

        {/* Minimalist Bottom Title */}
        <div className="mt-8 text-center">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground opacity-60"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Random password generator
          </span>
        </div>
      </div>
    </>
  );
}
