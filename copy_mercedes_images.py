import os
import shutil
import glob

brain_dir = r"C:\Users\alber\.gemini\antigravity-ide\brain\7592981a-4513-4bca-9d63-c542ff398f0e"
dest_dir = r"C:\Users\alber\Desktop\LuxuryCar"

# Find generated images
patterns = [
    'mercedes_classe_a_*.png',
    'mercedes_cla_coupe_*.png',
    'mercedes_classe_c_sw_*.png',
    'mercedes_gla_*.png',
    'mercedes_glc_*.png',
    'mercedes_gle_coupe_*.png',
    'mercedes_classe_e_phev_*.png',
    'mercedes_eqe_electric_*.png',
    'mercedes_classe_s_presidenziale_*.png',
    'mercedes_g63_amg_*.png'
]

mapped_images = {}

for pattern in patterns:
    matches = glob.glob(os.path.join(brain_dir, pattern))
    if matches:
        # Get the latest one if there are multiple
        latest_match = max(matches, key=os.path.getmtime)
        base_name = pattern.replace('_*.png', '.png')
        dest_path = os.path.join(dest_dir, base_name)
        shutil.copy2(latest_match, dest_path)
        print(f"Copied {latest_match} to {dest_path}")
        mapped_images[base_name] = True
    else:
        print(f"No match for {pattern}")
