# mitooshi — shared/（プロダクト横断資産）

## このフォルダの役割

LP・プロトタイプ・アプリの3プロダクトが**共通で参照する資産**を集約する。「同じ画像を3箇所にコピーする」を避けるため、唯一の出典をここに置く。

## ディレクトリ

```
shared/
├── illust/                    カードイラスト
│   ├── original/              いらすとや的旧版（再生成入力／アーカイブ用に保持）
│   └── mitooshi/              ★mitooshi トーン版（本番採用・全プロダクトから参照）
│
├── brand/                     ブランド資産
│   └── logo.png               mitooshi ロゴ（LP・アプリで共用）
│
├── design-system/             デザインシステム
│   ├── DESIGN.md              mitooshi 全体のデザイン定義
│   └── design-md-jp/          各社 DESIGN.md 参照ライブラリ（23ブランド）
│       ├── mercari/DESIGN.md  ★mitooshi のベース
│       └── ...
│
└── tools/                     生成スクリプト
    ├── generate_cards.py      カード一括 image-to-image 変換
    ├── generate_images.py     LP HTML 内の画像一括生成
    ├── generate_ogp.py        OGP 画像生成（image-to-image）
    └── generate_ogp_v2.py     OGP 画像生成 v2
```

## 各プロダクトからの参照例

```
# プロトタイプ → カードイラスト
products/prototype/index.html → ../../shared/illust/mitooshi/おきる.png

# LP → ロゴ
products/lp/index.html → ../../shared/brand/logo.png

# どこからでも → デザインシステム参照
*/CLAUDE.md → shared/design-system/design-md-jp/mercari/DESIGN.md
```

## 編集ルール

- **shared/ の中身を変える時は3プロダクトすべての影響を意識する**
- 新しいカードを追加した場合、各プロダクトでカード一覧を更新する必要がある
- デザインシステムを変更する場合、変更履歴を `pdm/illustration_style_guide.md` に記録

## ツール実行例

```bash
# プロジェクトルートから実行
cd /Users/kamechi/HuX/hux/mitooshi

# カード一括変換
python shared/tools/generate_cards.py

# LP画像生成
python shared/tools/generate_images.py products/lp/index.html

# OGP生成
python shared/tools/generate_ogp.py
```

## 関連ドキュメント

- 詳細スタイルガイド: `../pdm/illustration_style_guide.md`
- イラスト作画 Skill: `../skills/mitooshi-illustration-style/SKILL.md`
- 採用ツール仕様: 上記Skill / illustration_style_guide.md 参照
