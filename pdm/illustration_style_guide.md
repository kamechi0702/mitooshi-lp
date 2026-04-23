# mitooshi — AI画像生成スタイルガイド

| 項目 | 内容 |
|---|---|
| バージョン | v2.3（方向A：LP完全継承／既存カードを image-to-image で一括変換） |
| 作成日 | 2026-04-19 |
| 用途 | カードイラスト・LP挿絵・OG画像のスタイル統一指針 |
| 関連PRD | `/mitooshi/pdm/PRD_v3_MVP.md` §12 |
| 採用方向 | **方向A：mitooshi.jp LP 完全継承**（ミニマル・フラット・ベクター・線画なし） |
| 関連Skill | [`/mitooshi/skills/mitooshi-illustration-style/SKILL.md`](../skills/mitooshi-illustration-style/SKILL.md) |

## デザイン参照ルール（必須）

> AI画像生成・イラスト発注・LP/モック制作の前には、**必ず `shared/design-system/design-md-jp/mercari/DESIGN.md` を Read してから着手すること**。色・タイポ・余白・ボタン半径などのトーンを継承する。ブランドカラーはミントグリーン **#00B894** に統一。

## ブランドの世界観

mitooshiは「軽度ASD/ADHDの子どもと保護者にやさしく寄り添う、見通しを共有するアプリ」。イラストは「やわらかく、温かく、清潔感があり、子どもが安心して見られる」表現を目指す。

## ビジュアルリファレンス（mitooshi.jp LP 準拠）

mitooshi の LP（mitooshi.jp）で確立済みのデザイン言語を**プロダクト側でも完全に継承**する。これにより LP →プロダクトの体験が連続し、ブランド強度が最大化される。

### LP のイラスト指示文（実際に使用された alt 記述から抜粋）

```
フラットなベクターイラスト。白背景。
抽象化された丸みのある人物。
ミントグリーン(#00B894)と青(#0073cc)とソフトピンクを差し色。
線は使わずシンプルなシェイプのみ、明るく親しみやすいトーン。
アイソメトリック寄りの構図。
チェックマーク・星・吹き出しのアイコンが軽やかに浮遊。
```

これを**mitooshiカード世界観の基準トーン**とする。以下の特性を全カードイラストで踏襲する。

### 参照画像の特性
- **線画なし**：黒の輪郭線は使わない。シェイプ（塗り）のみで形を表現する
- **キャラクター**：抽象化された丸みのある2.5〜3頭身の子ども。茶色の髪・小さな点目のみ。鼻・口は描かない（or 極限まで抽象化）。中性的
- **肌色**：中間トーン1色（#FAD5B5 系のベージュ）
- **カラーパレット**：
  - ミントグリーン（#00B894）：服／達成／プライマリアクセント
  - ブルー（#0073cc）：上着／装飾／スパークル
  - ソフトピンク（#FFB6B6）：小物／差し色／スパークル
  - クリーム（#FFF4E6）／淡いミント（#B3E5D8）／淡い黄（#FFE7A0）：背景・サブ要素
- **背景**：基本は白。カード内では薄いグレー（#f6f6f6）でカード領域を示す程度
- **装飾要素**：チェック・星・小さな円形のスパークルを2〜4個、余白に軽やかに浮かせる
- **構図**：アイソメトリック寄り（少し角度を付けた立体感）。動作対象物（歯ブラシ、本、ドアなど）が画面内に大きく配置される
- **余白**：キャラクター＋動作要素で画面の50〜60%を占め、残りは静かな白背景＋スパークル

### トーン継承ルール
- カード内では**行動の主体（子ども）が必ず画面に登場**する
- 行動対象物（歯ブラシ、くつ、お皿など）が**大きくはっきり描かれ、何の行動か一目で伝わる**
- キャラクターの表情は**にこやか or 集中**。怒り・泣き・恐怖は描かない
- **線画は描かない**（LP のトーン継承の最重要点）
- 背景は **白 or ごく薄いグレー（#f6f6f6）**、装飾はスパークルのみ
- ミントグリーン（#00B894）は**画面内のアクセント1〜2割**に留める（mercari ルール準拠：「CTAとアクティブ状態にのみ使用する」原則をイラスト内でも援用）

## スタイル定義

### 描画スタイル
- **フラットベクターイラスト**（リアル写真・3DCG・手描き風は使わない）
- **線画なし**（黒の輪郭線を描かない／LP 準拠）
- ベタ塗りのみ。グラデーション・陰影は原則使わない
- アイソメトリック寄りの構図で立体感を出す

