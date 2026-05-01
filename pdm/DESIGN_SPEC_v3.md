# mitooshi — Design Spec v3.0（プロトタイプ反映版）

| 項目 | 内容 |
|---|---|
| ドキュメント種別 | デザイン定義書（Claude Design 引き継ぎ用） |
| 対象プロダクト | mitooshi v1 MVP — 見通しボードアプリ |
| バージョン | v3.0（プロトタイプ反映版） |
| 作成日 | 2026-05-02 |
| 関連ドキュメント | `PRD_v3_MVP.md`（体験仕様の正本）／`DESIGN_HANDOFF.md`（初期ブリーフ）／`illustration_style_guide.md` |
| 参照プロトタイプ | `products/prototype/index.html`（インタラクティブ）／`products/prototype/v3_mock.html`（静的UIモック） |
| 公開デモ | `https://mitooshi.jp/demo/`（noindex） |
| 役割 | プロトタイプで確定した UI トークン／コンポーネント／インタラクションを Claude Design に渡し、本運用デザインへ仕上げるための入力 |

---

## 0. このドキュメントの位置づけ

PRD v3.0 は「何を作るか（What）」、本ドキュメントは「どう見せ・どう触れるか（How）」を記述する。プロトタイプで挙動・トーン・レイアウトを確定した上で、Claude Design が以下の最終仕上げに着手できる粒度で記述する。

- ✅ アイコン／タイポ／余白を本運用品質に磨き込む
- ✅ アクセシビリティ準拠（タップ領域・コントラスト・VoiceOver）の網羅
- ✅ ダークモード方針の決定
- ✅ アプリアイコン／スプラッシュ／空状態イラストの追加
- ⛔ 体験仕様（フロー・カード種別・タブ構造）は変更しない（PRD v3.0 §3〜§7 を尊重）

---

## 1. プロダクトの骨格

### 1.1 Why（変えない）

軽度ASD/ADHD の子ども（3歳〜小学校低学年）は、言葉の指示だけでは「次に何をするか」が伝わりづらく、切り替えに失敗しやすい。**視覚的に順番が見えれば自走できる**。mitooshi は親が「今日やることリスト」を事前に組み、子どもが上から順にタップで消化していく見通しボード。

### 1.2 ペルソナ（変えない）

- **保護者**：30〜40代、共働き多数。声かけ疲弊、絵カード継続失敗の経験者
- **子ども**：3歳〜小学校低学年、軽度 ASD/ADHD、視覚情報に反応する

### 1.3 5つの設計原則（v3 で確定）

1. **2タップで取り出せる** — TOP からリスト実行まで最大2タップ
2. **子どもが主役** — 子ども自身がタップで消化
3. **見て分かる** — 絵／写真／時計でひと目で行動が伝わる
4. **親編集 × 子ども実行 を分離** — 編集 UI は子ども画面に出さない
5. **絵文字を使わない** — イラスト・写真・時計・SVG アイコンで表現

---

## 2. 情報アーキテクチャ

### 2.1 画面一覧（8 画面）

| ID | 画面 | 役割 | タブバー |
|---|---|---|---|
| **S1** | TOP（リスト一覧） | お気に入り上位＋通常リスト | あり |
| **S2** | リスト新規作成（タイトル入力） | リスト名 20字 + CTA | あり |
| **S3** | カード種別選択 | イラスト／画像／時計／文字 の4択 | あり |
| **S4a** | カード作成（イラスト） | カテゴリタブ + 3列グリッド | あり |
| **S4b** | カード作成（写真アップ） | 写真選択 + キャプション | あり |
| **S4c** | カード作成（時計） | 時/分ドロップダウン + アナログ針 + キャプション | あり |
| **S4d** | カード作成（文字） | テキストのみ16字 | あり |
| **S4confirm** | カード確認（イラスト・写真のみ通過） | プレビュー + ラベル微調整 | あり |
| **S5** | リスト編集 | カード並び・削除・追加・保存 | あり |
| **S6** | 実行 | リスト形式・タップで「ふわっ消え」 | **なし** |
| **S7** | 完了 | 紙吹雪 + 達成チェック + ホーム戻り | **なし** |
| **S8** | マイページ | 子ども名／効果音／プラン／規約／問い合わせ | あり |

