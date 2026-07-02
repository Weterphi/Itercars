import cv2
import numpy as np
import os

img_path = r'C:\Users\alber\Desktop\LuxuryCar\porsche-911-turbo.png'
original_src = r'C:\Users\alber\Downloads\luxury\Gemini_Generated_Image_v5e4ssv5e4ssv5e4.png'

# Load the original un-messed-up image
img = cv2.imread(original_src)

h, w = img.shape[:2]

# Define the bottom right corner where the star is
roi = img[h-150:h, w-150:w]

# Convert to grayscale to find the star
gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

# The star is very bright, so we threshold at a high value
_, mask = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)

# Dilate the mask to cover the anti-aliased edges and glow of the star
kernel = np.ones((5,5), np.uint8)
mask = cv2.dilate(mask, kernel, iterations=2)

# Inpaint using the precise mask
inpainted_roi = cv2.inpaint(roi, mask, 5, cv2.INPAINT_TELEA)

# Put it back
img[h-150:h, w-150:w] = inpainted_roi

# Save over the project image
cv2.imwrite(img_path, img)

print("Porsche fixed!")
