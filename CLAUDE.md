# mitooshi

文字が読めず、指示が伝わりにくい子ども（3歳〜小学生）と保護者向けの見通しボードアプリ。
魅力的なイラストで「次にやること」を伝え、子どもの不安を解消し、保護者の声かけ疲れを軽減する。

## 体験設計の核心

- 子どもが見るのは **「いま・つぎ・ゴール」の3枚構造**。手順リストではなく、心理の流れで設計する
- 子ども画面は **文字なし・タイマーなし**。魅力的なイラストのみで伝える
- ゴールの絵（ポジティブな結末）は常に画面に見えている
- 飽き防止: イラストの日替わり・季節替わり、操作バリエーション、ランダム達成演出
- 「いまから」ボタン: 外出先で咄嗟に1枚だけ見せるクイック機能
- 「おちつく」モード: パニック時にゴールや好きなものの絵を全画面表示
- 時間管理は保護者の裏機能。子どもの体験には一切出さない

## ディレクトリ構成

```
mitooshi/
├── CLAUDE.md              ← このファイル（プロジェクト全体の案内）
├── doc/                   ← 参照ドキュメント
│   ├── mitooshi_サービスコンセプト.html
│   ├── mitooshi_画面モック.jsx
│   ├── DESIGN.md          ← デザインシステム定義（Google Stitch方式）
│   └── design-md-jp/      ← 日本語化された各社デザインmd参照ライブラリ（23ブランド）
├── business/CLAUDE.md     ← 事業責任者
├── pdm/CLAUDE.md          ← PdM（プロダクトマネージャー）
├── design/CLAUDE.md       ← デザイン
├── marketing/CLAUDE.md    ← マーケティング
├── content/CLAUDE.md      ← コンテンツ作成
└── development/CLAUDE.md  ← 開発
```

## 各CLAUDE.mdの使い方

各ディレクトリのCLAUDE.mdは、その職種の役割で作業するときに参照する。具体的な仕様（みとおしカード定義、価格、画面設計等）はdoc/配下の資料に集約しているため、CLAUDE.mdは役割定義と判断基準のみを記載している。

## デザインシステムについて

`doc/DESIGN.md` はGoogle Stitch方式に準拠したmitooshi本体のデザインシステム定義ファイル。UI生成・レビュー時はこのファイルを参照し、ビジュアルの一貫性を保つこと。design/CLAUDE.mdが役割と原則、DESIGN.mdが具体値という分担。

### 参照デザインライブラリ（必読）

`doc/design-md-jp/` に日本語化された各社のDESIGN.md（abema, apple, connpass, cookpad, cybozu, freee, line, mercari, moneyforward, muji, note, notion, novasell, pixiv, qiita, rakuten, sansan, smarthr, studio, tabelog, toyota, wired, zenn の23ブランド）を配置している。

**UI・LP・モック・スライド等のあらゆるビジュアル成果物を作る前に、必ずこのフォルダ内から参考になるブランドを1つ以上選び、該当する `doc/design-md-jp/{brand}/DESIGN.md` を Read してから着手すること**。英語の本家リポジトリ（Google Stitch等）を直接参照せず、必ずこの日本語版を一次情報として使う。

出典: https://github.com/kzhrknt/awesome-design-md-jp

## 共通ルール

- サービス名は **mitooshi**（小文字アルファベット表記）
- 医療行為・治療の代替ではない。「生活支援ツール」として位置づける
- 子どもの個人情報は最小限に扱い、プライバシーに配慮する
