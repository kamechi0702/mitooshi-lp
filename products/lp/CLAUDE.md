# mitooshi — LP（Landing Page）

## このフォルダの役割

`mitooshi.jp` として公開しているLPの本体と検証資産を集約する。GitHub Pages からこのフォルダ（または CI 経由）でサーブする想定。

## ディレクトリ

```
products/lp/
├── index.html              公開LP本体（mitooshi.jp ルート）
├── privacy.html            プライバシーポリシー
├── CNAME                   GitHub Pages 用カスタムドメイン設定
├── QUICK_START.txt         開発メモ
├── assets/                 LP固有の画像
│   ├── ogp.png             OGP画像
│   ├── lp_image_01〜05.png ヒーロー・シーン画像
│   └── voice_01〜03.png    ユーザーの声アバター
└── variants/               検証版LP（トーン比較用）
    ├── lp.html             旧版
    ├── lp_検証.html
    ├── lp_検証_apple.html
    ├── lp_検証_line.html
    ├── lp_検証_mercari.html ← 採用版のベース
    └── assets/             検証版向け生成画像
```

## 編集時のルール

- **index.html を直接編集する前に** `../../shared/design-system/design-md-jp/mercari/DESIGN.md` を Read（トーンの根拠確認）
- コピー・文言を変える時は `marketing/CLAUDE.md` と `content/CLAUDE.md` のルールに従う
- 画像差し替えは `../../shared/tools/generate_images.py` 経由（`data-img-prompt` 属性）
- OGP 差し替えは `../../shared/tools/generate_ogp.py` / `generate_ogp_v2.py`

## 参照

- **デザイン参照（必須）**: `../../shared/design-system/design-md-jp/mercari/DESIGN.md`
- イラスト作画 Skill: `../../skills/mitooshi-illustration-style/SKILL.md`
- マーケティング方針: `../../marketing/CLAUDE.md`
- コンテンツルール: `../../content/CLAUDE.md`
