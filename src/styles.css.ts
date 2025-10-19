import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

export const themeVars = createGlobalTheme(':root', {
  color: {
    background: '#f7f7f8',
    surface: '#ffffff',
    text: '#1f1f24',
    subtleText: '#4a4a55',
    mutedText: '#6c6c76',
    border: '#d0d0d8',
    panelBorder: '#e0e0ec',
    primary: '#5078ff',
    primaryAlt: '#40c3ff',
    toastBackground: 'rgba(80, 120, 255, 0.92)',
    toastText: '#ffffff',
    presetActiveBg: 'rgba(80, 120, 255, 0.08)',
    keypadActiveBg: 'rgba(80, 120, 255, 0.12)',
    errorBackground: 'rgba(234, 64, 89, 0.16)',
    errorText: '#b20024',
    secondaryText: '#2440a8',
    disabledPrimaryBackground: '#c7d2ff',
    disabledPrimaryText: 'rgba(255, 255, 255, 0.75)',
  },
  focus: {
    outline: 'rgba(80, 120, 255, 0.35)',
  },
  radius: {
    card: '16px',
    largeCard: '20px',
    pill: '999px',
    input: '12px',
    keypad: '16px',
  },
});

globalStyle(':root', {
  colorScheme: 'light',
  fontFamily:
    "'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  backgroundColor: themeVars.color.background,
  color: themeVars.color.text,
  vars: {
    '--app-background': themeVars.color.background,
  },
});

globalStyle('*', {
  boxSizing: 'border-box',
});

globalStyle('body', {
  margin: 0,
  background: `var(--app-background, ${themeVars.color.background})`,
});

globalStyle('.app', {
  minHeight: '100vh',
  maxWidth: '420px',
  margin: '0 auto',
  padding: '24px 20px 40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  '@media': {
    '(min-width: 480px)': {
      padding: '32px 24px 48px',
    },
  },
});

globalStyle('.view', {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  flex: 1,
});

globalStyle('.view[hidden]', {
  display: 'none !important',
});

globalStyle('.view__header', {
  textAlign: 'left',
});

globalStyle('.view__title', {
  margin: '0 0 4px',
  fontSize: '20px',
  fontWeight: 700,
});

globalStyle('.view__lead', {
  margin: 0,
  fontSize: '15px',
  color: themeVars.color.subtleText,
});

globalStyle('.view__note', {
  margin: 0,
  fontSize: '13px',
  color: themeVars.color.subtleText,
});

globalStyle('.setup-form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

globalStyle('.setup-form__label', {
  fontSize: '14px',
  fontWeight: 600,
});

globalStyle('.setup-form__input', {
  fontSize: '20px',
  padding: '12px 14px',
  border: `2px solid ${themeVars.color.border}`,
  borderRadius: themeVars.radius.input,
  textAlign: 'right',
});

globalStyle('.setup-form__input:focus', {
  outline: `3px solid ${themeVars.focus.outline}`,
  borderColor: themeVars.color.primary,
});

globalStyle('.setup-form__submit', {
  fontSize: '16px',
  padding: '12px',
  borderRadius: themeVars.radius.pill,
  border: 'none',
  background: `linear-gradient(135deg, ${themeVars.color.primary} 0%, ${themeVars.color.primaryAlt} 100%)`,
  color: '#fff',
  fontWeight: 600,
});

globalStyle('.section-title', {
  margin: '0 0 8px',
  fontSize: '16px',
  fontWeight: 700,
});

globalStyle('.calc-step', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  minHeight: 'calc(100vh - 120px)',
});

globalStyle('.calc-step[hidden]', {
  display: 'none !important',
});

globalStyle('.calc-step__header', {
  textAlign: 'left',
});

globalStyle('.calc-step__meta', {
  margin: '0 0 8px',
  fontSize: '13px',
  color: themeVars.color.subtleText,
});

globalStyle('.calc-step__title', {
  margin: '0 0 4px',
  fontSize: '22px',
  fontWeight: 700,
});

globalStyle('.calc-step__lead', {
  margin: 0,
  fontSize: '15px',
  color: themeVars.color.subtleText,
});

