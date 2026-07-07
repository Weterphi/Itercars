import os
import asyncio
import edge_tts
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg
import subprocess

# Configurazione percorsi
IMG_PATH = r"C:\Users\alber\.gemini\antigravity-ide\brain\14c31015-a879-4c3d-966f-3b9f893cf299\media__1783026023939.jpg"
TEMP_AUDIO = r"C:\Users\alber\Desktop\LuxuryCar\temp_voice.mp3"
TEMP_VIDEO = r"C:\Users\alber\Desktop\LuxuryCar\temp_silent.mp4"
FINAL_OUTPUT = r"C:\Users\alber\Desktop\LuxuryCar\video_promo_ragazza.mp4"
DESKTOP_OUTPUT = r"C:\Users\alber\Desktop\video_promo_ragazza.mp4"

TEXT_VOICE = "Ti hanno sempre detto che per guadagnare con le auto di lusso devi per forza acquistarle e investirci milioni. Falso."
VOICE_MODEL = "it-IT-ElsaNeural" # Voce femminile italiana professionale, calda e soffice ma decisa

async def generate_voice():
    print(f"Generazione voce neurale: {VOICE_MODEL}...")
    communicate = edge_tts.Communicate(TEXT_VOICE, VOICE_MODEL, rate="+2%", pitch="-2Hz")
    await communicate.save(TEMP_AUDIO)
    print("Audio salvato con successo.")

asyncio.run(generate_voice())

# Misura durata audio tramite ffprobe o moviepy
from moviepy import AudioFileClip
audio_clip = AudioFileClip(TEMP_AUDIO)
duration = audio_clip.duration + 0.6 # Leggero margine finale
print(f"Durata audio rilevata: {duration:.2f} secondi")

# Parametri video verticale 9:16 HD
WIDTH, HEIGHT = 1080, 1920
FPS = 30
TOTAL_FRAMES = int(duration * FPS)

# Caricamento immagine originale e ridimensionamento ad alta qualità
orig_img = Image.open(IMG_PATH).convert("RGB")
img_w, img_h = orig_img.size

# Calcoliamo crop per mantenere il rapporto 9:16 a risoluzione molto alta
target_ratio = WIDTH / HEIGHT
curr_ratio = img_w / img_h

if curr_ratio > target_ratio:
    new_w = int(img_h * target_ratio)
    left = (img_w - new_w) // 2
    cropped = orig_img.crop((left, 0, left + new_w, img_h))
else:
    new_h = int(img_w / target_ratio)
    top = (img_h - new_h) // 2
    cropped = orig_img.crop((0, top, img_w, top + new_h))

base_img = cropped.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)

