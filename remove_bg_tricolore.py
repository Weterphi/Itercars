from PIL import Image

def process_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Calculate brightness using max RGB
        brightness = max(item[0], item[1], item[2])
        
        # We increase the threshold to remove the shadow/glow completely
        if brightness < 80:
            alpha = 0
        else:
            alpha = min(255, brightness + 50)  # Boost alpha so the colors pop
            
        new_data.append((item[0], item[1], item[2], alpha))
            
    img.putdata(new_data)
    
    # Also crop the image to the bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")

if __name__ == "__main__":
    input_file = r"C:\Users\alber\.gemini\antigravity-ide\brain\a7d560a1-a91b-4e74-963d-289f5f3da728\media__1782944199624.jpg"
    output_file = r"c:\Users\alber\Desktop\LuxuryCar\logo_tricolore.png"
    process_logo(input_file, output_file)
    print("Logo processed and saved.")
