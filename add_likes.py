import re

with open('magazine.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the HTML snippet to inject. We use a placeholder {id} for the data-article-id.
actions_html = '''
          <!-- Card Actions -->
          <div class="card-actions" data-article-id="art-{id}" style="position: absolute; bottom: 15px; right: 15px; display: flex; gap: 8px; z-index: 20;">
            <button class="btn-card-like" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; backdrop-filter: blur(5px); transition: all 0.2s;">
              <i class="ri-heart-3-line heart-icon"></i> <span class="like-count" style="font-family: 'Inter', sans-serif; font-weight:600;">{likes}</span>
            </button>
            <button class="btn-card-share" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 1rem; cursor: pointer; display: flex; align-items: center; padding: 5px 10px; border-radius: 20px; backdrop-filter: blur(5px); transition: all 0.2s;" title="Condividi">
              <i class="ri-share-forward-line"></i>
            </button>
          </div>
        </div>
      </a>'''

# Find all occurrences of "</div>\n      </a>" that belong to a bento card.
# We will do a regex replacement that increments an ID.

import random

counter = 1
def replacer(match):
    global counter
    likes = random.randint(15, 150)
    if counter == 1:
        likes = 124 # Match the first one to the article
    res = actions_html.format(id=counter, likes=likes)
    counter += 1
    return res

# The pattern looks for the end of the mag-card-content div and the closing a tag.
# Since spacing might vary, we'll match:
pattern = re.compile(r'(\s*</div>\s*</a>)')
content = pattern.sub(replacer, content)

# Now, we also need to append the JS script before the closing </body> tag.
js_script = '''
<script>
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.card-actions');
    
    cards.forEach(card => {
        const articleId = card.getAttribute('data-article-id');
        const likeBtn = card.querySelector('.btn-card-like');
        const shareBtn = card.querySelector('.btn-card-share');
        const heartIcon = card.querySelector('.heart-icon');
        const likeCountSpan = card.querySelector('.like-count');
        
        // Prevent clicking buttons from triggering the link navigation
        likeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            let currentLikes = parseInt(likeCountSpan.textContent);
            let hasLiked = localStorage.getItem('liked_' + articleId) === 'true';
            
            if (!hasLiked) {
                currentLikes++;
                localStorage.setItem('liked_' + articleId, 'true');
                heartIcon.classList.replace('ri-heart-3-line', 'ri-heart-3-fill');
                heartIcon.style.color = '#ef4444';
            } else {
                currentLikes--;
                localStorage.setItem('liked_' + articleId, 'false');
                heartIcon.classList.replace('ri-heart-3-fill', 'ri-heart-3-line');
                heartIcon.style.color = '#fff';
            }
            likeCountSpan.textContent = currentLikes;
            localStorage.setItem('likes_count_' + articleId, currentLikes);
        });

        shareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            let parentLink = card.closest('a').href;
            let title = card.closest('a').querySelector('.mag-card-title').textContent;
            
            if (navigator.share) {
                navigator.share({
                    title: title,
                    url: parentLink
                }).catch(err => console.log('Condivisione fallita:', err));
            } else {
                alert("Copia questo link per condividere l'articolo:\\n" + parentLink);
            }
        });
        
        // Initialize state
        let savedLikes = localStorage.getItem('likes_count_' + articleId);
        if (savedLikes) {
            likeCountSpan.textContent = savedLikes;
        } else {
            // Save the initial random likes
            localStorage.setItem('likes_count_' + articleId, likeCountSpan.textContent);
        }
        
        if (localStorage.getItem('liked_' + articleId) === 'true') {
            heartIcon.classList.replace('ri-heart-3-line', 'ri-heart-3-fill');
            heartIcon.style.color = '#ef4444';
        }
    });
});
</script>
'''

content = content.replace('</body>', js_script + '\\n</body>')

with open('magazine.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated magazine.html successfully")
