import os

filepath = 'academy.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix syntax error
content = content.replace("l\\\\'Email", "l\\'Email")
content = content.replace("l\\'Email", "l\\'Email") # Just in case

# Add hash logic for login
target = '''  loggedUser = localStorage.getItem('itercars_academy_user');
  unlockedLesson = parseInt(localStorage.getItem('itercars_academy_unlocked')) || 1;'''

new_target = '''  if (window.location.hash === '#login' && !localStorage.getItem('itercars_academy_user')) {
    setTimeout(() => { openLoginModal(); }, 100);
  }
  
  loggedUser = localStorage.getItem('itercars_academy_user');
  unlockedLesson = parseInt(localStorage.getItem('itercars_academy_unlocked')) || 1;'''

content = content.replace(target, new_target)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed syntax and added #login logic.")
