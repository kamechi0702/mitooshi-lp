import os, sys, pathlib
from google import genai
from google.genai import types
from PIL import Image

# load .env（shared/tools/ の 2階層上がリポジトリルート）
REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
env = REPO_ROOT / ".env"
for line in env.read_text().splitlines():
    if "=" in line and not line.strip().startswith("#"):
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
out = REPO_ROOT / "products" / "lp" / "variants" / "assets"

# reference image for style continuity
ref = Image.open(out / "lp_image_01.png")

STYLE = """フラットベクターイラスト、白背景、ミントグリーン(#00B894)を主役にしたアクセント配色、
柔らかい茶髪の親子キャラクター、温かく親しみやすいトーン、ミニマルで余白たっぷり、
既存のLPイラストと同じタッチ・同じキャラクター造形を維持。"""

prompts = {
    "ogp_01_three_cards": f"""OGP画像(1200x630, 16:9)。
画面中央に「いま」「つぎ」「ゴール」の3枚のイラストカードが横並びに配置され、
それぞれに子供向けの優しいアイコン(歯ブラシ・服・笑顔の子供)が描かれている。
左下に小さく子供の後ろ姿、右上に"mitooshi"の手書き風ロゴと
キャッチコピー「見通しが、子どもを安心させる。」。{STYLE}""",

    "ogp_02_parent_child": f"""OGP画像(1200x630, 16:9)。
左側に微笑む母親と3-4歳の子供がタブレットを一緒に覗き込んでいるシーン、
右側に大きく"mitooshi"ロゴとキャッチ「文字が読めなくても、つぎがわかる。」。
背景は淡いミントグリーングラデーション。{STYLE}""",

    "ogp_03_morning_scene": f"""OGP画像(1200x630, 16:9)。
朝の身支度シーン。窓から朝日、テーブルの上に3枚のみとおしカードが並び、
子供が笑顔で次のカードを指差している。母親はコーヒー片手に穏やかに見守る。
右下に小さく"mitooshi.jp"。{STYLE}""",

    "ogp_04_brand_hero": f"""OGP画像(1200x630, 16:9)。
中央に大きく"mitooshi"のロゴ、その下に「見通しボードアプリ」のサブコピー。
周囲に3枚の浮遊するみとおしカード、子供のシルエット、星や雲の装飾。
ミントグリーンとホワイトを基調とした、プロダクトローンチ告知風の構図。{STYLE}""",
}

for name, prompt in prompts.items():
    dest = out / f"{name}.png"
    if dest.exists():
        print(f"skip {name}")
        continue
    print(f"generating {name}...")
    try:
        res = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=[prompt, ref],
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(aspect_ratio="16:9"),
            ),
        )
        for part in res.candidates[0].content.parts:
            if part.inline_data:
                dest.write_bytes(part.inline_data.data)
                print(f"  -> {dest}")
                break
    except Exception as e:
        print(f"  ERROR: {e}")

print("done")
