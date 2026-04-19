---
name: mitooshi-illustration-style
description: mitooshi（見通しボードアプリ）のカードイラスト・LP挿絵・OG画像を作る際に必ず読むこと。mitooshi.jp LP と完全に揃えたフラットベクター・線画なし・ミント#00B894＋ブルー#0073cc＋ソフトピンク#FFB6B6 のトーンで統一する作画ルール。AI画像生成（nano banana / Midjourney / DALL-E）のプロンプトテンプレート、SVG実装で守るべきスタイル定数、禁止事項を含む。trigger: "mitooshi", "見通しボード", "カードイラスト", "illustration_style_guide"
---

# mitooshi イラストスタイル Skill

mitooshi のイラストを作るときは、**mitooshi.jp の LP で確立済みのビジュアル言語を完全に継承**する。プロトタイプでも本番アセットでも、この Skill のルールから外れないこと。

## 絶対に守ること（禁止事項）

- **線画（黒の輪郭線）を描かない**。LP は `stroke` を使わずシェイプ（塗り）のみで構成されている。カードイラストも同じ
- **チビキャラ／アニメ顔は使わない**。過去にツインテール＋ラインアートで試作したが作画が崩壊したため採用しない
- **絵文字・顔文字は使わない**（アプリ内のすべての領域で）
- **写真・3DCG・写実レンダリングは使わない**
- **純黒（#000）は使わない**。濃いチャコール（#2B2B2B）で代用
- **ミントグリーン（#00B894）は画面内1〜2割以下**に留める（mercari DESIGN.md の原則をイラスト内でも援用）
- **怒り顔・泣き顔・恐怖表現**は描かない（mitooshi の世界観として不適）
- **ネガティブ感情表現**のキャラクターは描かない

## 必須カラートークン

| 用途 | 名前 | 値 |
|---|---|---|
| プライマリ（服・達成・アクセント） | mint | `#00B894` |
| リンク／ブルーアクセント | blue | `#0073cc` |
| ピンクアクセント | pink | `#FFB6B6` |
| 肌色 | skin | `#FAD5B5` |
| 髪 | hair | `#6B4423` |
| クリーム（背景バリエーション） | cream | `#FFF4E6` |
| 淡ミント（背景バリエーション） | mint2 | `#B3E5D8` |
| 淡黄（背景バリエーション） | yellow | `#FFE7A0` |
| 背景（メイン） | white | `#FFFFFF` |
| 背景（サブ） | bgSoft | `#F6F6F6` |
| 濃いチャコール（点目・強調） | dark | `#2B2B2B` |

## キャラクター仕様

- **抽象化された丸みのある人物**。リアルな顔立ちや髪型を描かない
- **等身**：2.5〜3頭身（幼児サイズ感）
- **頭**：ほぼ円形
- **髪**：茶色（`#6B4423`）、シンプルなシェイプで頭頂部を覆う。ツインテール／ロングヘア等の固有スタイルは作らない
- **顔**：
  - **点目のみ**（小さな円を2つ）
  - **口・鼻は描かない**、もしくは極限まで抽象化
  - **表情はにこやか or 集中**のみ
- **体**：服はミントグリーン（`#00B894`）を基本。脚・腕は肌色のシンプルなシェイプ
- **中性的**：性別・人種を限定しない

## 構図ルール

- **カード比率**：1:1 の正方形
- **構図**：アイソメトリック寄り（立体的な角度を少し付ける）
- **占有率**：キャラクター＋行動対象物で画面の50〜60%
- **行動対象物**（歯ブラシ、くつ、お皿など）は**大きくはっきり描かれる**こと。何の行動か一目で伝わる
- **背景**：白 or ごく薄いグレー（`#F6F6F6`）。カード識別のためにクリーム／淡ミント／淡黄の帯や形状を薄く敷いてもよい
- **装飾**：星形・チェック・小さな円形スパークルを余白に2〜4個、軽やかに散らす

## AI 画像生成ツール（固定：nano banana 2 via Google AI Studio）

