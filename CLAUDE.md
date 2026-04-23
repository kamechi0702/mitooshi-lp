# mitooshi

文字が読めず、指示が伝わりにくい子ども（3歳〜小学生）と保護者向けの見通しボードアプリ。
魅力的なイラストで「次にやること」を伝え、子どもの不安を解消し、保護者の声かけ疲れを軽減する。

## 体験設計の核心

- カードを事前に登録しておき、外出先や日常でワンタップで取り出して使う
- 子ども画面は **魅力的なイラスト中心・絵文字なし・タイマーなし**
- 縦型カード積層で「いま」「つぎ」が見える。上スワイプでめくる
- タイマー・実行中編集・カスタムカード・スタンプ蓄積は v1 では**作らない**（体験を削ぎ落とす）
- 時間管理は保護者の裏機能。子どもの体験には一切出さない

## ディレクトリ構成（3プロダクト + 横断資産）

```
mitooshi/
├── CLAUDE.md                         ← このファイル
├── .env                              ← API key（GEMINI_API_KEY）
│
├── products/                         ★ 3プロダクトはここに集約
│   ├── lp/                           LP（mitooshi.jp として公開）
│   │   ├── index.html                本番LP（GitHub Pages 対象）
│   │   ├── privacy.html
│   │   ├── CNAME
│   │   ├── assets/                   LP固有画像（ogp, voice, lp_image_*）
│   │   └── variants/                 検証版LP（mercari/apple/line 等）
│   │       └── assets/               検証用生成画像
│   │
│   ├── prototype/                    プロトタイプ（HTML/JSモック）
│   │   └── index.html                ← ブラウザで開ける単一ファイル
│   │
│   └── app/                          本番アプリ（React Native + Expo）
│       └── （未作成）
│
├── shared/                           ★ 3プロダクト横断の資産
│   ├── illust/                       カードイラスト
│   │   ├── original/                 いらすとや的旧版（アーカイブ）
│   │   └── mitooshi/                 mitooshi トーン版（本番採用）
│   ├── brand/                        ロゴ等ブランド資産
│   ├── design-system/                デザインシステム
│   │   ├── DESIGN.md                 mitooshi 全体のデザイン定義
│   │   └── design-md-jp/             各社 DESIGN.md 参照ライブラリ（23ブランド）
│   └── tools/                        生成スクリプト
│       ├── generate_cards.py         カード一括 image-to-image 変換
│       ├── generate_images.py        LP 画像一括生成
│       ├── generate_ogp.py           OGP 画像生成
│       └── generate_ogp_v2.py        OGP 画像生成 v2
│
├── pdm/                              PdM成果物（プロダクト横断）
│   ├── CLAUDE.md                     PdM 視点ガイド
│   ├── PRD_v3_MVP.md                 現行PRD（v3.0）
│   ├── DESIGN_HANDOFF.md             デザイン刷新ブリーフ
│   ├── preset_scenes.md              プリセット3シーンのカード内訳
│   ├── card_library_draft.md         カードライブラリ素案
│   └── illustration_style_guide.md   AI画像生成スタイルガイド
│
├── skills/
│   └── mitooshi-illustration-style/SKILL.md   イラスト作画 Skill
│
├── business/CLAUDE.md                事業責任者ガイド
├── content/CLAUDE.md                 コンテンツ・文言ルール
├── development/CLAUDE.md             開発ガイド
├── design/CLAUDE.md                  デザインガイド
├── marketing/CLAUDE.md               マーケティングガイド
│
└── archive/                          旧資料（参考保管）
    ├── mitooshi_サービスコンセプト.html   v1時代の旧コンセプト（破棄済みだが履歴保存）
    ├── mitooshi_画面モック.jsx
    └── mitooshi_mock.html
```

## プロダクト別の開発フロー

### LP（products/lp/）
- 公開ドメイン：mitooshi.jp（GitHub Pages 経由）
- 本番：`products/lp/index.html`
- 検証版：`products/lp/variants/lp_検証_*.html`
- 画像生成：`shared/tools/generate_images.py`（`data-img-prompt` 属性から一括）
- OGP：`shared/tools/generate_ogp.py` / `generate_ogp_v2.py`

