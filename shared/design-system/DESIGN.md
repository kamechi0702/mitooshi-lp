# mitooshi DESIGN.md

> このファイルはGoogle Stitch方式に準拠したデザインシステム定義。
> AIエージェントがUI生成・レビュー時に参照し、一貫したビジュアルを出力するためのもの。
> 値を変更するときは既存UIとの整合性を確認すること。

---

## 1. Visual Theme & Atmosphere

温かく、ポップで、安心感のあるトーン。療育ツールの堅さを排し、子どもが「自分のアプリ」と感じられる親しみやすさ。大きな角丸、たっぷりのホワイトスペース、鮮やかだが目に優しいカラーで構成する。

- ムード: cheerful, approachable, trustworthy
- 密度: 子ども画面はゆったり（情報を絞る）、保護者画面はやや密（効率重視）
- 全体的な丸み: pill-shaped buttons, large rounded cards (border-radius 16-28px)
- 影の使い方: soft, low-contrast drop shadows（浮遊感はあるが圧迫しない）

---

## 2. Color Palette & Roles

### ブランドカラー
- Mitooshi Purple (#667EEA) – ブランドアイデンティティ、ヘッダー、ロゴ
- Mitooshi Violet (#764BA2) – グラデーションのセカンダリ端

### テンプレートテーマカラー
各テンプレートは固有のテーマカラーを持ち、実行画面のアクセントに使用する。

- Morning Orange (#FF9F43) – あさのしたく
- Shopping Cyan (#0ABDE3) – おかいもの
- Hospital Red (#EE5A24) – びょういん
- Bedtime Purple (#6C5CE7) – おやすみじゅんび
- Train Green (#10AC84) – でんしゃでおでかけ
- Restaurant Pink (#FD79A8) – レストラン

### システムカラー
- Background (#FAFBFC) – アプリ全体の背景
- Card White (#FFFFFF) – カード・モーダルのサーフェス
- Text Primary (#1A1A2E) – 見出し・本文
- Text Secondary (#888888) – 補助テキスト・ラベル
- Text Muted (#BBBBBB) – プレースホルダー・ヒント
- Border (#F0F0F5) – カード境界線・セパレータ

### セマンティックカラー
- Success (#00B894) – 完了・正常
- Warning (#FECA57) – 注意・タイマー残り少
- Danger (#FF6B6B) – タイムアップ・エラー

### カラー使用ルール
- テーマカラーは実行画面のアクセントとして使用。背景全面に敷かない
- テーマカラーの薄いバリアント（opacity 10-20%）を背景のグラデーションに使用可
- セマンティックカラーは色だけで意味を伝えない。必ずアイコンまたはテキストを併用
- ダークモードは現時点では非対応

---

## 3. Typography Rules

### フォント
- Primary: "Noto Sans JP", -apple-system, BlinkMacSystemFont, sans-serif
- ウェイト: 300 (light), 400 (regular), 500 (medium), 700 (bold), 900 (black)

### 子ども画面のタイプスケール
- Step Emoji: 72sp – ステップの主アイコン
- Step Label: 28sp, weight 900 – ステップ名
- Button Text: 18sp, weight 800 – アクションボタン
- Sub Text: 14sp, weight 600 – 補助テキスト（「つぎは」「← スワイプでもすすめるよ」）
- Progress: 12sp, weight 700 – ステップカウンター（1/5）

### 保護者画面のタイプスケール
- Section Title: 17-18sp, weight 800
- Card Label: 14sp, weight 600
- Time Badge: 12sp, weight 600
- Helper Text: 11sp, weight 600
- Caption: 11sp, weight 500, color: Text Secondary

### 文字間隔
- 見出し・ロゴ: letter-spacing 1-2px
- セクションラベル（英字）: letter-spacing 1px, uppercase
- 本文: デフォルト

---

## 4. Component Stylings

### ボタン
- Primary（スタート等）: テーマカラーのグラデーション背景、白テキスト、border-radius 16-20px、shadow: 0 4px 16px theme-color/0.27
- Secondary（戻る等）: #F5F5F5背景、テキスト色、border-radius 10-12px
- Dashed（追加系）: transparent背景、border: 2px dashed #DDD、color: #999
- Hover/Active: scale(1.02) のトランスフォーム。色の変化よりスケールで反応を伝える
- Disabled: opacity 0.4

### カード
- Default: 白背景、border-radius 12-16px、shadow: 0 2px 12px rgba(0,0,0,0.06)
- Child Execution Card: border-radius 28px、shadow: 0 8px 32px theme-color/0.12、border: 3px solid theme-color/0.2
- Template Card: border: 3px solid #F0F0F5、hover時にテーマカラーのボーダー

### ステップ番号バッジ
- 28x28px circle、テーマカラー背景、白テキスト、weight 700、font-size 13sp

### タイマー（円形）
- SVG circle、stroke-width 8px、テーマカラー
- 時間テキスト: center、weight 700、size = circle径の28%
- 減少アニメーション: 1秒ごとに滑らかに更新（transition: stroke-dashoffset 1s linear）

### プログレスドット
- Active: 幅24px、テーマカラー、border-radius 4px
- Completed: 幅8px、テーマカラー
- Pending: 幅8px、#E0E0E0
- transition: all 0.3s

---

## 5. Layout Principles

### スペーシング基本単位
- Base: 4px
- xs: 4px / sm: 8px / md: 12px / lg: 16px / xl: 20px / 2xl: 24px / 3xl: 32px

### 画面構成
- アプリフレーム: 幅375px（iPhone基準）、max-height 812px
- フレーム角丸: 24px
- コンテンツパディング: 水平20-24px

### グリッド
- テンプレート選択: 2カラムグリッド、gap 14px
- ステップリスト: 1カラム、gap 10px

### レスポンシブ
- 現時点ではモバイルファースト（375px基準）で設計
- タブレット対応は将来検討

---

## 6. Interaction & Motion

### アニメーション原則
- 楽しさと安心の両立。過剰に激しい動きは避ける
- 子ども画面は演出リッチに、保護者画面はスナッピーに

### 定義済みモーション

| 名前 | 用途 | 仕様 |
|------|------|------|
| stepBounce | ステップカードの待機中 | scale 1→1.08→1, 2s ease-in-out infinite |
| confettiFall | ステップ完了演出 | translateY(0→700px) + rotate(0→720deg), 1.5-2.5s ease-in, 40パーティクル |
| celebrateBounce | 全完了のトロフィー | scale 0→1.3→1, 0.6s ease-out |
| blink | タイムアップ警告 | opacity 1→0.3→1, 1s ease-in-out infinite |
| cardSwipe | ステップ進行 | translateX + rotate、スプリング系 |

### トランジション
- 画面遷移: 300ms以内
- ホバー/タップフィードバック: scale transform, 150ms
- プログレスドット変化: 300ms

### サウンド（オプション）
- ステップ完了: 軽い「ポン」音
- 全完了: ファンファーレ
- すべてON/OFF切り替え可能にすること