### 2.2 ナビゲーション（Apple HIG 準拠）

下部固定 3 タブ：

```
┌──────────────────────────────┐
│   🏠 TOP    ➕ 新規作成    👤 マイページ   │
└──────────────────────────────┘
```

- 中央「新規作成」は **FAB 風**（直径 52px、ミント円形、白＋アイコン、影あり）
- アクティブ時はミント、非アクティブはサブテキスト色
- S6 / S7 では **完全非表示**（子ども画面の集中阻害を防ぐ）
- ヘッダー右上の歯車は撤去。設定はマイページに統合

### 2.3 体験フロー

| ID | フロー | 操作数 |
|---|---|---|
| **F1 リスト実行**（最頻出） | TOP → 行タップ → S6 → 上から順タップ消化 → S7 → ホーム | 2タップ |
| **F2 リスト新規作成** | + タブ → S2 タイトル → S5 空 → ＋ → S3 → S4x → (S4confirm) → S5 → 保存 → TOP | – |
| **F3 リスト編集** | TOP 行の **鉛筆ボタン** タップ（または長押し）→ S5 → 並び替え／削除／編集／＋追加 → 保存 → TOP | – |
| **F4 お気に入り** | TOP 行の ☆ をタップ → ★（黄）に切替＋お気に入りセクション最上位へ自動移動 | 1タップ |

---

## 3. カード4タイプの仕様

| 種別 | 構成 | TOP/実行/編集 表示 | 確認画面（S4confirm）通過 |
|---|---|---|---|
| **A. イラスト** | プリセット PNG + ひらがなラベル | サムネ + テキスト 横並び | **あり**（統合カード：絵＋ミント帯のラベル） |
| **B. 写真** | 親が撮影/アップ + キャプション16字 | サムネ + テキスト 横並び | **あり**（**画像のみ**、ラベル帯は撤去） |
| **C. 時計** | アナログ表示 + 時:分 + キャプション16字 | 「8:00」テキストサムネ + キャプション | **スキップ**（S4c 内で確認済み） |
| **D. 文字** | ひらがな等のテキストのみ16字 | テキスト主体（小さな文字アイコン） | **スキップ**（S4d 入力時点で確定） |

### 3.1 確認画面の意図差

- **イラスト**：絵と文字をセットで見て「子どもにこの行動として届くか」を親が判断
- **写真**：絵が固定でないので、画像の構図／明るさの確認のみで十分。ラベル帯は冗長
- **時計／文字**：作成画面と確認画面で表示が同一になり冗長 → スキップ

---

## 4. デザイントークン（プロトタイプ確定値）

### 4.1 カラー

| トークン | 値 | 用途 |
|---|---|---|
| `--primary` | `#00B894` | ブランドカラー（ロゴ／CTA／FAB／タブ active／編集ボタン active） |
| `--primary-hover` | `#009b7c` | プライマリのホバー／active 押下色 |
| `--primary-soft` | `#e6f7f3` | カテゴリアイコン背景／編集ボタン active 背景 |
| `--link` | `#0073cc` | テキストリンク（mercari ベース） |
| `--accent-pink` | `#FFB6B6` | 紙吹雪／イラスト強調 |
| `--star-yellow` | `#FFD166` | お気に入り★ 塗り |
| `--star-yellow-border` | `#E8B800` | お気に入り★ 線 |
| `--text` | `#333333` | 本文 |
| `--text-sub` | `#666666` | 補助テキスト |
| `--text-muted` | `#999999` | 控えめなプレースホルダ |
| `--bg` | `#ffffff` | 画面背景 |
| `--bg-soft` | `#f6f6f6` | カード／リスト行の薄背景 |
| `--border` | `#e5e5e5` | 区切り線 |
| `--border-strong` | `#d0d0d0` | チェック円の枠 |
| `--danger` | `#e74c3c` | 削除ボタン |
| `--confetti-1〜4` | `#00B894` `#FFB6B6` `#0073cc` `#FFE7A0` | 紙吹雪 |

