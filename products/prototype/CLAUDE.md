# mitooshi — プロトタイプ

## このフォルダの役割

ブラウザで直接開いて触感検証できる HTML/JS インタラクティブモック。体験仕様（2タップ原則・縦型カード積層・上スワイプ・実行中編集なし等）の早期検証を目的とする。

## ファイル

```
products/prototype/
└── index.html          単一ファイル。ブラウザで開くだけで動作
```

## 起動方法

```bash
# ブラウザで直接開く
open products/prototype/index.html

# またはローカルサーバー経由
cd products/prototype && python3 -m http.server 8000
# → http://localhost:8000 で開く
```

## カードイラストの参照先

`index.html` 内の `ILLUST_BASE` 定数：

```js
const ILLUST_BASE = '../../shared/illust/mitooshi/';
```

`shared/illust/mitooshi/` に配置されている mitooshi トーン版の PNG を参照する。CARDS 辞書で各カードを具体的なファイル名にマッピング。

## 検証観点

- **2タップ原則**：TOPからシーン実行まで最大2タップで到達できるか
- **縦型積層レイアウト**：現在カードと次カードの重なり感が自然か
- **上スワイプ操作**：カードを進める操作が直感的か
- **タイマー不在の体験**：時間を見せなくても不安にならないか
- **シーン完了演出**：達成感がちゃんと伝わるか
- **保存→TOP反映**：新規シーン作成→TOPに出現する流れが分かるか

## 関連

- 体験仕様の正本: `../../pdm/PRD_v3_MVP.md`
- プリセット3シーン内訳: `../../pdm/preset_scenes.md`
- カードライブラリ対応表: `../../pdm/card_library_draft.md`