### カラーパレット（LP と完全一致）

| 用途 | 色 | 値 |
|---|---|---|
| プライマリ（服・達成・アクセント） | ミントグリーン | #00B894 |
| ブルーアクセント（上着・装飾・スパークル） | ブルー | #0073cc |
| ピンクアクセント（小物・差し色・スパークル） | ソフトピンク | #FFB6B6 |
| 肌色 | ベージュ | #FAD5B5 |
| 髪 | ブラウン | #6B4423 |
| 補助背景（カード背景バリエーション） | クリーム／淡ミント／淡黄 | #FFF4E6 / #B3E5D8 / #FFE7A0 |
| 画面背景 | 白 / 薄グレー | #FFFFFF / #F6F6F6 |

- **彩度は中程度**に抑える（蛍光色・原色は使わない）
- **純黒（#000）は使わない**。点目等には濃いチャコール（#2B2B2B）を使用
- ミントグリーン（#00B894）は画面内の**1〜2割以下**に留める（mercari ルール援用）

### キャラクター表現
- 中性的・性別を限定しない見た目（短髪寄り）
- 髪色は茶色（#6B4423 系）を基本とし、ブランドカラーへの違和感がないトーンに
- 肌色は中間トーン1色に統一（人種を限定しないニュートラル肌色）
- 表情はやわらかく、にこやか or 集中している様子。怒り・悲しみは描かない
- 子どもキャラクターは**等身2.5〜3頭身**（幼児サイズ感）

### 構図・カメラ
- **カードカバー比率は1:1（正方形）**を基本とし、カード上半分（≒60%）に収まる構図
- 背景はシンプル（1色ベタ or ごく薄いパターン）。情報量を抑える
- 行動の主体（人物・物・場面）が**画面中央に大きく**収まる
- 視点は子どもの目線高さを基準に、行動の意図が一目で分かる構図

### 背景
- カード内背景：1色ベタ、もしくは薄いパステルグラデーション
- LP・OG画像：背景に小さなアイコン散布や淡い形状を許容

### 禁止表現
- 絵文字・顔文字
- 写真・実写素材
- 3DCG・写実的レンダリング
- 暴力的・恐怖を煽る表現
- 性別・人種を強くマークする表現
- 怒りの顔・泣き顔（mitooshi世界観として描かない）

## 生成プロンプトのテンプレート

下記をベースに、各カードの行動内容を `{ACTION}` に差し替えて生成する。nano banana（Gemini 3 Pro Image）・Midjourney・DALL-Eいずれでも使える共通プロンプト構造。

```
A flat vector illustration of a young child {ACTION}.
White background. Shapes only — NO line art, NO outlines, NO strokes.
Abstracted rounded human figure with short brown hair,
small dot eyes only (no nose, no mouth, or minimal curve).
Gender-neutral, 2.5 head ratio.
Color accents: mint green (#00B894), blue (#0073cc), soft pink (#FFB6B6).
Isometric-leaning composition.
Small sparkle decorations (check marks, stars, circles) floating in margins.
Bright and friendly tone. No realistic shading. No photo realism.
Square 1:1 composition. No text, no emojis.
```

### 例：「はをみがく」カード
```
A flat vector illustration of a young child brushing teeth.
White background. Shapes only — NO line art.
Abstracted rounded figure with short brown hair, small dot eyes.
Wearing a mint green (#00B894) top.
Holding a pink toothbrush with mint-green bristles to the mouth.
Accents: soft pink (#FFB6B6), blue (#0073cc).
Small sparkle decorations in the corners.
Isometric-leaning, square 1:1 composition. No text, no emojis.
```

### 例：「いすにすわってまつ」カード
```
A flat vector illustration of a young child sitting calmly on a chair.
White background. Shapes only — NO line art.
Abstracted rounded figure with short brown hair, small dot eyes.
Hands resting on lap, facing forward.
Wearing a mint green (#00B894) top.
Simple pink or cream chair underneath.
Accents: soft pink (#FFB6B6), blue (#0073cc).
Small sparkle decorations in the corners.
Isometric-leaning, square 1:1 composition. No text, no emojis.
```

### 例：「くつをはく」カード
```
A flat vector illustration of a young child putting on shoes.
White background. Shapes only — NO line art.
Abstracted rounded figure with short brown hair, small dot eyes.
Sitting on the floor, one soft-pink shoe half on.
Wearing a mint green (#00B894) top.
Accents: soft pink (#FFB6B6), blue (#0073cc).
Small sparkle decorations in the corners.
Isometric-leaning, square 1:1 composition. No text, no emojis.
```

