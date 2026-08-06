import codecs
import re

brain_dir = "file:///C:/Users/alber/.gemini/antigravity-ide/brain/17a27086-1a90-4a6f-8f6b-11b73ae6fece/"

images = {
    "cover": f"{brain_dir}media__1785534933176.png",
    "sunset": f"{brain_dir}media__1785534976596.png",
    "grey": f"{brain_dir}media__1785534947074.png",
    "dash": f"{brain_dir}media__1785534960790.jpg",
    "seats": f"{brain_dir}media__1785534995437.png"
}

with codecs.open('articolo-zeekr-9x.html', 'r', 'utf-8') as f:
    html = f.read()

# Replace Cover
html = html.replace(f"{brain_dir}zeekr_exterior_front_1785534769204.png", images["cover"], 1)
# Replace Slide 2
html = html.replace(f"{brain_dir}zeekr_exterior_front_1785534769204.png", images["sunset"], 1)
# Replace Slide 3
html = html.replace(f"{brain_dir}zeekr_performance_1785534786245.png", images["grey"], 1)
# Replace Slide 4
html = html.replace(f"{brain_dir}zeekr_performance_1785534786245.png", images["cover"], 1)
# Replace Slide 5
html = html.replace(f"{brain_dir}zeekr_charging_1785534796442.png", images["sunset"], 1)
# Replace Slide 6
html = html.replace(f"{brain_dir}zeekr_interior_lounge_1785534777385.png", images["dash"], 1)
# Replace Slide 7
html = html.replace(f"{brain_dir}zeekr_interior_lounge_1785534777385.png", images["seats"], 1)

with codecs.open('articolo-zeekr-9x.html', 'w', 'utf-8') as f:
    f.write(html)


with codecs.open('magazine.html', 'r', 'utf-8') as f:
    mag = f.read()

mag = mag.replace(f"{brain_dir}zeekr_exterior_front_1785534769204.png", images["cover"])

with codecs.open('magazine.html', 'w', 'utf-8') as f:
    f.write(mag)

print("Images replaced successfully!")
