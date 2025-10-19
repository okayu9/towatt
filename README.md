# Towatt

## 概要
- 電子レンジの出力違いによる加熱時間を換算するシングルページアプリケーションです。
- 対応ワット数をクエリパラメータ（例: `?target=600`）で指定でき、ブックマークから即利用できます。
- TypeScript + esbuild と vanilla-extract を用い、最終成果物は HTML1枚に CSS/JS をインライン化した構成です。

## 特長
- プリセット（1500W / 700W / 600W / 500W）と任意入力を切り替えて弁当ラベルのワット数を指定可能です。
- 4桁固定のテンキー入力で分秒を正規化し、対応ワット数で必要な時間を自動算出します。
- スマートフォン操作を想定した大きめのUIと `aria-live` によるスクリーンリーダー配慮を実装しています。
- 対応ワット数付きURLでアクセスした場合は換算画面から開始し、設定が未済なら初期画面で案内します。

## プロジェクト構成
```
├─ docs/                # 要件・実装メモ
├─ scripts/             # ビルド補助スクリプト (Node.js ES Modules)
├─ src/                 # HTML / TypeScript / vanilla-extract スタイル定義
├─ package.json         # スクリプトと依存関係
├─ tsconfig.json        # TypeScript コンパイラ設定
└─ (build|dist)/        # ビルド時に生成される成果物
```

詳細な要件や実装方針は `docs/requirements.md` と `docs/implementation.md` をご参照ください。

## セットアップ
### 前提条件
- Node.js 18 LTS 以降（ESM と esbuild の動作確認済みバージョンを推奨）
- npm (Node.js 同梱)

### インストール
```bash
npm install
```

## 利用方法
基本的なフローは以下の通りです。
1. `npm run build` で TypeScript と vanilla-extract をバンドルし、`build/` に IIFE 形式の `main.js` と `main.css` を生成します。
2. `npm run inline-css` で `src/index.html` に CSS をインライン化した `build/index.html` を作成します。
3. `npm run bundle-html` で JavaScript をインライン化し、配布用の `dist/index.html` を出力します。
4. 完全なビルドを一括実行する場合は `npm run dist` をお使いください（`clean → build → inline-css → bundle-html` の順で処理します）。

出力された `dist/index.html` をブラウザで開くと、オフラインでも単独で動作します。シンプルなHTTPサーバー経由で確認する場合は、以下のように実行できます。
```bash
npx serve dist
```

## 計算ロジックの概要
- 熱量等価の式 `sourcePower * sourceTime = targetPower * targetTime` を使用し、四捨五入 (`Math.round`) で秒単位に換算します。
- テンキー入力は常に4桁を受け取り、上位2桁を分、下位2桁を秒として解釈した後で正規化します。
- 結果は `mm:ss` 形式で表示し、補足として合計秒数を示します。

## npm スクリプト一覧
- `npm run clean` : `build/` と `dist/` を削除します。
- `npm run build` : esbuild で TypeScript とスタイルをバンドルします。
- `npm run inline-css` : ビルド済み CSS を HTML にインライン化します。
- `npm run bundle-html` : ビルド済み JS を HTML にインライン化します。
- `npm run dist` : クリーンから最終出力までの一連の処理を行います。

## ライセンス
- 本プロジェクトのライセンスは `package.json` に従い ISC です。
