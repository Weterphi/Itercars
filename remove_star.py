import cv2
import numpy as np
import glob
import os

images = glob.glob('*.png')

for img_path in images:
    if img_path == 'logo_tricolore.png':
        continue
        
    print(f"Processing {img_path}...")
    img = cv2.imread(img_path)
    if img is None:
        continue
        
    h, w = img.shape[:2]
    
    # Define bottom right region (e.g. 250x250)
    region_size = 250
    roi = img[h-region_size:h, w-region_size:w]
    
    # Create mask for white/bright pixels (the star)
    # The star is usually white/light grey, sometimes semi-transparent
    # Convert to grayscale
    gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    
    # Threshold for bright pixels
    _, mask_roi = cv2.threshold(gray_roi, 180, 255, cv2.THRESH_BINARY)
    
    # Dilate mask slightly to cover edges of the star
    kernel = np.ones((5,5), np.uint8)
    mask_roi = cv2.dilate(mask_roi, kernel, iterations=2)
    
    # Inpaint the region
    inpainted_roi = cv2.inpaint(roi, mask_roi, 15, cv2.INPAINT_TELEA)
    
    # Place back
    img[h-region_size:h, w-region_size:w] = inpainted_roi
    
    # Save back
    cv2.imwrite(img_path, img)

print("Done!")
