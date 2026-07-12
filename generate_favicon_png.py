import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_favicon():
    # Size for high-res master
    size = 512
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Draw luxury squircle / rounded square background (#0A0E17 to #05070B)
    margin = 16
    radius = 120
    draw.rounded_rectangle(
        [(margin, margin), (size - margin, size - margin)],
        radius=radius,
        fill=(10, 14, 23, 255),
        outline=(0, 230, 118, 120),
        width=6
    )

    # 2. Draw subtle green glow/radial accent in center
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([(120, 120), (392, 392)], fill=(0, 200, 83, 35))
    glow = glow.filter(ImageFilter.GaussianBlur(30))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # 3. Draw Monogram "IC" in high-end bold typography
    # We will draw custom geometric paths if font isn't exact, to guarantee 100% precision
    # Letter I (emerald green gradient approximation #00C853)
    draw.rounded_rectangle([(126, 140), (184, 372)], radius=12, fill=(0, 200, 83, 255))
    draw.rounded_rectangle([(136, 160), (174, 352)], radius=8, fill=(10, 14, 23, 70)) # inner slit accent

    # Letter C (vibrant emerald green #00E676 with dark shadow cut)
    # Outer arc
    draw.arc([(180, 136), (380, 376)], start=40, end=320, fill=(0, 230, 118, 255), width=46)
    # Add top/end rounded caps for C arc
    draw.ellipse([(334, 145), (380, 191)], fill=(0, 230, 118, 255))
    draw.ellipse([(334, 321), (380, 367)], fill=(0, 230, 118, 255))

    # 4. Tricolor accent at bottom center
    bar_y = 412
    draw.rounded_rectangle([(196, bar_y), (232, bar_y + 6)], radius=3, fill=(0, 146, 70, 255))
    draw.rounded_rectangle([(238, bar_y), (274, bar_y + 6)], radius=3, fill=(255, 255, 255, 230))
    draw.rounded_rectangle([(280, bar_y), (316, bar_y + 6)], radius=3, fill=(206, 43, 55, 255))

    # Save multiple sizes
    img.save("favicon-512x512.png", "PNG")
    
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save("favicon-192x192.png", "PNG")
    img_192.save("apple-touch-icon.png", "PNG")

    img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
    img_32.save("favicon-32x32.png", "PNG")

    img_16 = img.resize((16, 16), Image.Resampling.LANCZOS)
    img_16.save("favicon-16x16.png", "PNG")

    # Save ICO containing 16x16, 32x32, 48x48
    img_48 = img.resize((48, 48), Image.Resampling.LANCZOS)
    img.save("favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print("Favicons generated successfully!")

if __name__ == "__main__":
    create_favicon()
