import os, pathlib
from google import genai
from google.genai import types
from PIL import Image

# shared/tools/ の 2階層上がリポジトリルート
REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
env = REPO_ROOT / ".env"
for line in env.read_text().splitlines():
    if "=" in line and not line.strip().startswith("#"):
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
out = REPO_ROOT / "products" / "lp" / "variants" / "assets"
ref = Image.open(out / "ogp_02_parent_child.png")

BASE = """OGP画像(16:9)。既存リファレンス画像のフラットイラストタッチ・キャラクター造形・
茶髪親子・ミントグリーン#00B894基調を完全維持。親子が一緒にタブレット/スマホアプリを
覗き込んで見ているシーン。画面内には「いま・つぎ・ゴール」の3枚カードUIがうっすら見える。
右側に大きく手書き風"mitooshi"ロゴと、キャッチコピー「見通しが、こどもを安心させる。」を
読みやすい日本語タイポで配置。白〜淡いミントグリーンの背景。温かく親しみやすいトーン。"""

prompts = {
    "ogp_v2_01_closeup": BASE + "\n構図: 親子の横顔アップ、二人ともタブレット画面を優しい表情で見つめている。左側:親子/右側:ロゴとコピー。",
    "ogp_v2_02_cozy_sofa": BASE + "\n構図: ソファに座った母親の膝の上で子供がタブレットを持っている、二人で画面を指差している。背景に観葉植物と柔らかい光。",
    "ogp_v2_03_table_topdown": BASE + "\n構図: テーブルを挟んで親子が向かい合い、その間にスマホが置かれ、二人で画面を覗き込む俯瞰気味の構図。朝食のパンやコップが脇に。",
    "ogp_v2_04_smile_share": BASE + "\n構図: 親子が満面の笑顔でタブレットを一緒に持ち、子供が画面のゴールカードを嬉しそうに指差している。紙吹雪や星のキラキラ装飾。",
}

for name, prompt in prompts.items():
    dest = out / f"{name}.png"
    if dest.exists():
        print(f"skip {name}"); continue
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
                print(f"  -> {dest}"); break
    except Exception as e:
        print(f"  ERROR: {e}")
