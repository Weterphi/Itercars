import cv2
import numpy as np
import glob
import os

images = glob.glob('*.png')

for img_path in images:
    # Skip logos
    if 'logo' in img_path:
        continue
        
    print(f"Processing {img_path}...")
    img = cv2.imread(img_path)
    if img is None:
        continue
        
    h, w = img.shape[:2]
    
    # The Gemini watermark is always in the bottom right corner.
    # Let's create a mask for a 150x150 box in the bottom right.
    mask = np.zeros((h, w), dtype=np.uint8)
    
    # Define the exact box to inpaint (bottom right corner)
    # We leave a small margin or just go all the way to the edges
    # The watermark is typically within the last 120 pixels
    mask[h-130:h, w-130:w] = 255
    
    # Inpaint the region covered by the mask
    # We use radius 20 to ensure it blends well with the surrounding dark floor
    img = cv2.inpaint(img, mask, 20, cv2.INPAINT_TELEA)
    
    # Save back
    cv2.imwrite(img_path, img)

print("Done! All watermarks painted over.")
