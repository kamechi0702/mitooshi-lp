# mitooshi — アプリ本体

## このフォルダの役割

React Native + Expo で実装する mitooshi 本番アプリのソースコード置き場。現時点は placeholder（実装未着手）。

## 着手前に読むもの

1. **体験仕様の正本**：[`../../pdm/PRD_v2_MVP.md`](../../pdm/PRD_v2_MVP.md)（v2.6）
2. **デザイン参照（必須）**：[`../../shared/design-system/design-md-jp/mercari/DESIGN.md`](../../shared/design-system/design-md-jp/mercari/DESIGN.md)
3. **開発ガイド**：[`../../development/CLAUDE.md`](../../development/CLAUDE.md)
4. **イラスト作画 Skill**：[`../../skills/mitooshi-illustration-style/SKILL.md`](../../skills/mitooshi-illustration-style/SKILL.md)
5. **プロトタイプ（触感参考）**：[`../prototype/index.html`](../prototype/index.html)

## 技術スタック（計画）

- **フロントエンド**：React Native + Expo + TypeScript
- **アニメーション**：Reanimated 3 + Gesture Handler
- **バックエンド**：Supabase（Auth / PostgreSQL） ※v1 はローカル中心
- **ローカル永続化**：AsyncStorage（オフライン対応）
- **ビルド・配信**：Expo EAS
- **監視**：Sentry / PostHog

## アセット取り込み計画

- カードイラスト：`../../shared/illust/mitooshi/*.png` を `app/assets/cards/` にバンドル（初回起動時に永続化）
- ブランド：`../../shared/brand/logo.png` を app のロゴとして取り込み
- デザイントークン：`../../shared/design-system/DESIGN.md` の値を `theme/colors.ts` に転写

## v1 スコープ

PRD v2.6 §6 を参照。IN は下記：
- TOP（マイシーン一覧）
- オンボーディング（最小）
- カード作成画面（カテゴリから既製カード）
- カード確認画面（縦型積層・上スワイプ・タイマーなし）
- シーン完了画面
- フリーミアム課金枠
- オフライン動作

## 着手時の最初のタスク

1. `npx create-expo-app` でプロジェクト初期化
2. `shared/design-system/DESIGN.md` の値から `theme/` を生成
3. `shared/illust/mitooshi/` からカードアセットを取り込み
4. プロトタイプの体験をネイティブで再現する段階的な実装
