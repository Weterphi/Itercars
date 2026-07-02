import cv2
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
    
    if not os.path.exists(src_path):
        continue
        
    img = cv2.imread(src_path)
    if img is None:
        continue
        
    h, w = img.shape[:2]
    
    # We will simply take a clean patch of the floor from the left of the star
    # and paste it exactly over the star.
    # The star is in the bottom right corner, approximately within the last 100x100 pixels.
    # We copy a 100x100 patch from w-200 to w-100 and paste it at w-100 to w.
    
    patch = img[h-120:h, w-240:w-120]
    img[h-120:h, w-120:w] = patch
    
    cv2.imwrite(dst_path, img)
    print(f"Patched and saved {dst_name}")

print("Done! Real seamless removal applied.")
