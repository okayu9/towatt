import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

export const themeVars = createGlobalTheme(':root', {
  color: {
    background: '#f7f7f8',
    surface: '#ffffff',
    panelBackground: 'rgba(255, 255, 255, 0.92)',
    panelBorder: '#e0e0ec',
    stageFrom: '#e6ecff',
    stageTo: '#fdf0ff',
    text: '#1f1f24',
    subtleText: '#4a4a55',
    mutedText: '#6c6c76',
    border: '#d0d0d8',
    primary: '#5078ff',
    primaryAlt: '#40c3ff',
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
  shadow: {
    panel: '0 32px 72px rgba(36, 62, 128, 0.18)',
  },
});

globalStyle(':root', {
  colorScheme: 'light',
  fontFamily:
    "'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  backgroundColor: themeVars.color.background,
  color: themeVars.color.text,
  vars: {
    '--app-background': `linear-gradient(135deg, ${themeVars.color.stageFrom} 0%, ${themeVars.color.stageTo} 100%)`,
  },
});

globalStyle('*', {
  boxSizing: 'border-box',
});

globalStyle('body', {
  margin: 0,
  minHeight: '100vh',
  background: `var(--app-background, linear-gradient(135deg, ${themeVars.color.stageFrom} 0%, ${themeVars.color.stageTo} 100%))`,
  backgroundAttachment: 'fixed',
});

globalStyle('.app', {
  minHeight: '100svh',
  width: '100%',
  maxWidth: 'min(960px, 100%)',
  margin: '0 auto',
  padding: 'clamp(32px, 5vw, 84px) clamp(20px, 6vw, 96px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
});

globalStyle('.view', {
  position: 'relative',
  display: 'grid',
  gridAutoRows: 'minmax(0, 1fr)',
  justifyItems: 'stretch',
  alignContent: 'center',
  flex: 1,
  width: '100%',
});

globalStyle('.view[hidden]', {
  display: 'none !important',
});

globalStyle('.view__header', {
  textAlign: 'left',
});

globalStyle('.view__title', {
  margin: '0 0 4px',
  fontSize: 'clamp(26px, 5vw, 36px)',
  fontWeight: 700,
});

globalStyle('.view__lead', {
  margin: 0,
  fontSize: 'clamp(15px, 3vw, 18px)',
  color: themeVars.color.subtleText,
});

globalStyle('.view__panel', {
  display: 'grid',
  gap: '24px',
  padding: 'clamp(32px, 6vw, 72px)',
  borderRadius: '32px',
  background: themeVars.color.panelBackground,
  boxShadow: themeVars.shadow.panel,
  border: `1px solid ${themeVars.color.panelBorder}`,
  width: '100%',
  backdropFilter: 'blur(18px)',
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

globalStyle('.calc-stage', {
  display: 'grid',
  width: '100%',
  gridAutoRows: 'minmax(0, 1fr)',
});

globalStyle('.calc-step', {
  display: 'grid',
  gridTemplateRows: 'auto 1fr auto',
  gap: 'clamp(24px, 4vw, 40px)',
  padding: 'clamp(32px, 6vw, 80px)',
  borderRadius: '32px',
  background: themeVars.color.panelBackground,
  boxShadow: themeVars.shadow.panel,
  border: `1px solid ${themeVars.color.panelBorder}`,
  minHeight: 'min(80vh, 760px)',
  width: '100%',
  maxWidth: 'min(840px, 100%)',
  justifySelf: 'center',
  backdropFilter: 'blur(18px)',
});

globalStyle('.calc-step[hidden]', {
  display: 'none !important',
});

globalStyle('.calc-step__header', {
  textAlign: 'left',
});

globalStyle('.calc-step__meta', {
  margin: 0,
  fontSize: '12px',
  color: themeVars.color.mutedText,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
});

globalStyle('.calc-step__meta-badge', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 12px',
  borderRadius: themeVars.radius.pill,
  background: 'rgba(80, 120, 255, 0.12)',
  color: themeVars.color.secondaryText,
});

globalStyle('.calc-step__meta-value', {
  fontSize: '14px',
  fontWeight: 700,
});

globalStyle('.calc-step__meta-unit', {
  fontSize: '11px',
  color: themeVars.color.subtleText,
});

globalStyle('.calc-step__title', {
  margin: '0 0 4px',
  fontSize: 'clamp(26px, 5vw, 36px)',
  fontWeight: 700,
});

globalStyle('.calc-step__lead', {
  margin: 0,
  fontSize: 'clamp(15px, 3vw, 18px)',
  color: themeVars.color.subtleText,
});

globalStyle('.calc-step__actions', {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  alignSelf: 'flex-end',
  width: '100%',
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

globalStyle('.source-power', {
  display: 'grid',
  gap: 'clamp(16px, 4vw, 28px)',
});

globalStyle('.preset-buttons', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '14px',
});

globalStyle('.preset-button', {
  padding: '16px',
  fontSize: '18px',
  borderRadius: '18px',
  border: `1px solid ${themeVars.color.panelBorder}`,
  background: themeVars.color.surface,
  fontWeight: 600,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
});

globalStyle('.preset-button.is-active', {
  borderColor: themeVars.color.primary,
  background: themeVars.color.presetActiveBg,
  color: themeVars.color.text,
  transform: 'translateY(-2px)',
  boxShadow: '0 16px 32px rgba(80, 120, 255, 0.15)',
});

globalStyle('.preset-button:hover', {
  transform: 'translateY(-2px)',
  boxShadow: '0 16px 28px rgba(33, 56, 120, 0.12)',
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
  fontSize: '20px',
  padding: '14px 16px',
  borderRadius: '16px',
  border: `1px solid ${themeVars.color.panelBorder}`,
  textAlign: 'right',
});

globalStyle('.manual-input input:focus', {
  outline: `3px solid ${themeVars.focus.outline}`,
  borderColor: themeVars.color.primary,
});

globalStyle('.time-input__display', {
  padding: '24px',
  borderRadius: '24px',
  background: themeVars.color.surface,
  border: `1px solid ${themeVars.color.panelBorder}`,
  textAlign: 'center',
  fontWeight: 700,
});

globalStyle('.time-display', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: 'clamp(40px, 6vw, 56px)',
  fontVariantNumeric: 'tabular-nums',
});

globalStyle('.time-digit', {
  display: 'inline-flex',
  justifyContent: 'center',
  minWidth: '1.5ch',
  padding: '0 2px 6px',
  borderBottom: '3px solid transparent',
  transition: 'border-color 0.2s ease, color 0.2s ease',
});

globalStyle('.time-digit.is-empty', {
  color: themeVars.color.mutedText,
  opacity: 0.7,
});

globalStyle('.time-digit.is-active', {
  borderColor: themeVars.color.primary,
  color: themeVars.color.primary,
  opacity: 1,
});

globalStyle('.time-digit-separator', {
  opacity: 0.35,
});

globalStyle('.time-digit-separator::selection', {
  background: 'transparent',
});

globalStyle('.time-digit::selection', {
  background: 'transparent',
});

globalStyle('.keypad', {
  marginTop: '24px',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '16px',
});

globalStyle('.keypad__key', {
  padding: '18px',
  fontSize: 'clamp(18px, 3vw, 22px)',
  borderRadius: '20px',
  border: `1px solid ${themeVars.color.panelBorder}`,
  background: themeVars.color.surface,
  fontWeight: 600,
});

globalStyle('.keypad__key--zero', {
  gridColumn: '2 / 3',
});

globalStyle('.keypad__key:active', {
  background: themeVars.color.keypadActiveBg,
});

globalStyle('.time-preview', {
  marginTop: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  fontSize: '16px',
});

globalStyle('.time-preview__seconds', {
  color: themeVars.color.subtleText,
  fontSize: '14px',
});

globalStyle('.result', {
  padding: '28px',
  borderRadius: '28px',
  background: themeVars.color.surface,
  border: `1px solid ${themeVars.color.panelBorder}`,
  boxShadow: '0 20px 44px rgba(33, 56, 120, 0.12)',
});

globalStyle('.result__summary', {
  margin: '0 0 10px',
  fontSize: 'clamp(28px, 4vw, 36px)',
  fontWeight: 700,
});

globalStyle('.result__seconds', {
  margin: '0 0 16px',
  fontSize: 'clamp(16px, 3vw, 18px)',
  color: themeVars.color.subtleText,
});

globalStyle('.result__seconds:empty', {
  display: 'none',
});

globalStyle('.result__note', {
  margin: 0,
  fontSize: '12px',
  color: themeVars.color.mutedText,
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