### image-to-image での一括トーン補正

色・構図が揺れた生成物は、基準トーン画像（LP時に生成した参照キービジュアル）と同梱して image-to-image で修正する。

```python
# 参考：nano banana（Gemini 3 Pro Image）での色・トーン補正
contents = [
  "構図・キャラクター・動作は完全維持。ミントグリーン #00B894 アクセント、淡いブルー背景 #EAF4F8、きらめき装飾を追加。",
  reference_tone_image,
  generated_card_image
]
```

## ワークフロー

1. **スタイルガイドの種画像を3〜5枚生成**してトーンを確定（社内承認）
2. カードライブラリ（`card_library_draft.md`）の全カードを順次生成
3. 構図・色のブレは **image-to-image** で「構図維持・色のみ変更」のリクエストで補正
4. 生成物を `/Users/kamechi/HuX/hux/mitooshi/shared/illust/original/{label}.png` に格納（既存31枚と同じ命名規則）
5. ブランドカラー差し替えが必要になった場合も、image-to-image で一括対応

## 採用ツール（固定：nano banana 2 via Google AI Studio）

LP 制作段階で採用したルートをそのまま継承する。切替は原則禁止。

| 項目 | 値 |
|---|---|
| モデル | `gemini-3-pro-image-preview`（nano banana 2） |
| 提供元 | Google AI Studio |
| API キー取得 | [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| SDK | `google-genai`（`pip install google-genai --break-system-packages`） |
| 環境変数 | `.env` の `GEMINI_API_KEY`（本番プロジェクトに既に設定済み） |
| 既存スクリプト | `shared/tools/generate_images.py`（LP一括）、`shared/tools/generate_ogp.py`（OGP image-to-image） |
| カード用スクリプト | **`shared/tools/generate_cards.py`（採用版）** 既存PNGを image-to-image で mitooshi トーンに一括変換。`shared/illust/mitooshi/` に出力 |

Midjourney / DALL-E / Firefly 等への切替は、**ブランドトーン分断を避けるため原則禁止**。やむを得ず使う場合は PdM 承認を経ること。

## ライセンス・権利

- 商用利用が許諾されたサービス・モデルのみ使用
- 学習データに著作権侵害が懸念される場合は使用しない
- 利用ツールごとに「商用利用可」の確認を `/mitooshi/legal/` に保管（要新設）

## アクセシビリティ

- 色だけで情報を伝えない構図（形状・配置でも意味が伝わる）
- 高コントラストの確認（背景色とキャラクターの判別可能性）
- 視覚過敏な子向けに、強い動き・点滅は避ける

## Open Questions

- 種画像3〜5枚の具体的な生成依頼は誰がいつ実施するか（PdM／デザイナー）
- 60〜80枚生成の所要時間・コスト試算
- カードイラストとLP挿絵で同一スタイルを使うか、LPはより装飾性を上げるか
- キャラクターに固定の「mitooshiキャラ」を設定するか、毎カード別人物にするか

## 参照

- **Skill（要件の圧縮版）**: [`/mitooshi/skills/mitooshi-illustration-style/SKILL.md`](../skills/mitooshi-illustration-style/SKILL.md)
- 現行PRD: `/mitooshi/pdm/PRD_v3_MVP.md`
- カードライブラリ素案: `/mitooshi/pdm/card_library_draft.md`
- プリセットシーン内訳: `/mitooshi/pdm/preset_scenes.md`
- デザイン参照（必須）: `shared/design-system/design-md-jp/mercari/DESIGN.md`

## 改訂履歴

| 日付 | バージョン | 変更内容 |
|---|---|---|
| 2026-04-19 | v1.0 | 初版作成 |
| 2026-04-19 | v2.0 | 方向A（LP完全継承）を採用。線画なし・ミント/ブルー/ソフトピンクに統一 |
| 2026-04-19 | v2.1 | チビキャラ・線画版の実験をリセット。カラーパレット表を LP と完全一致させ、関連Skillを新規追加 |
| 2026-04-19 | v2.2 | 生成ツールを **nano banana 2 via Google AI Studio** に固定（LP で稼働中の `shared/tools/generate_images.py` を継承）。Midjourney/DALL-E/Firefly は原則禁止と明記。格納先を `/Users/kamechi/HuX/hux/mitooshi/shared/illust/original/` に更新 |
| 2026-04-19 | v2.3 | 既存31枚をいらすとや的トーンから mitooshi LP トーンへ image-to-image で一括変換する `shared/tools/generate_cards.py` を採用。本番プロンプト（日本語）を SKILL.md に記載 |