### 4.2 タイポグラフィ

```
font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
base font-size: 15px / line-height 1.4 / color #333
```

| 用途 | サイズ | 太さ |
|---|---|---|
| Large Title（S1 / S8） | 34px / 30px | 900 |
| Header Title（サブ画面） | 16px | 700 |
| List Row 名前 | 14〜15px | 600〜700 |
| Section Label | 12px | 600 |
| Status Bar | 13px | 600〜700 |
| 補助テキスト | 11〜12px | 500〜600 |
| Hint Caption | 11px | 500 |
| 完了画面タイトル | 28px | 900 |
| 実行カードラベル | 17px | 700（児童向け可読性優先） |

### 4.3 角丸・余白・影

| トークン | 値 | 用途 |
|---|---|---|
| Radius — small | 4〜6px | 入力／チップ |
| Radius — medium | 8〜10px | リスト行／編集行 |
| Radius — large | 12〜16px | プレビューカード／モーダル上部 |
| Radius — pill | full | 円形ボタン（FAB／編集ボタン／star） |
| Spacing | 4 / 8 / 10 / 12 / 14 / 16 / 20 / 24 / 28 | 8px グリッド準拠 |
| Shadow CTA / FAB | `0 4px 12px rgba(0,184,148,0.35)` | FAB |
| Shadow Card | `0 6px 18px rgba(0,184,148,0.15)` | プレビューカード |
| Shadow Modal | `0 8px 24px rgba(0,0,0,0.18)` | 端末枠／モーダル |

### 4.4 タップ領域（Apple HIG）

すべてのインタラクティブ要素は **44×44pt 以上** を確保。

| 要素 | 実寸 |
|---|---|
| 戻るボタン | min 44×44 |
| TOP 行の編集ボタン | 36×36（行全体が大きいので合算で安全） |
| TOP 行の ☆ | 40×40 のヒット領域 |
| FAB 中央 | 52×52 |
| タブアイコン | 24×24 + パディング |

---

## 5. コンポーネントライブラリ

### 5.1 Status Bar
- 高さ 36px、padding 10/22/4/22
- 左：時刻 9:41（tabular-nums、700）
- 右：信号●●●● + Wi-Fi ● + バッテリーアイコン（24×11px、線 1.2px）
- 背景は画面 と同じ #fff、ボーダーなし

### 5.2 Large Title（S1 / S8）
- padding: 8/20/16
- ブランド `mitooshi` を `--primary` で 34px / 900 / letter-spacing -0.5px
- サブタイトル：13px / `--text-sub` / weight 500
- 下線：1px solid `--border`（境界明示）

### 5.3 Header（サブ画面）
- 高さ 48px min、padding 10/16
- 左：BackButton（chevron + 「もどる」、44×44+ ヒット領域、`--primary`）
- 中央：Title 16px / 700、ellipsis 省略
- 右：title-spacer（min-width 72px、左右バランス）

### 5.4 BackButton
```
[<]  もどる    （`--primary` チェブロン、ラベル 15px / 600）
```
- 透過背景、押下時 `rgba(0,184,148,0.08)` + scale(0.96)
- アイコンに pointer-events: none を設定し親 button でイベントを受ける（`<svg><use>` への誤判定回避）

### 5.5 Tab Bar
- 高さ 76px、border-top 1px、padding-bottom 8px
- 中央 FAB は **margin-top: -22px** で円が上に飛び出す造形
- アクティブ：色 `--primary`、weight 700
- 非アクティブ：`--text-sub`
- **中央 FAB アイコンは必ず白固定**（CSS: `.tab.center .fab .icon { stroke: #fff !important; }` で active 時の親色伝搬を遮断）

### 5.6 List Row（TOP）
- padding 14、border 1px、radius 10px、margin-bottom 8px
- 構成: `[★ お気に入り | リスト名 | ✏ 編集 | › chevron]`
- 件数表示は v3 で削除（行のシンプル化）
- 行タップ → 実行（S6）／長押し 600ms → 編集（S5）／鉛筆タップ → 編集（S5）
- 押下中は `--bg-soft` + scale(0.99)、長押し中は `--primary-soft` + scale(0.98)

