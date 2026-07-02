import cv2
import numpy as np
import os

src_dir = r'C:\Users\alber\Downloads\luxury'
dst_dir = r'C:\Users\alber\Desktop\LuxuryCar'

mapping = {
    'Gemini_Generated_Image_1ltt9k1ltt9k1ltt.png': 'audi-r8.png',
    'Gemini_Generated_Image_2c08hb2c08hb2c08.png': 'bentley-continental.png',
    'Gemini_Generated_Image_as95zkas95zkas95.png': 'lamborghini-aventador.png',
    'Gemini_Generated_Image_bddl88bddl88bddl.png': 'lamborghini-huracan.png',
    'Gemini_Generated_Image_fqc25yfqc25yfqc2.png': 'lamborghini-revuelto.png',
    'Gemini_Generated_Image_g91q6bg91q6bg91q.png': 'ferrari-sf90.png',
    'Gemini_Generated_Image_kouhrskouhrskouh.png': 'ferrari-portofino.png',
    'Gemini_Generated_Image_ol5swdol5swdol5s.png': 'maserati-grancabrio.png',
    'Gemini_Generated_Image_q3n05xq3n05xq3n0.png': 'maserati-mc20-new.png',
    'Gemini_Generated_Image_swvwdcswvwdcswvw.png': 'porsche-911-cab.png',
    'Gemini_Generated_Image_u8b3gsu8b3gsu8b3.png': 'ferrari-296-gts.png',
    'Gemini_Generated_Image_v5e4ssv5e4ssv5e4.png': 'porsche-911-turbo.png',
    'Gemini_Generated_Image_ykkz4zykkz4zykkz.png': 'ferrari-roma.png',
    'Gemini_Generated_Image_z2elvqz2elvqz2el.png': 'ferrari-f8.png'
}

for src_name, dst_name in mapping.items():
    src_path = os.path.join(src_dir, src_name)
    dst_path = os.path.join(dst_dir, dst_name)
    
    img = cv2.imread(src_path)
    if img is None:
        continue
        
    h, w = img.shape[:2]
    
    # Bottom right area
    roi = img[h-150:h, w-150:w]
    
    # Convert to grayscale
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    
    # The star is bright. Threshold carefully (180+ is usually safe for the star).
    # We use a relatively high threshold to catch only the star.
    _, mask = cv2.threshold(gray, 190, 255, cv2.THRESH_BINARY)
    
    # Dilate mask to cover the edges of the star
    kernel = np.ones((5,5), np.uint8)
    mask = cv2.dilate(mask, kernel, iterations=2)
    
    # Inpaint only the star pixels! This preserves the reflection lines!
    inpainted_roi = cv2.inpaint(roi, mask, 5, cv2.INPAINT_TELEA)
    
    img[h-150:h, w-150:w] = inpainted_roi
    
    cv2.imwrite(dst_path, img)
    print(f"Perfectly inpainted {dst_name}")