**唯一の採用ルート**：nano banana 2（`gemini-3-pro-image-preview`）を Google AI Studio の API キー経由で叩く。LP 制作フェーズで既に稼働しており、プロジェクト内の `shared/tools/generate_images.py` / `generate_ogp.py` がこのルートを使用している。Midjourney・DALL-E・Firefly などへの切替は**原則禁止**（トーン混在でブランド強度が損なわれるため）。

### セットアップ（本番プロジェクトで構築済み）

- 依存：`pip install google-genai beautifulsoup4 pillow --break-system-packages`
- API キー：[https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) で取得
- 格納：プロジェクトルートの `.env` に `GEMINI_API_KEY=xxxxx`（既に設定済み）
- モデル名：`gemini-3-pro-image-preview`
- SDK：`from google import genai` / `from google.genai import types`

### 既存スクリプト

| スクリプト | 用途 |
|---|---|
| `shared/tools/generate_images.py` | LP HTML 内の `data-img-prompt` を検出して一括生成。差し替え後の HTML を保存 |
| `shared/tools/generate_ogp.py` / `generate_ogp_v2.py` | OGP画像を image-to-image で生成（参照画像からトーン継承） |
| `shared/tools/generate_cards.py` | **カード一括変換（採用版）**。既存PNGを image-to-image で mitooshi トーンに変換。`shared/illust/mitooshi/` に出力。`--overwrite` で元を上書き可 |

#### generate_cards.py の使い方

```bash
# samples/ に全カード変換（元ファイルは保持・レビュー用）
python tools/generate_cards.py

# 特定のカードだけ
python tools/generate_cards.py はみがき おきる おふろ

# プロンプトのみ確認
python tools/generate_cards.py --dry-run

# レビュー後に元を上書き
python tools/generate_cards.py --overwrite
```

### カード生成時の最小サンプル

```python
from google import genai
from google.genai import types
import os
from pathlib import Path

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def gen_card(label_ja: str, action_en: str, out_dir: Path):
    prompt = CARD_PROMPT_TEMPLATE.replace("{ACTION}", action_en)
    resp = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
            image_config=types.ImageConfig(aspect_ratio="1:1"),
        ),
    )
    for part in resp.candidates[0].content.parts:
        if part.inline_data:
            (out_dir / f"{label_ja}.png").write_bytes(part.inline_data.data)
            return True
    return False
```

### プロンプトテンプレート

**【推奨】image-to-image 用・日本語プロンプト**（既存PNGから変換する際に実績あり）

既存のカードイラスト（いらすとや的トーンの `shared/illust/original/*.png`）を mitooshi トーンに引き寄せる際、`shared/tools/generate_cards.py` で採用している本番プロンプトをそのまま使う。

```
このイラストの行動と構図を完全に維持したまま、
以下のデザインスタイルに作り変えてください：

- フラットベクターイラスト、線画なし、シェイプのみで構成
- キャラクターは抽象化された丸みのある造形。2.5〜3頭身の子ども
- 顔は小さな点目のみ（口・鼻・チーク・眉は描かない）
- 髪は茶色（#6B4423）のシンプルなシェイプ
- 服はミントグリーン（#00B894）のTシャツ
- カラーパレット：ミントグリーン #00B894、ブルー #0073cc、ソフトピンク #FFB6B6、肌色 #FAD5B5
- 背景は白、または淡いミント（#F6FAF9）のベタ塗り
- 星形・チェック・小さな円形のスパークル装飾を余白に2〜3個配置
- アイソメトリック寄りの構図
- 輪郭線（黒い線）は描かない
- 絵文字や文字は一切含めない

いらすとや的な柔らかい輪郭線ありの表現は避け、
mitooshi.jp LP の既存イラスト（白背景・フラット・シンプルシェイプ）のトーンに合わせる。
正方形1:1の構図。
```

**【参考】英語プロンプト（新規生成時・image-to-imageなしで使う場合）**