### 5.7 Star Button
- 40×40 ヒット領域、内部 22×22 の i-star アイコン
- 非選択：`stroke: #bbb` / `fill: none`
- 選択：`fill: var(--star-yellow)` / `stroke: var(--star-yellow-border)`
- タップで `star-pulse` アニメ（scale 1 → 1.4 → 1、240ms）

### 5.8 Edit Button（鉛筆）
- 36×36 円形、border 1px / 非選択時白背景
- 押下：背景 `--primary-soft`、border `--primary`、icon stroke `--primary`、scale(0.92)
- 親 List Row の押下と干渉しないよう `isExcludedTarget()` で除外

### 5.9 Edit Row（S5）
- padding 14、min-height **68px**、background `--bg-soft`、radius 12px
- 構成: `[🗑 削除 40×40 | サムネ 52×52 | ラベル 15px/700 | ✏ 編集 36×36 | ☰ ハンドル 36×36]`
- ハンドルからドラッグで並び替え（簡易：translateY で位置検出 → splice）
- 削除時は `removing` クラス：opacity 0 + translateX(-40px)、280ms

### 5.10 Exec Row（S6）
- padding 14、background #fff、border 1px、radius 10px、margin-bottom 10px
- 構成: `[○ 28px チェック円 | サムネ 48×48 | ラベル 17px/700]`
- タップで `fwap` アニメ（350ms）：opacity 1→0、translateY 0→-28px、scale 1→0.92、margin/padding/border 0
- 触覚フィードバック：`navigator.vibrate([10, 30, 10])`

### 5.11 CTA Button
- height 50px 相当、padding 16、background `--primary`、color #fff、weight 700、radius 6px
- 無効時 background #ccc / cursor not-allowed
- 押下時：background `--primary-hover`、scale(0.98)
- chevron アイコン込み構成 `保存する ›`

### 5.12 Preview Card（S4confirm）
- width 220px、border 2px solid `--primary`、radius 12px、shadow `0 6px 18px rgba(0,184,148,0.15)`
- 画像エリア：aspect-ratio 1/1、object-fit cover
- ラベル帯：`--primary` 背景 + 白 14px / 900 / letter-spacing 1px
- **写真タイプは `.photo-only` でラベル帯を撤去**し、画像のみを角丸表示

### 5.13 Modal（削除確認・ラベル編集・破棄確認）
- バックドロップ：rgba(0,0,0,0.4)、フェード 200ms
- ダイアログ：下からスライドイン（translateY 100% → 0、220ms ease-out）
- 上端 radius 16/16/0/0、padding 20/20/28
- 構成: title 16px / 700 → body 13px / `--text-sub` → actions 横並びボタン2つ
- アクション：cancel = `--bg-soft`／confirm = `--danger`（破棄系）or `--primary`（保存系）

### 5.14 Toast
- 上端から 80px、白文字 13px / 600、background `rgba(0,0,0,0.85)`
- radius 20px（pill）、padding 10/18
- フェード 200ms + translateY、デフォルト 1800ms 表示

### 5.15 Confetti（S7 完了）
- 30 ピース、6〜12px × 10〜18px、4 色ランダム
- 落下：translateY 0 → 720px + rotate 0 → 720deg、2.0〜3.5s
- 完了アイコン：140×140 円、200ms ディレイ後 pop（scale 0.3 → 1.1 → 1）

---

## 6. アイコンライブラリ（SVGスプライト・絵文字不使用）

| ID | 用途 |
|---|---|
| `i-home` | TOP タブ |
| `i-plus` | 新規作成 FAB / S5 ＋ |
| `i-user` | マイページタブ／プロフィール |
| `i-palette` | イラストカテゴリ |
| `i-camera` | 写真アップ |
| `i-clock` | 時計カード |
| `i-pencil` | カード編集／リスト編集 |
| `i-trash` | 削除 |
| `i-chevron-right / left / down` | 遷移／ドロップダウン |
| `i-menu` | 並び替えハンドル |
| `i-check` | 完了マーク／実行済み |
| `i-text` | 文字カードのプレースホルダ |
| `i-star` | お気に入り |
| `i-sparkle` | 完了演出のヒント装飾 |
| `i-bell` | 効果音設定 |
| `i-diamond` | プラン |
| `i-doc` | プライバシー／利用規約 |
| `i-mail` | 問い合わせ |

