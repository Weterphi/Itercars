from PIL import Image

def remove_dark_bg(input_path, output_path, threshold=50):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # If the pixel is dark (R, G, B all below threshold), make it transparent
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

remove_dark_bg(
    "C:\\Users\\alber\\Downloads\\Gemini_Generated_Image_l8vr0hl8vr0hl8vr.png", 
    "C:\\Users\\alber\\Desktop\\LuxuryCar\\logo_fallback.png", 
    threshold=40
)
