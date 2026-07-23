import os
import glob
from PIL import Image

def compress_to_webp():
    png_files = glob.glob("*.png") + glob.glob("*.jpg")
    for file in png_files:
        if file in ["logo_tricolore.png", "logo.png"] or "favicon" in file:
            continue # skip small UI files
        
        try:
            img = Image.open(file)
            
            # If PNG has palette, convert to RGBA
            if img.mode == 'P':
                img = img.convert('RGBA')
            
            webp_file = os.path.splitext(file)[0] + ".webp"
            
            # Save as WEBP, quality 85 is excellent visually but cuts size by 80%
            img.save(webp_file, "webp", quality=85)
            
            # Print sizes
            old_size = os.path.getsize(file) / 1024
            new_size = os.path.getsize(webp_file) / 1024
            print(f"Converted {file} ({old_size:.1f} KB) -> {webp_file} ({new_size:.1f} KB)")
            
        except Exception as e:
            print(f"Error converting {file}: {e}")

if __name__ == "__main__":
    compress_to_webp()