ストローク基本 1.8、線端 round、塗りなし。スプライト方式（`<symbol>` + `<use>`）でサイズ統一。

---

## 7. マイクロインタラクション一覧

| 場面 | 効果 | タイミング |
|---|---|---|
| List Row 押下 | scale(0.99) + bg-soft | 120ms |
| List Row 長押し進行 | bg `--primary-soft` + scale(0.98) | 600ms 経過で発火 |
| Star タップ | pulse（scale 1→1.4→1） | 240ms |
| Edit Button タップ | scale(0.92) + bg `--primary-soft` | 120ms |
| FAB 押下 | scale(0.94) + shadow 縮小 | 120ms |
| Exec Row タップ（fwap） | opacity/translate/scale で消える | 350ms |
| Edit Row 削除 | translateX(-40) + opacity 0 | 280ms |
| Modal 出現 | sheet 下からスライド | 220ms |
| Toast 出現 | フェード + slide | 200ms / 表示 1.4〜1.8s |
| Complete Check ポップ | scale 0.3 → 1.1 → 1 | 500ms ease |
| Complete Title フェードアップ | translateY 12 → 0 | 600ms / 200ms ディレイ |
| Confetti 落下 | translateY 0→720 + rotate 720 | 2.0〜3.5s |

---

## 8. ステート／並び順ロジック

### 8.1 お気に入り並び替え

```js
const favScenes = state.scenes
  .filter(s => s.isFavorite)
  .sort((a, b) => (b.favoriteSetAt || b.createdAt) - (a.favoriteSetAt || a.createdAt));
```

★をタップすると `favoriteSetAt = Date.now()` が記録され、お気に入りセクション内で **最も新しく★にした順** に上位表示される。タップ → 即上位移動の体感を確実に。

### 8.2 通常リスト並び替え

```js
const norScenes = state.scenes
  .filter(s => !s.isFavorite)
  .sort((a, b) => (b.lastUsedAt || b.createdAt) - (a.lastUsedAt || a.createdAt));
```

最終実行時刻 > 作成時刻 の降順。よく使うリストが上に上がる挙動。

### 8.3 実行済みカード

`state.runDoneIds: Set<cardId>` でランタイム保持。S7 遷移時に `runSceneId / runDoneIds` をクリア。実行履歴の永続化は v3 スコープ外。

---

## 9. 画面ごとのスペックシート（要点）

### S1 TOP
- Large Title `mitooshi` + サブ「よく使うリストから選んでね」
- セクション1: 「よく使うリスト」+ お気に入りシーン群（空ならヒント）
- 区切り線
- セクション2: 「そのほかのリスト」+ 通常シーン群
- 各行：☆ + 名前 + ✏ + ›

### S2 リスト新規作成
- Header: ← もどる / リストを新規作成する
- 60px トップマージン → ラベル「リストのタイトル（20文字まで）」
- 入力フィールド（focus 時 border `--primary`）
- 文字カウンタ右寄せ「0 / 20」
- 下部固定 CTA「保存してタスクを作る ›」（disabled 時 #ccc）

### S3 カード種別選択
- Header: ← もどる / リスト名
- セクション「カードの種類をえらんでね」
- 4 つの cat-btn（icon-wrap + テキスト + chev）
  1. イラストからえらぶ
  2. スマホから画像をアップしてつくる
  3. 時計をえらぶ
  4. 文字を入力する

### S4a イラスト選択
- カテゴリチップ：幼児一日／家族一日／学校一日／おでかけ／おかいもの
- 3列グリッド、各セル aspect 1/1.15
- セルタップ → S4confirm

### S4b 写真アップ
- 写真スロット 180×180、破線枠
- 「写真・画像を選択」ボタン → File API
- キャプション入力 16字 + 文字カウンタ
- 両方揃って初めて CTA 有効
- 保存 → S4confirm（ラベル帯なし＝画像のみ確認）

