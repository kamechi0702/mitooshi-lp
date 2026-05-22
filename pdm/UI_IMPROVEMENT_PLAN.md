# UI 改善 実装方針 v1

ユーザー指摘の改善点（4 スクリーンショット）を、対応する画面・コード位置・想定アプローチに整理。

| 影響範囲 | 対象画面 | 改善点数 |
|---|---|---|
| 共通スタイル | 全画面 | 4 |
| S1 TOP | リスト一覧 | 3 |
| S5 リスト編集 | 行 + フッター | 7 |
| S6 実行画面 | exec 行 | 4 |
| S4 写真確認 | バグ修正 | 1 |
| TabBar / FAB | 全画面共通 | 3 |

---

## 0. 共通デザイントークン（横断ルール化）

ユーザー指摘より、以下を「横断ルール」として `styles.css` 冒頭の `:root` か共通ユーティリティに昇格させ、各画面で再利用する。

### 0-1. 行 padding 共通化
- ルール: `padding: 0.5rem 1rem` (= 8px 16px)
- 対象: `.list-row` (S1), `.edit-row` (S5), `.exec-row` (S6)
- 現状: 各バラバラ (`14px 14px 14px 12px` 等)
- 実装: 共通ユーティリティ `.row-padding` を作るか、3 セレクタすべてに同値を反映

### 0-2. 行アイコン (CardThumb) サイズ共通化
- ルール: `height: 100%; width: auto;`
- 対象: `.row-thumb` (S1), S5 edit-row thumb, S6 exec-row thumb
- 現状: 固定 px (S1=40, S5=52, S6=56)
- 実装: CardThumb の `size` prop は維持しつつ `className="row-thumb"` の CSS で `height: 100%; width: auto;` を強制。各画面は **行の高さ** で間接的にサイズが決まる仕組みに変更
- メリット: 行の高さを変えればアイコンも追従、全画面で見た目が揃う

### 0-3. ★ボタンの右マージン
- ルール: `.list-row .star-btn { margin-right: 1rem; }`
- 現状: `.list-row` の `gap: 12px` で吸収
- 実装: gap を維持しつつ star-btn にだけ追加マージン、または gap を 1rem に変更して star-btn のみ追加マージンを足す

### 0-4. マイページ icon カラー
- ルール: 緑系（プライマリ系）に統一
- 現状: 非アクティブ時 `var(--text-sub)` (グレー)、アクティブ時のみ `var(--primary)`
- 実装: 非アクティブ時も `var(--primary)` または `var(--primary-soft)` 系の落ち着いた緑に。**TOP / マイページ 両方とも常時緑** にするのが揃って自然

---

## 1. S1 TOP（アプリトップ） — 3 件

### 1-1. リスト行から編集ボタン（鉛筆）を削除
- 対象: `screens.jsx` `ListRow` 内の `<button className="edit-btn">` ブロック
- 編集導線は **長押し** で残す（既存の startPress / endPress ロジック）
- 副作用: TOP 行から直接 S5 に飛ぶ短縮ルートが消える → ユーザーは「長押し」を覚える必要あり。代わりに次の文言ヒントを section-label の隣あたりに小さく追加検討（任意）

### 1-2. 行 padding を `0.5rem 1rem` に
- §0-1 共通化と一緒

### 1-3. ★の右側余白 1rem
- §0-3 共通化と一緒

---

## 2. S5 リスト編集 — 7 件