```
A flat vector illustration of a young child {ACTION}.
White background. Shapes only — NO line art, NO outlines, NO strokes.
Abstracted rounded human figure with short brown hair,
small dot eyes only (no nose, no mouth).
Gender-neutral, 2.5 head ratio.
Color accents: mint green (#00B894), blue (#0073cc), soft pink (#FFB6B6).
Isometric-leaning composition.
Small sparkle decorations (check marks, stars, circles) floating in margins.
Bright and friendly tone. No realistic shading. No photo realism.
Square 1:1 composition. No text, no emojis.
```

### 行動例
- `brushing teeth`（はをみがく）
- `eating from a bowl`（ごはんをたべる）
- `putting on shoes`（くつをはく）
- `sitting calmly on a chair`（いすにすわる）
- `sleeping in bed under a blanket`（ベッドにはいる）
- `in a bathtub with rubber duck`（おふろにはいる）
- `holding a backpack`（かばんをもつ）
- `waving goodbye at a door`（いえをでる）

## image-to-image によるトーン統一

構図・色がブレた生成物は、**基準トーン画像（既存の `shared/illust/original/*.png` または `doc/lp_assets/lp_image_01.png`）と同梱して image-to-image で補正**する。`shared/tools/generate_ogp.py` と同じワークフロー。

```python
# 参考：nano banana 2（Gemini 3 Pro Image）でのトーン補正
contents = [
  "構図・キャラクター・動作は完全維持。ミントグリーン #00B894 アクセント、"
  "淡いブルー背景 #EAF4F8、きらめき装飾を追加。",
  reference_tone_image,
  generated_card_image
]
```

## SVG 実装でのトークン利用例

プロトタイプや静的SVGで実装する場合：

```js
const C = {
  skin:   '#FAD5B5',
  hair:   '#6B4423',
  outfit: '#00B894',
  blue:   '#0073cc',
  pink:   '#FFB6B6',
  cream:  '#FFF4E6',
  mint2:  '#B3E5D8',
  yellow: '#FFE7A0',
  white:  '#ffffff',
  dark:   '#2b2b2b',
};

// キャラクターは fill のみ、stroke 属性は付けない
// 丸い頭 + 単純な髪シェイプ + 点目2つ + 体
```

## ワークフロー

1. **種画像 3〜5枚**を上記プロンプトで生成し、トーンを確定（PdM 承認）
2. `card_library_draft.md` の全カードを順次生成（プロンプトを Python 辞書化）
3. 構図・色のブレは `shared/tools/generate_ogp.py` と同じ image-to-image フローで補正
4. 生成物を `/Users/kamechi/HuX/hux/mitooshi/shared/illust/original/{label}.png` に格納（既存31枚のファイル命名規則と揃える）
5. ブランドカラー差し替えが必要になった場合も image-to-image で一括対応

### 既存の生成済みカード（31枚）

v1.1 ラベル（名詞＋動詞形式）への対応マップは `card_library_draft.md` を正とする。再生成が必要なカードと、既存ファイルをそのまま活用できるカードを整理したうえで、差分だけ生成する運用を推奨。

## 判断の目安（迷ったら）

- 「線を引きたい」→ **描かない**。シェイプ同士の境界で形を示す
- 「顔を詳しく描きたい」→ **点目のみで止める**
- 「カラフルにしたい」→ **ミントを増やすのではなく補助色（クリーム／淡黄／淡ミント）を増やす**
- 「キャラクターに個性を出したい」→ **衣装と小物で差をつける**。顔立ち・髪型では差をつけない
- 「アニメ調にしたい衝動」→ **却下**。LP のフラット抽象トーンから逸脱しない

## 参照

- 現行PRD: `/mitooshi/pdm/PRD_v2_MVP.md` §12
- 詳細版スタイルガイド: `/mitooshi/pdm/illustration_style_guide.md`
- プリセットシーン内訳: `/mitooshi/pdm/preset_scenes.md`
- カードライブラリ素案: `/mitooshi/pdm/card_library_draft.md`
- デザイン参照（必須）: `shared/design-system/design-md-jp/mercari/DESIGN.md`
- プロトタイプ参考実装: `/mitooshi/products/prototype/index.html`