### S4c 時計
- 「時間を選択してください」
- 時/分セレクト（時 0-23、分 0,5,10...55）
- アナログ時計 140×140（時針 / 分針が selectVal で連動）
- キャプション 16字
- 保存 → **S5 へ直接**（S4confirm スキップ）

### S4d 文字
- 「テキストを入力（16字まで）」
- ノート「※ 画像なしの文字だけカード」
- 保存 → **S5 へ直接**（S4confirm スキップ）

### S4confirm（イラスト・写真のみ）
- 説明文「テキストを変更したい場合は…」
- Preview Card（イラストはラベル帯あり／写真は画像のみ）
- 編集可能ラベル入力（labelArea があれば連動）
- 保存 → S5 にカード追加

### S5 リスト編集
- Header: ← もどる / リスト名
- カード行（min-height 68px）
- 空時：「まだカードがありません。下の＋でカードを追加…」
- フッター：FAB＋ + 保存 CTA「リストを保存する ›」
- 戻る：新規かつ空なら直接 S1、それ以外は破棄確認モーダル

### S6 実行
- Header: ← もどる / リスト名 / 進捗 「2 / 5」
- exec-row 縦並び、タップで fwap 消化
- フッター hint 「タップでふわっと消えるよ ✨」
- タブバー非表示

### S7 完了
- 中央：完了チェック 140×140（pop）
- タイトル「ぜんぶ できたね！」（fade up 200ms）
- サブ「`<scene_name>` を クリア！」
- ホームに もどるボタン（fade up 400ms）
- 紙吹雪 30 ピース
- タブバー非表示

### S8 マイページ
- Large Title「マイページ」
- セクション「プロフィール」: 子どもの名前「みとおし」 ›
- セクション「アプリ設定」: 効果音 toggle / プラン「無料プラン」 ›
- セクション「情報」: プライバシーポリシー ／ 利用規約 ／ お問い合わせ
- フッター: バージョン表記とリスト件数

---

## 10. アクセシビリティ要件

- タップ領域 44×44 以上（実装済み）
- 色だけに頼らない情報設計（★は塗り＋線、有効/無効は色＋テキスト）
- VoiceOver / TalkBack 対応：button タグ + aria-label（star/edit に付与済み）
- 最小フォント：実行画面ラベル 17px、子ども画面で 14px 未満を使わない
- コントラスト：`--primary` #00B894 vs #fff = 2.59:1 → **本運用では大文字限定 or 太字+背景強化が必要（要 Claude Design 検討）**

---

## 11. v2 → v3 / プロトタイプ反復ログ

| 反復 | 主な変更 | 動機 |
|---|---|---|
| **v2.6 → v3.0**（PRD 切替） | カード1種→4種／積層スワイプ→リスト型タップ／2カラム→リスト+お気に入り／歯車→下部タブ | 仕様の触感検証で「縦スワイプ操作の発見性」「カード1種の表現不足」「設定の置き場」が問題化 |
| **プロトタイプ第1版** | v3 全 8 画面実装、SVGスプライト導入 | 動く触感での検証 |
| **改修1**（Apple HIG化） | 戻るに「もどる」ラベル＋44×44／Status Bar をリアル化／Large Title 導入 | 戻る導線の発見性／アプリらしさ |
| **改修2**（5件） | LP ロゴ復旧／S6 戻るを長押しから即タップ化／お気に入り星タップ動作と上位移動／中央 FAB+アイコン白固定／S5 行高さ拡大 | 戻りが面倒、星が反応しない、＋が見えない、編集行が小さい |
| **改修3**（編集導線） | 行に鉛筆ボタン追加（長押しは残置）／時計カードの確認画面スキップ | 編集導線が発見できない／時計の確認が冗長 |
| **改修4**（件数削除） | TOP 行の「○件」表示を削除 | 不要情報を削ぎ落として視認性アップ |
| **改修5**（確認画面整理） | 写真確認は画像のみ／文字カードも確認スキップ | 冗長な確認をなくし、4種の手数差を縮小 |