globalStyle('.calc-step__actions', {
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

globalStyle('.calc-step__actions--split', {
  flexDirection: 'row',
  gap: '12px',
  flexWrap: 'wrap',
});

globalStyle('.calc-step__actions--split button', {
  flex: '1 1 48%',
});

globalStyle('.calc-step__next, .calc-step__secondary, .calc-step__ghost', {
  padding: '14px',
  borderRadius: themeVars.radius.pill,
  fontSize: '16px',
  fontWeight: 600,
  border: 'none',
});

globalStyle('.calc-step__next', {
  background: `linear-gradient(135deg, ${themeVars.color.primary} 0%, ${themeVars.color.primaryAlt} 100%)`,
  color: '#fff',
});

globalStyle('.calc-step__next:disabled', {
  background: themeVars.color.disabledPrimaryBackground,
  color: themeVars.color.disabledPrimaryText,
});

globalStyle('.calc-step__secondary', {
  background: '#fff',
  border: `2px solid ${themeVars.color.primary}`,
  color: themeVars.color.secondaryText,
});

globalStyle('.calc-step__ghost', {
  background: '#fff',
  border: `2px solid ${themeVars.color.border}`,
  color: themeVars.color.subtleText,
});

globalStyle('.bookmark', {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '16px',
  borderRadius: themeVars.radius.card,
  background: themeVars.color.surface,
  border: `1px solid ${themeVars.color.panelBorder}`,
  wordBreak: 'break-all',
});

globalStyle('.bookmark__label', {
  fontSize: '13px',
  color: themeVars.color.subtleText,
  fontWeight: 600,
});

globalStyle('.bookmark__value', {
  fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
  fontSize: '15px',
});

globalStyle('.preset-buttons', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '10px',
});

globalStyle('.preset-button', {
  padding: '12px',
  fontSize: '16px',
  borderRadius: themeVars.radius.card,
  border: `1px solid ${themeVars.color.border}`,
  background: themeVars.color.surface,
  fontWeight: 600,
});

globalStyle('.preset-button.is-active', {
  borderColor: themeVars.color.primary,
  background: themeVars.color.presetActiveBg,
  color: themeVars.color.text,
});

globalStyle('.manual-input', {
  marginTop: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

globalStyle('.manual-input__label', {
  fontSize: '14px',
  fontWeight: 600,
});

globalStyle('.manual-input input', {
  fontSize: '18px',
  padding: '10px 12px',
  borderRadius: themeVars.radius.input,
  border: `1px solid ${themeVars.color.border}`,
  textAlign: 'right',
});

globalStyle('.manual-input input:focus', {
  outline: `3px solid ${themeVars.focus.outline}`,
  borderColor: themeVars.color.primary,
});

globalStyle('.time-input__display', {
  padding: '16px',
  borderRadius: themeVars.radius.card,
  background: themeVars.color.surface,
  border: `1px solid ${themeVars.color.panelBorder}`,
  textAlign: 'center',
  fontSize: '32px',
  fontWeight: 700,
});

globalStyle('.time-input__guidance', {
  margin: '8px 0 0',
  fontSize: '13px',
  color: themeVars.color.subtleText,
});

globalStyle('.keypad', {
  marginTop: '16px',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '12px',
});

globalStyle('.keypad__key', {
  padding: '16px',
  fontSize: '18px',
  borderRadius: themeVars.radius.keypad,
  border: `1px solid ${themeVars.color.border}`,
  background: themeVars.color.surface,
  fontWeight: 600,
});

globalStyle('.keypad__key:active', {
  background: themeVars.color.keypadActiveBg,
});

globalStyle('.time-preview', {
  marginTop: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  fontSize: '15px',
});

globalStyle('.time-preview__seconds', {
  color: themeVars.color.subtleText,
  fontSize: '13px',
});

globalStyle('.result', {
  padding: '20px',
  borderRadius: themeVars.radius.largeCard,
  background: themeVars.color.surface,
  border: `1px solid ${themeVars.color.panelBorder}`,
});

globalStyle('.result__summary', {
  margin: '0 0 8px',
  fontSize: '26px',
  fontWeight: 700,
});

globalStyle('.result__seconds', {
  margin: '0 0 12px',
  fontSize: '16px',
  color: themeVars.color.subtleText,
});

globalStyle('.result__note', {
  margin: 0,
  fontSize: '12px',
  color: themeVars.color.mutedText,
});

globalStyle('.toast', {
  position: 'sticky',
  top: '12px',
  margin: '-12px 0',
  padding: '12px 16px',
  borderRadius: themeVars.radius.pill,
  background: themeVars.color.toastBackground,
  color: themeVars.color.toastText,
  textAlign: 'center',
  fontWeight: 600,
  zIndex: 10,
});

globalStyle('.toast[hidden]', {
  display: 'none',
});

globalStyle('.error-banner', {
  margin: 0,
  padding: '14px',
  borderRadius: '14px',
  background: themeVars.color.errorBackground,
  color: themeVars.color.errorText,
  fontSize: '14px',
  textAlign: 'center',
});

globalStyle('.error-banner[hidden]', {
  display: 'none',
});
