import sys
from PIL import Image

def extract_white_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Calculate brightness (luma or just max RGB)
        # Using simple max is usually fine for grayscale-like images
        brightness = max(item[0], item[1], item[2])
        
        # We want the logo to be white, and the dark background to be transparent.
        # If brightness is low (dark), alpha is low (transparent).
        # If brightness is high (white), alpha is high (opaque).
        # But we also might want to kill anything that is pure black to 0 alpha
        # and keep the pure white as 255 alpha.
        # Let's use the brightness as the alpha channel, and set all RGB to 255 (white).
        
        # To avoid the dark gray background becoming a milky semi-transparent overlay,
        # we can apply a threshold: if brightness < 50, alpha = 0.
        # If brightness > 50, alpha scales up.
        if brightness < 30:
            alpha = 0
        else:
            # simple contrast stretch or just use brightness directly
            alpha = brightness
            
        new_data.append((255, 255, 255, alpha))
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    input_file = r"C:\Users\alber\.gemini\antigravity-ide\brain\41400f72-5b07-4f01-b353-96ad7c1fd1e8\media__1782922043620.png"
    output_file = r"c:\Users\alber\Desktop\LuxuryCar\logo.png"
    extract_white_logo(input_file, output_file)
    print("Logo extracted and saved to logo.png")