# Funzione per aggiungere sottotitoli e overlay grafici di lusso
def draw_overlay(frame_pil, text_lines, highlight_word="", show_badge=True):
    draw = ImageDraw.Draw(frame_pil)
    
    # Try to load Arial or Segoe UI font
    try:
        font = ImageFont.truetype("arialbd.ttf", 52)
        font_large = ImageFont.truetype("arialbd.ttf", 85)
        font_badge = ImageFont.truetype("arial.ttf", 36)
    except:
        font = ImageFont.load_default()
        font_large = font
        font_badge = font
        
    # Dark gradient al fondo per contrasto sottotitoli
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw_ov = ImageDraw.Draw(overlay)
    for y in range(int(HEIGHT * 0.65), HEIGHT):
        alpha = int(210 * ((y - HEIGHT * 0.65) / (HEIGHT * 0.35)))
        draw_ov.line([(0, y), (WIDTH, y)], fill=(10, 10, 15, alpha))
        
    if show_badge:
        # Top badge
        badge_text = "✨ ITERCARS VIP INSIGHTS"
        draw_ov.rounded_rectangle([WIDTH//2 - 240, 90, WIDTH//2 + 240, 160], radius=35, fill=(0, 0, 0, 160), outline=(212, 175, 55, 255), width=2)
        draw_ov.text((WIDTH//2, 125), badge_text, fill=(212, 175, 55, 255), font=font_badge, anchor="mm")
        
    frame_pil = Image.alpha_composite(frame_pil.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(frame_pil)
    
    if not text_lines:
        return frame_pil
        
    y_pos = HEIGHT - 280
    for line in text_lines:
        if line == "FALSO.":
            # Disegno impatto grande al centro-fondo
            box_w, box_h = 440, 130
            draw.rounded_rectangle([WIDTH//2 - box_w//2, y_pos - 40, WIDTH//2 + box_w//2, y_pos + box_h - 40], radius=20, fill=(220, 38, 38))
            draw.text((WIDTH//2, y_pos + 25), line, fill=(255, 255, 255), font=font_large, anchor="mm")
        else:
            # Sottotitoli con ombra
            draw.text((WIDTH//2 + 3, y_pos + 3), line, fill=(0, 0, 0), font=font, anchor="mm")
            draw.text((WIDTH//2, y_pos), line, fill=(255, 255, 255), font=font, anchor="mm")
            y_pos += 65
            
    return frame_pil

# Generazione frames con inquadratura dinamica e taglio netto
print("Generazione frame video ad alta precisione...")
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
video_writer = cv2.VideoWriter(TEMP_VIDEO, fourcc, FPS, (WIDTH, HEIGHT))

t_cut1 = int(2.1 * FPS) # Primi 2.1s: Inquadratura ravvicinata dinamica (zoom lento verso il viso)
t_cut2 = int(duration * FPS) - int(1.4 * FPS) # Fino alla parola "Falso."

for i in range(TOTAL_FRAMES):
    t = i / FPS
    
    if i < t_cut1:
        # INQUADRATURA DYNAMICA RAVVICINATA (Zoom sul viso della ragazza in alto a sinistra/centro)
        # Viso si trova circa nel terzo superiore
        scale = 1.25 + 0.08 * (i / t_cut1)
        w_curr = int(WIDTH / scale)
        h_curr = int(HEIGHT / scale)
        # Centro sul viso
        cx = int(WIDTH * 0.48)
        cy = int(HEIGHT * 0.35)
        x1 = max(0, min(WIDTH - w_curr, cx - w_curr // 2))
        y1 = max(0, min(HEIGHT - h_curr, cy - h_curr // 2))
        
        crop_f = base_img.crop((x1, y1, x1 + w_curr, y1 + h_curr)).resize((WIDTH, HEIGHT), Image.Resampling.BICUBIC)
        
        if t < 0.9:
            lines = ["Ti hanno sempre detto che..."]
        else:
            lines = ["...per guadagnare con le auto di lusso"]
        frame_out = draw_overlay(crop_f, lines)
        
    elif i < t_cut2:
        # TAGLIO NETTO SU DI LEI (Inquadratura media/intera che mostra l'eleganza dell'auto e della ragazza)
        # Leggero movimento dolly out / pan
        scale = 1.05 - 0.04 * ((i - t_cut1) / (t_cut2 - t_cut1))
        w_curr = int(WIDTH / scale)
        h_curr = int(HEIGHT / scale)
        cx = int(WIDTH * 0.50)
        cy = int(HEIGHT * 0.50)
        x1 = max(0, min(WIDTH - w_curr, cx - w_curr // 2))
        y1 = max(0, min(HEIGHT - h_curr, cy - h_curr // 2))
        
        crop_f = base_img.crop((x1, y1, x1 + w_curr, y1 + h_curr)).resize((WIDTH, HEIGHT), Image.Resampling.BICUBIC)
        
        if t < 3.2:
            lines = ["devi per forza acquistarle..."]
        else:
            lines = ["...e investirci milioni."]
        frame_out = draw_overlay(crop_f, lines)
        
    else:
        # IMPATTO FINALE: "FALSO." (Taglio incisivo a medio-primo piano con grafica drammatica)
        scale = 1.15
        w_curr = int(WIDTH / scale)
        h_curr = int(HEIGHT / scale)
        cx = int(WIDTH * 0.48)
        cy = int(HEIGHT * 0.42)
        x1 = max(0, min(WIDTH - w_curr, cx - w_curr // 2))
        y1 = max(0, min(HEIGHT - h_curr, cy - h_curr // 2))
        
        crop_f = base_img.crop((x1, y1, x1 + w_curr, y1 + h_curr)).resize((WIDTH, HEIGHT), Image.Resampling.BICUBIC)
        frame_out = draw_overlay(crop_f, ["FALSO."])
        
    frame_cv = cv2.cvtColor(np.array(frame_out), cv2.COLOR_RGB2BGR)
    video_writer.write(frame_cv)

video_writer.release()
audio_clip.close()
print("Video silenzioso completato.")

# Muxing finale video + audio con ffmpeg fornito da imageio_ffmpeg
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print(f"Unione Audio e Video tramite FFmpeg: {ffmpeg_exe}...")

cmd = [
    ffmpeg_exe, "-y",
    "-i", TEMP_VIDEO,
    "-i", TEMP_AUDIO,
    "-c:v", "libx264", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    "-shortest",
    FINAL_OUTPUT
]

subprocess.run(cmd, check=True)

import shutil
shutil.copy2(FINAL_OUTPUT, DESKTOP_OUTPUT)
print(f"🎉 Video finale completato e salvato in:\n1. {FINAL_OUTPUT}\n2. {DESKTOP_OUTPUT}")