### 2-1. タスク行の背景を白固定
- 対象: `.edit-row { background: ... }`
- 現状: 一部 soft 系背景か。指摘では「白」明確指定
- 実装: `background: var(--bg)` (=#fff) 固定

### 2-2. ゴミ箱アイコンを大きく
- 対象: `screens.jsx:514` `<Icon name="trash" size={20} ...>`
- 実装: `size={24}` または `28` に拡大。CSS で `.edit-row-btn.delete` の余白も同調

### 2-3. カードサムネを大きく
- 対象: `screens.jsx:516` `<CardThumb card={c} size={52}/>`
- §0-2 共通化に従い、行の高さで決まるよう変更。**サムネは行高さの 100%** で表示
- 行高は `padding 0.5rem` + サムネ size ≒ 48〜56px が目安

### 2-4. タスクの順番を動かせるようにする（並び替え実装）
- 対象: `screens.jsx:518` `<button className="edit-row-btn" aria-label="並び替え">` — 現状はボタンだけで onDragStart/onDragEnd 未配線
- 実装方針:
  - HTML5 Drag and Drop API は iOS Safari でタッチ操作との相性が悪い
  - **Pointer Events ベースの並び替え** を実装（マウス/タッチ統一）
  - シンプル実装: ドラッグハンドル長押し → 該当行を絶対配置で持ち上げ、Y 座標で挿入位置を計算、release で `onReorder(fromIdx, toIdx)` 発火
  - 親（app.jsx）に `onReorderCards(sceneId, fromIdx, toIdx)` を追加し、scenes 配列を不変更新
- 代替案: 軽量ライブラリ (e.g. SortableJS) を CDN 追加。ただし babel standalone 環境との相性確認要

### 2-5. フッターのカード追加 (＋) を「タスクを追加する」テキスト付きボタンに
- 対象: `screens.jsx:527-529` `<button className="add-card-btn">` 内
- 実装: アイコン + テキスト「タスクを追加する」横並びに変更。`aria-label` も同文に揃える

### 2-6. 「タスクを追加する」ボタンを白背景＋線縁に
- 対象: `.add-card-btn` CSS
- 実装:
  - `background: var(--bg)` (=#fff)
  - `border: 1px solid var(--primary)` (緑 outline)
  - `color: var(--primary)` (テキスト・アイコン両方緑)
  - `border-radius` は「リストを保存する」ボタン (`.cta-button`) と **同値** に揃える（現状 `.cta-button` は 12px 想定、要確認）

### 2-7. 両ボタンの横幅 45% / 両サイド寄せ
- 対象: `.s5-footer` レイアウト
- 実装:
  - `.s5-footer { display: flex; justify-content: space-between; padding: 12px 16px; gap: 8px; }`
  - `.add-card-btn { flex: 0 0 45%; }`
  - `.cta-button { flex: 0 0 45%; }`（または .s5-footer 内では 100% から 45% にオーバーライド）
  - 残り 10% は中央の隙間

---

## 3. S6 実行画面 — 4 件

### 3-1. ○チェックアイコンを左 → 右端に
- 対象: `screens.jsx:592-610` `<button className="exec-row">` 内の DOM 順序
- 現状: `<exec-check>` → `<CardThumb>` → `<exec-label>` → `<exec-row-arrow>`
- 変更後: `<CardThumb>` → `<exec-label>` → `<exec-check>`
- CSS: `.exec-row { display: flex; align-items: center; gap: ... }`、`.exec-check` を `margin-left: auto;` で右寄せにする手も

### 3-2. 右端の > 矢印を削除
- 対象: `screens.jsx:605-609` `<div className="exec-row-arrow">` ブロックを削除
- CSS: `.exec-row-arrow` 関連スタイルも掃除

### 3-3. カードサムネを大きく
- 対象: `screens.jsx:603` `<CardThumb card={c} size={56}/>`
- §0-2 共通化に従い、行高 100% で表示。実行画面は子ども画面なので **64〜72px** を提案

### 3-4. ○の box-shadow（薄緑リング）を削除
- 対象: `.exec-check` CSS（line 804〜）
- 現状: `is-next` 時に薄緑のリングがアニメ表示されている (`exec-check-burst` 等)
- 実装: `box-shadow` / `outline` 系を削除。チェック状態は枠線色 + 塗りで表現

---

## 4. S4 写真確認のバグ修正 — 1 件

### 4-1. 写真カード作成後、確認画面が「テキスト入力欄なしで保存ボタンだけ」になる問題
- 再現手順:
  1. S3 → 画像をアップロード
  2. S4b で写真選択 + キャプション入力 + 保存
  3. → ScreenConfirm にルーティング (`setRoute({name:'confirm'})`)
  4. 写真プレビュー + 「テキストを変更したい場合は…」の文言だけ表示、**入力欄もラベル帯も非表示**
- 原因: `screens.jsx:462-468` で text input は `{isIllust && ...}` でガード、`isPhoto` 時は描画されない。文言だけ残って入力欄が消える矛盾UI
- 実装オプション:
  - **A. ScreenConfirm をスキップ（推奨）**: 写真カードは S4b 時点でキャプション入力済み → app.jsx の `saveCardDraft` 写真分岐で `setRoute({name:'edit'})` 直行。clock/text と同じパターン
  - B. ScreenConfirm を写真対応に: `{(isIllust || isPhoto) && (...)}` に変更してテキスト編集できるようにする + label-band も写真でも表示
- **推奨は A**: clock/text もすでにスキップ運用、写真も統一すると体験が揃う。S4b で既にキャプション入力済みなので二度入力にならない

---

## 5. TabBar / FAB — 3 件

### 5-1. FAB ラベル「新規作成」→「リストを作成」
- 対象: `screens.jsx:48` `<span className="tab-label">新規作成</span>`
- 実装: 単純差し替え

### 5-2. FAB が footer から飛び出さない（margin-top 解消）
- 対象: `.tab.center .fab` の `margin-top: -22px` (styles.css:252)
- 現状: FAB が tab-bar 上部から半分はみ出すフローティング設計
- 変更後: tab-bar 内に **完全に収まる** よう `margin-top: 0` か小さな値に。tab-bar 高さは 76px なのでサイズ調整必要かも
- 副作用: 既存のフローティング感は消えるが、UI の予測可能性は上がる。FAB サイズを 48〜52px に維持しつつ tab-bar 内に配置

### 5-3. マイページ アイコンを緑に
- §0-4 共通化と一緒

---

## 実装ステップ案（依存順）

1. **共通 CSS** (§0) を `styles.css` に集約 — 既存ルール上書きで影響範囲広いので最初に
2. **TabBar** (§5) — 共通レイアウト先に決定
3. **S1 TOP** (§1) — シンプル削除 + 共通スタイル適用
4. **S6 実行画面** (§3) — DOM 並び替え + サムネ拡大 + box-shadow 削除
5. **S5 リスト編集** (§2) 共通スタイル部分 (§2-1〜§2-3, §2-5〜§2-7)
6. **S5 並び替え機能** (§2-4) — pointer event ベースで実装（時間かかる）
7. **S4 写真確認バグ** (§4) — 1 行修正で済む

各ステップ完了後にローカル確認、最後にまとめて 1 コミットで本番反映。

---

## 工数感 / リスク

| ステップ | 工数 | リスク |
|---|---|---|
| §0 共通 CSS | 15 分 | 既存画面の意図せぬ崩れ |
| §1 TOP | 5 分 | 低 |
| §3 S6 | 15 分 | DOM 順序変更で fwap アニメ影響なし要確認 |
| §5 TabBar | 10 分 | FAB マージン変更で既存スクショの世界観変化 |
| §2 共通部分 (並び替え除く) | 20 分 | 低 |
| §2-4 並び替え | 60〜90 分 | iOS Safari Pointer Events の挙動差、スクロール抑制 |
| §4 写真バグ | 5 分 | 低（A 案ならルーティング 1 行） |

合計目安: **約 2.5〜3 時間**

---

## オープン課題（実装着手前に確認したいもの）

1. **§2-4 並び替え** をライブラリ無しで実装するか、`Sortable.js` を CDN 追加して時短するか
2. **§5-2 FAB inside footer** にした場合、FAB の視認性とタップしやすさが落ちないか（高さ 76px × FAB 52px だと窮屈になる可能性）。要モック確認
3. **§1-1 編集ボタン削除** の代替導線として、TOP に「長押しで編集」のヒント文言を出すか
4. **§4 写真バグ** の修正方針 A/B どちらが好み（推奨は A スキップ）
