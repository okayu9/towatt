export type LocaleDictionary = Record<string, string>;

export const defaultLocale: LocaleDictionary = {
  "document.title": "電子レンジ加熱時間換算ツール",
  "setup.title": "対応ワット数",
  "setup.label": "ワット数",
  "setup.placeholder": "例: 600",
  "setup.submit": "セット",
  "badges.targetPowerLong": "対応ワット数",
  "badges.targetPowerShort": "対応",
  "badges.labelPower": "ラベル",
  "source.title": "表示ラベルのワット数",
  "source.manualLabel": "手動入力のワット数",
  "source.manualPlaceholder": "例: 800",
  "source.presetAria": "プリセットワット数",
  "time.title": "加熱時間",
  "time.keypadAria": "時間入力",
  "keypad.clear": "クリア",
  "result.title": "換算結果",
  "result.pending": "結果待ち",
  "result.note": "※換算結果は目安です。食材の状態に応じて調整してください。",
  "result.editSource": "ワット数を再選択",
  "result.totalSeconds": "合計 {seconds}秒",
  "time.preview.waiting": "入力待ち",
  "time.preview.normalized": "正規化: {minutes}分{seconds}秒",
  "time.preview.total": "合計 {seconds}秒",
  "errors.missing": "ワット数と時間を入力してください",
  "errors.nonPositive": "加熱時間は1秒以上で指定してください",
  "errors.invalidRange": "ワット数は100〜3000の範囲で指定してください",
  "privacy.open": "プライバシーポリシー",
  "privacy.title": "プライバシーポリシー",
  "privacy.closeLabel": "閉じる",
  "privacy.closeButton": "閉じる",
  "privacy.body": `当サイトでは、利用状況を把握しサービス品質の向上に役立てるため、Google アナリティクスを含む解析ツールを使用しています。収集されるデータには個人を特定できる情報は含まれず、Google のポリシーに基づき管理されます。`,
  "privacy.section.collect": "収集する情報",
  "privacy.section.collect.body": `利用端末や操作内容など、アプリの利用状況を示すデータが記録されます。これにはページ遷移を伴わない操作イベントや、入力値の範囲といった統計的な情報が含まれる場合があります。`,
  "privacy.section.purpose": "利用目的",
  "privacy.section.purpose.body": "収集したデータは、機能改善・サービス品質向上のための分析にのみ使用し、第三者への無断提供は行いません。",
  "privacy.section.analytics": "Google アナリティクスについて",
  "privacy.section.analytics.body": `詳細は <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" rel="noopener noreferrer" class="privacy-modal__link">Google アナリティクス利用規約</a> および <a href="https://policies.google.com/privacy?hl=ja" target="_blank" rel="noopener noreferrer" class="privacy-modal__link">Google プライバシーポリシー</a> をご参照ください。`,
  "privacy.section.optout.body": `Google アナリティクスによるデータ収集を無効にするには、ブラウザ向けの <a href="https://tools.google.com/dlpage/gaoptout?hl=ja" target="_blank" rel="noopener noreferrer" class="privacy-modal__link">オプトアウトアドオン</a> をご利用いただけます。`,
};

declare global {
  interface Window {
    towattLocale?: Record<string, string> | undefined;
  }
}

export function getActiveLocale(): LocaleDictionary {
  const overrides = typeof window !== "undefined" ? window.towattLocale : undefined;
  if (overrides && typeof overrides === "object") {
    return { ...defaultLocale, ...overrides };
  }
  return { ...defaultLocale };
}

export function translate(
  dictionary: LocaleDictionary,
  key: string,
  params?: Record<string, string | number>,
): string {
  const template = dictionary[key];
  if (!template) {
    return key;
  }
  if (!params) {
    return template;
  }
  return Object.entries(params).reduce((text, [name, value]) => {
    const pattern = new RegExp(`\\{${name}\\}`, "g");
    return text.replace(pattern, String(value));
  }, template);
}

export function applyDocumentLocale(dictionary: LocaleDictionary): void {
  document.title = translate(dictionary, "document.title");

  const textElements = document.querySelectorAll<HTMLElement>("[data-locale-key]");
  textElements.forEach((element) => {
    const key = element.dataset.localeKey;
    if (!key) {
      return;
    }
    const htmlMode = element.dataset.localeMode === "html";
    const value = translate(dictionary, key);
    if (htmlMode) {
      element.innerHTML = value;
    } else {
      element.textContent = value;
    }
  });

  const attrElements = document.querySelectorAll<HTMLElement>("[data-locale-attr]");
  attrElements.forEach((element) => {
    const raw = element.dataset.localeAttr;
    if (!raw) {
      return;
    }
    raw.split(",").forEach((entry) => {
      const [attr, key] = entry.split(":");
      if (!attr || !key) {
        return;
      }
      const trimmedAttr = attr.trim();
      const trimmedKey = key.trim();
      element.setAttribute(trimmedAttr, translate(dictionary, trimmedKey));
    });
  });
}
