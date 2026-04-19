#!/usr/bin/env python3
"""
mitooshi カードイラストを mitooshi デザイントーンに一括変換するスクリプト。

既存の `shared/illust/original/*.png`（いらすとや的トーン）を image-to-image で
nano banana 2（Gemini 3 Pro Image Preview）に通し、
LP準拠のフラットベクター＋ブランドカラー＋スパークル装飾のトーンに変換する。

事前準備:
  pip install google-genai pillow --break-system-packages
  export GEMINI_API_KEY=xxxx   # https://aistudio.google.com/apikey で取得
                                #（プロジェクトルートの .env に記載済み）

使い方:
  # samples/ に全て出力（元ファイルは保持）
  python tools/generate_cards.py

  # 特定のカードだけ生成
  python tools/generate_cards.py はみがき おきる おふろ

  # samples/ ではなく元を上書き（注意）
  python tools/generate_cards.py --overwrite

  # プロンプトだけ表示
  python tools/generate_cards.py --dry-run

オプション:
  --model gemini-3-pro-image-preview  (デフォルト)
  --aspect 1:1                        (デフォルト)
  --delay 2                           各生成の間隔（秒、レートリミット対策）
  --overwrite                         元PNGを直接上書き（非推奨）
  --dry-run                           生成せずプロンプトのみ表示
"""
import argparse
import os
import sys
import time
from pathlib import Path

try:
    from google import genai
    from google.genai import types
    from PIL import Image
except ImportError:
    print("ERROR: 依存パッケージが不足しています。")
    print("  pip install google-genai pillow --break-system-packages")
    sys.exit(1)


# shared/tools/ の 2階層上がリポジトリルート
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
ILLUST_DIR = REPO_ROOT / "shared" / "illust" / "original"   # いらすとや的旧版（入力）
SAMPLES_DIR = REPO_ROOT / "shared" / "illust" / "mitooshi"  # mitooshi トーン（出力）


# LP準拠・mitooshiトーンに変換する image-to-image プロンプト（日本語）
# 行動・ポーズを維持して、スタイルだけ引き寄せる
PROMPT = """このイラストの行動と構図を完全に維持したまま、
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
正方形1:1の構図。"""


def load_env():
    """プロジェクトルートの .env から GEMINI_API_KEY をロード。"""
    env_file = REPO_ROOT / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def transform(client, src_path: Path, dst_path: Path, model: str, aspect: str) -> bool:
    """1枚の image-to-image 変換を実行。成功したら True。"""
    try:
        src = Image.open(src_path)
    except Exception as e:
        print(f"  ✗ 読込失敗: {src_path.name}: {e}")
        return False

    try:
        resp = client.models.generate_content(
            model=model,
            contents=[PROMPT, src],
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(aspect_ratio=aspect),
            ),
        )
    except Exception as e:
        print(f"  ✗ API失敗: {src_path.name}: {e}")
        return False

    for part in resp.candidates[0].content.parts:
        if part.inline_data is not None:
            dst_path.parent.mkdir(parents=True, exist_ok=True)
            dst_path.write_bytes(part.inline_data.data)
            size = dst_path.stat().st_size
            print(f"  ✓ {src_path.name} → {dst_path.name} ({size:,} bytes)")
            return True

    print(f"  ✗ 画像データが返ってこなかった: {src_path.name}")
    return False


def collect_sources(names: list[str] | None) -> list[Path]:
    """対象ファイルを決定する。"""
    if names:
        # ユーザー指定
        out = []
        for n in names:
            # 拡張子がなければ .png を補完
            if "." not in n:
                n = n + ".png"
            p = ILLUST_DIR / n
            if not p.exists():
                # .jpg も試す
                alt = ILLUST_DIR / (n.rsplit(".", 1)[0] + ".jpg")
                if alt.exists():
                    p = alt
            if p.exists():
                out.append(p)
            else:
                print(f"  ⚠ 見つからない: {n}")
        return out

    # 全ファイル（samples/ は除外）
    return sorted(
        p for p in ILLUST_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in (".png", ".jpg", ".jpeg")
    )


def main():
    p = argparse.ArgumentParser()
    p.add_argument("names", nargs="*", help="変換したいカード名（例：はみがき おきる）。省略で全て")
    p.add_argument("--model", default="gemini-3-pro-image-preview")
    p.add_argument("--aspect", default="1:1")
    p.add_argument("--delay", type=float, default=2.0, help="各生成の間隔（秒）")
    p.add_argument("--overwrite", action="store_true", help="samples/ ではなく元PNGを上書き（注意）")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    load_env()
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key and not args.dry_run:
        print("ERROR: GEMINI_API_KEY が未設定です。")
        print("  .env に GEMINI_API_KEY=xxxx を記入するか、export してください。")
        print("  キー取得: https://aistudio.google.com/apikey")
        sys.exit(1)

    sources = collect_sources(args.names)
    if not sources:
        print("対象ファイルがありません。")
        return

    print(f"\n=== mitooshi カード一括変換 ===")
    print(f"対象: {len(sources)} 枚")
    print(f"モード: {'上書き' if args.overwrite else 'samples/'}")
    print(f"モデル: {args.model}")
    print(f"間隔: {args.delay} 秒")
    print()

    if args.dry_run:
        print("=== DRY RUN ===")
        for s in sources:
            print(f"  would transform: {s.name}")
        print(f"\nプロンプト:\n{PROMPT}")
        return

    client = genai.Client(api_key=api_key)

    success = 0
    failed = []
    for i, src in enumerate(sources, start=1):
        if args.overwrite:
            dst = src
        else:
            dst = SAMPLES_DIR / src.name

        print(f"[{i}/{len(sources)}] {src.name}")
        if transform(client, src, dst, args.model, args.aspect):
            success += 1
        else:
            failed.append(src.name)

        # レートリミット対策の待機（最後は不要）
        if i < len(sources) and args.delay > 0:
            time.sleep(args.delay)

    print()
    print(f"=== 完了 ===")
    print(f"成功: {success}/{len(sources)}")
    if failed:
        print(f"失敗: {len(failed)}")
        for f in failed:
            print(f"  - {f}")


if __name__ == "__main__":
    main()
