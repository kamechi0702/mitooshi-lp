#!/usr/bin/env python3
"""
Nano Banana 2 (Gemini 3 Pro Image) を使って、LP HTML 内の
data-img-prompt 属性を持つ <div class="img-slot"> を画像生成して
<img> に置換するスクリプト。

事前準備:
  pip install google-genai beautifulsoup4 --break-system-packages
  export GEMINI_API_KEY=xxxx   # https://aistudio.google.com/apikey で取得

使い方:
  python tools/generate_images.py marketing/lp_検証_apple.html
  # → doc/lp_assets/{html_basename}_{slot_index}.png に保存
  # → HTML 内の <div class="img-slot"> を <img src="..."> に置換
  # → 元HTMLは {file}.bak にバックアップ

オプション:
  --model gemini-3-pro-image-preview  (デフォルト)
  --dry-run                           生成せずプロンプトのみ表示
  --aspect 16:9                       アスペクト比指定（デフォルト 4:3）
"""
import os
import sys
import argparse
import shutil
import hashlib
from pathlib import Path

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("ERROR: google-genai が未インストールです。")
    print("  pip install google-genai beautifulsoup4 --break-system-packages")
    sys.exit(1)

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("ERROR: beautifulsoup4 が未インストールです。")
    print("  pip install beautifulsoup4 --break-system-packages")
    sys.exit(1)


REPO_ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = REPO_ROOT / "doc" / "lp_assets"

# .env を自動ロード（python-dotenv 不要の簡易パーサー）
_env_file = REPO_ROOT / ".env"
if _env_file.exists():
    for line in _env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def generate_image(client, prompt: str, model: str, out_path: Path, aspect: str):
    """Gemini API に画像生成を投げて PNG を保存。"""
    print(f"  → generating: {out_path.name}")
    print(f"    prompt: {prompt[:80]}...")

    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
            image_config=types.ImageConfig(aspect_ratio=aspect),
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            out_path.write_bytes(part.inline_data.data)
            print(f"    saved: {out_path}")
            return True
    print("    !! no image returned")
    return False


def process_html(html_path: Path, model: str, aspect: str, dry_run: bool):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key and not dry_run:
        print("ERROR: GEMINI_API_KEY が設定されていません。")
        print("  export GEMINI_API_KEY=xxxx  (https://aistudio.google.com/apikey)")
        sys.exit(1)

    client = None if dry_run else genai.Client(api_key=api_key)

    print(f"\n=== Processing: {html_path.name} ===")
    soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "html.parser")
    slots = soup.find_all("div", class_="img-slot", attrs={"data-img-prompt": True})
    print(f"  found {len(slots)} image slots")

    if not slots:
        return

    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    base = html_path.stem

    for i, slot in enumerate(slots, start=1):
        prompt = slot["data-img-prompt"]
        # プロンプトのハッシュをファイル名に入れて再生成判定可能に
        h = hashlib.md5(prompt.encode("utf-8")).hexdigest()[:8]
        filename = f"{base}_{i:02d}_{h}.png"
        out_path = ASSETS_DIR / filename

        if dry_run:
            print(f"  [{i}] (dry-run) {filename} ← {prompt[:60]}...")
            continue

        if out_path.exists():
            print(f"  [{i}] cached: {filename}")
        else:
            ok = generate_image(client, prompt, model, out_path, aspect)
            if not ok:
                continue

        # <div class="img-slot"> を <img> に置換
        rel = os.path.relpath(out_path, html_path.parent)
        new_tag = soup.new_tag(
            "img",
            attrs={
                "src": rel,
                "alt": prompt,
                "class": "img-slot-generated",
                "style": "width:100%; border-radius:inherit; display:block;",
            },
        )
        slot.replace_with(new_tag)

    if not dry_run:
        backup = html_path.with_suffix(html_path.suffix + ".bak")
        shutil.copy2(html_path, backup)
        html_path.write_text(str(soup), encoding="utf-8")
        print(f"  ✓ updated: {html_path.name} (backup: {backup.name})")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("html", nargs="+", help="対象HTMLファイル")
    p.add_argument("--model", default="gemini-3-pro-image-preview")
    p.add_argument("--aspect", default="4:3", help="16:9, 4:3, 1:1, 9:16 など")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    for h in args.html:
        process_html(Path(h).resolve(), args.model, args.aspect, args.dry_run)


if __name__ == "__main__":
    main()
