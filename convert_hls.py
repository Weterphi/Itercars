import os
import subprocess
import glob

ffmpeg_path = r'C:\Users\alber\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe'
os.makedirs('academy_hls', exist_ok=True)
vids = glob.glob('academy_videos/*.mp4')
for v in vids:
    base = os.path.splitext(os.path.basename(v))[0]
    out = os.path.join('academy_hls', base + '.m3u8')
    if os.path.exists(out):
        print(f'Already exists: {out}')
        continue
    print(f'Converting {v} to HLS...')
    subprocess.run([ffmpeg_path, '-i', v, '-c', 'copy', '-f', 'hls', '-hls_time', '10', '-hls_list_size', '0', out])
    print(f'Done {out}')