**結論**：確認画面（S4confirm）を通るのは **イラスト** のみ。他3種は S4 内で完結。

---

## 12. 開発実装上の確定事項

- **資産パス**：`shared/illust/mitooshi/*.png`（32 枚）／`shared/brand/logo.png`／`shared/design-system/design-md-jp/mercari/DESIGN.md` をベース
- **AI 画像生成**：nano banana 2（gemini-3-pro-image-preview）via Google AI Studio。`.env` に `GEMINI_API_KEY`
- **デモ**：`products/lp/demo/`（ILLUST_BASE='assets/'、noindex meta + robots.txt Disallow）
- **GitHub Pages**：`products/lp/` を Actions で配信（`.github/workflows/deploy-lp.yml`）
- **App 実装予定**：React Native + Expo。`shared/illust/mitooshi/` を同梱

---

## 13. Claude Design へのオープン課題

| # | 課題 | 検討範囲 |
|---|---|---|
| OQ-1 | **アプリアイコン／スプラッシュ**の制定 | mitooshi ロゴと統一感のある角丸アイコン、スプラッシュは brand color + ロゴ |
| OQ-2 | **ダークモード**対応の方針 | iOS HIG 準拠で `--bg #1c1c1e`系へ。`--primary` のコントラスト調整 |
| OQ-3 | **空状態（Empty State）**のイラスト | S1 お気に入りなし時、S5 カードなし時にやさしい挿絵を |
| OQ-4 | **CTAコントラスト** | `#00B894 / #fff` は AA 大文字基準のみ満たす。本文サイズで使うときの ホバー/Disabled の見せ方再検討 |
| OQ-5 | **Onboarding（初回起動）** | 「★で上位に固定」「+ でリスト作成」「行をタップで実行」を3画面で説明する短いツアー |
| OQ-6 | **アクセシビリティ最終調整** | VoiceOver の読み上げ順、children-friendly 表現、Dynamic Type 対応 |
| OQ-7 | **タブバー HIG ＋ Material 両立** | iOS は中央 FAB 風で良いか、Android は BottomAppBar とのギャップをどう埋めるか |
| OQ-8 | **完了画面の音とハプティクス** | 効果音 ON 時の「ティロリン♪」音、Vibrate パターンの設計 |
| OQ-9 | **イラスト追加の優先順位** | プリセット 32 枚以外で、医療・買物・公共交通系の追加要否 |
| OQ-10 | **ペアレンタルロック**（v1.x） | 子ども実行中にマイページ・編集に戻れないようにするピンコード等の検討 |

---

## 14. 受け入れ基準（DoD）— v3 のままを継承

- [ ] TOP → リスト実行は2タップ以内
- [ ] 4種カード（イラスト／写真／時計／文字）すべてで作成→保存→実行ができる
- [ ] お気に入り切替で並び順が更新される（タップ即上位）
- [ ] 実行画面でタップ→ふわっと消える演出（350ms）
- [ ] 完了画面で紙吹雪・達成アイコン・ホーム戻りボタンが機能する
- [ ] 下部タブバーが S1/S2/S3/S4/S5/S8 で表示、S6/S7 で非表示
- [ ] iOS/Android クラッシュフリー率 99%以上

---

## 15. 関連参照

- 体験仕様（正本）: `pdm/PRD_v3_MVP.md`
- 初期デザイン引き継ぎ: `pdm/DESIGN_HANDOFF.md`
- イラストルール: `pdm/illustration_style_guide.md` ／ `skills/mitooshi-illustration-style/SKILL.md`
- カードライブラリ: `pdm/card_library_draft.md`
- プリセット3シーン: `pdm/preset_scenes.md`
- mercari ベース: `shared/design-system/design-md-jp/mercari/DESIGN.md`
- インタラクティブプロト: `products/prototype/index.html`
- 静的UIモック: `products/prototype/v3_mock.html`

---

## 16. 改訂履歴

| 日付 | 版 | 変更内容 |
|---|---|---|
| 2026-05-02 | v3.0 | プロトタイプ確定値（トークン・コンポーネント・反復ログ）を反映し、Claude Design への入力として整備 |