### Prototype（products/prototype/）
- ブラウザで `index.html` を直接開いて検証する単一ファイル
- カードイラストは `shared/illust/mitooshi/*.png` を参照
- 主目的：体験仕様の触感検証（2タップ原則・縦型積層・スワイプ）

### App（products/app/）
- 本番アプリ。React Native + Expo（予定）
- カードイラストは `shared/illust/mitooshi/` を同梱想定
- 着手時は `pdm/PRD_v3_MVP.md` と `pdm/DESIGN_HANDOFF.md` を必読

## 横断資産の参照ルール

### カードイラスト
- **本番採用版**：`shared/illust/mitooshi/*.png`（31枚、image-to-image で mitooshi トーン統一済み）
- **旧版（アーカイブ）**：`shared/illust/original/*.png`（31枚、いらすとや的トーン。再生成の入力として保持）
- 新規生成：`shared/tools/generate_cards.py` を使用

### デザインシステム参照（必須）
**UI・LP・モック・スライド等のあらゆるビジュアル成果物を作る前に、必ず `shared/design-system/design-md-jp/mercari/DESIGN.md` を Read してから着手すること**。mitooshi のデザイン言語は mercari DESIGN.md ベース + ブランドカラーをミントグリーン **#00B894** に差し替えた構成。

参照ライブラリ（23ブランド）：`shared/design-system/design-md-jp/` に abema / apple / connpass / cookpad / cybozu / freee / line / mercari / moneyforward / muji / note / notion / novasell / pixiv / qiita / rakuten / sansan / smarthr / studio / tabelog / toyota / wired / zenn を配置。出典：https://github.com/kzhrknt/awesome-design-md-jp

### イラスト作画ルール
キャラクター系イラストを作る前には、必ず `skills/mitooshi-illustration-style/SKILL.md` を Read。フラットベクター・線画なし・ミント/ブルー/ソフトピンクの統一ルールを守る。

### AI 画像生成
- 採用ツール：**nano banana 2（gemini-3-pro-image-preview）via Google AI Studio** に固定
- API キーはルートの `.env` に `GEMINI_API_KEY=xxxxx`（取得：https://aistudio.google.com/apikey）
- 他ツール（Midjourney / DALL-E / Firefly）への切替は原則禁止

## 共通ルール

- サービス名は **mitooshi**（小文字アルファベット表記）
- 医療行為・治療の代替ではない。「生活支援ツール」として位置づける
- 子どもの個人情報は最小限に扱い、プライバシーに配慮する
- カードラベルは**ひらがな8文字以内の名詞＋動詞形式**（例：はをみがく／くつをはく）

## GitHub Pages デプロイ設定

LP 本体を `products/lp/` 配下へ移動したため、GitHub Pages の Source 設定を以下のいずれかに切り替える必要がある：

- **推奨**：GitHub Pages の Source を `main` / `docs` にして、CI で `products/lp/` → `docs/` へコピーするワークフローを追加
- **簡易**：Pages 設定画面で Source Branch のフォルダを `/ (root)` から `/products/lp` へ変更（GitHub UI で選択可能）

CNAME は `products/lp/CNAME` に移動済み。mitooshi.jp の DNS 設定は変更不要。

## 各CLAUDE.mdの使い方

各ディレクトリの CLAUDE.md は、その職種の役割で作業するときに参照する。具体的な仕様はそれぞれ以下に集約：

- 体験仕様・機能要件 → `pdm/PRD_v3_MVP.md`
- カードライブラリ・プリセット内訳 → `pdm/card_library_draft.md` / `pdm/preset_scenes.md`
- イラストルール → `pdm/illustration_style_guide.md` / `skills/mitooshi-illustration-style/SKILL.md`
- LP コンテンツ・文言 → `content/CLAUDE.md` / `marketing/CLAUDE.md`
- UI 実装 → `development/CLAUDE.md` + `shared/design-system/DESIGN.md`
