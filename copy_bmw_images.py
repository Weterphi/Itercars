import os
import glob
import shutil

src_dir = r"C:\Users\alber\.gemini\antigravity-ide\brain\6463364b-d289-4060-899f-21f1407780fd"
dst_dir = r"c:\Users\alber\Desktop\LuxuryCar"

mapping = {
    "bmw_serie_1_msport": "bmw_serie_1_msport.webp",
    "bmw_x1_xline": "bmw_x1_xline.webp",
    "bmw_serie_3_touring": "bmw_serie_3_touring.webp",
    "bmw_x3_msport": "bmw_x3_msport.webp",
    "bmw_serie_5_eccelsa": "bmw_serie_5_eccelsa.webp",
    "bmw_x5_msport": "bmw_x5_msport.webp",
    "bmw_i4_grancoupe": "bmw_i4_grancoupe.webp",
}

try:
    from PIL import Image
    has_pil = True
except ImportError:
    has_pil = False

for key, target_name in mapping.items():
    pattern = os.path.join(src_dir, f"{key}_*.png")
    matches = glob.glob(pattern)
    if not matches:
        print(f"Warning: No match found for {key}")
        continue
    # take most recent
    latest_file = max(matches, key=os.path.getctime)
    target_path = os.path.join(dst_dir, target_name)
    target_png_path = os.path.join(dst_dir, target_name.replace(".webp", ".png"))
    
    if has_pil and target_name.endswith(".webp"):
        try:
            img = Image.open(latest_file)
            img.save(target_path, "WEBP", quality=92)
            img.save(target_png_path, "PNG")
            print(f"Converted & Saved: {latest_file} -> {target_path} and {target_png_path}")
        except Exception as e:
            shutil.copy(latest_file, target_path)
            shutil.copy(latest_file, target_png_path)
            print(f"Copied: {latest_file} -> {target_path}")
    else:
        shutil.copy(latest_file, target_path)
        shutil.copy(latest_file, target_png_path)
        print(f"Copied: {latest_file} -> {target_path}")
