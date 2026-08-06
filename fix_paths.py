import codecs
import re

# Update magazine.html
with codecs.open('magazine.html', 'r', 'utf-8') as f:
    mag = f.read()

mag = mag.replace('href="articolo-zeekr-9x.html"', 'href="/magazine/articolo-zeekr-9x.html"')
mag = mag.replace('href="articolo-milano-noleggio.html"', 'href="/magazine/articolo-milano-noleggio.html"')
mag = mag.replace('src="zeeker 9x.jpg"', 'src="/zeeker%209x.jpg"')
mag = mag.replace('src="milano-lambo.jpg?v=new"', 'src="/milano-lambo.jpg?v=new"')

with codecs.open('magazine.html', 'w', 'utf-8') as f:
    f.write(mag)


# Function to update article files
def update_article(file_path, url, og_image_url):
    with codecs.open(file_path, 'r', 'utf-8') as f:
        html = f.read()
    
    # CSS and Favicon
    html = html.replace('href="index.css', 'href="/index.css')
    html = html.replace('href="magazine.css"', 'href="/magazine.css"')
    html = html.replace('href="favicon.svg"', 'href="/favicon.svg"')
    
    # Internal links
    html = html.replace('href="magazine.html"', 'href="/magazine.html"')
    html = html.replace('href="accademy.html"', 'href="/accademy.html"')
    
    # Images
    html = html.replace('src="zeeker 9x.jpg"', 'src="/zeeker%209x.jpg"')
    html = html.replace('src="milano-lambo.jpg?v=new"', 'src="/milano-lambo.jpg?v=new"')
    html = html.replace('src="milano-lambo.jpg"', 'src="/milano-lambo.jpg"')
    html = html.replace('src="zeekr_ai_action.png"', 'src="/zeekr_ai_action.png"')
    
    # Open Graph tags
    html = re.sub(r'<meta property="og:url" content=".*">', f'<meta property="og:url" content="{url}">', html)
    html = re.sub(r'<meta property="og:image" content=".*">', f'<meta property="og:image" content="{og_image_url}">', html)
    
    with codecs.open(file_path, 'w', 'utf-8') as f:
        f.write(html)

update_article('magazine/articolo-zeekr-9x.html', 'https://www.itercars.com/magazine/articolo-zeekr-9x.html', 'https://www.itercars.com/zeeker%209x.jpg')
update_article('magazine/articolo-milano-noleggio.html', 'https://www.itercars.com/magazine/articolo-milano-noleggio.html', 'https://www.itercars.com/milano-lambo.jpg')
