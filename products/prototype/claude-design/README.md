# mitooshi — Claude Design 版プロトタイプ

Claude Design (claude.ai/design) からエクスポートされた React/JSX ベースの v3 プロトタイプ。`/Users/kamechi/Downloads/mitooshi-handoff.zip` を repo に取り込んだもの。

既存の vanilla JS 版 (`products/prototype/index.html`) とは別系統で、AB 比較用に並走させる。

## 起動方法

外部 `.jsx` を `<script type="text/babel" src="...">` で読み込むため、Babel standalone が XHR fetch する。`file://` 直開きでは CORS で動かないので、必ずローカル HTTP server 経由で開く。

```bash
cd products/prototype/claude-design
python3 -m http.server 8765
```

ブラウザで `http://localhost:8765/` を開く。

## ファイル構成

```
claude-design/
├── index.html            ハンドオフ mitooshi.html を改名
├── README.md             このファイル
├── app/
│   ├── styles.css        デザイントークン + 全コンポーネント CSS
│   ├── icons.jsx         24種の SVG アイコン
│   ├── screens.jsx       8画面 + Onboarding + Modal の JSX
│   └── app.jsx           ルート App + ILLUST_LIB + 状態管理
├── tweaks-panel.jsx      実行時 UI tweak パネル (デザイン微調整用)
└── design-canvas.jsx     Figma風キャンバス (view='canvas' 時のみ表示)
```

## イラスト参照

`app/app.jsx` 内の `ILLUST_LIB` は `shared/illust/mitooshi/` の本番イラスト (31 枚 PNG/JPG、日本語ファイル名) を参照する。パスヘルパー:

```js
const REAL = (name) => '../../../shared/illust/mitooshi/' + encodeURIComponent(name);
```

カテゴリは `一日 / 食事 / おでかけ / おかいもの / 学校 / ごほうび` の 6 種、計 30 エントリ。

## 既存 vanilla JS 版との違い

| 観点 | vanilla JS 版 (`../index.html`) | Claude Design 版 (このフォルダ) |
|---|---|---|
| 起動 | `file://` で直開き可 | 要 HTTP server |
| 実装 | 単一 HTML、`h()` ヘルパ + state object | React 18 + JSX (Babel standalone) |
| 行数 | 2628 行 | 多ファイル分割 (~1000行 styles.css 等) |
| デザイン微調整 | コード直編集 | tweaks-panel.jsx の GUI から可能 |
| 全画面俯瞰 | `v3_mock.html` 別ファイル | view='canvas' で内蔵 |

## React Native + Expo 化

`products/app/` への移植は別セッションで実施予定。本フォルダはあくまで HTML/JS プロトタイプとして保持し、本番アプリ実装の参照資料として使う。
