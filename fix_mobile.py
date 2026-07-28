import re

with open('articolo-milano-noleggio.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add CSS to head
css = '''
    /* Mobile Responsive Overrides */
    @media (max-width: 768px) {
      .glass-responsive {
        left: 50% !important;
        right: auto !important;
        transform: translate(-50%, -50%) !important;
        width: 92% !important;
        max-width: 100% !important;
        padding: 20px !important;
        text-align: center !important;
        border-radius: 12px !important;
      }
      .glass-responsive.glass-top {
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        transform: none !important;
        border-radius: 0 !important;
        padding: 15px 5% !important;
      }
      .glass-responsive h2 {
        font-size: 1.6rem !important;
        margin-bottom: 15px !important;
      }
      .glass-responsive p {
        font-size: 0.95rem !important;
      }
      .article-title {
        font-size: 2.2rem !important;
      }
      .immersive-quote {
        font-size: 2rem !important;
        padding: 20px !important;
      }
    }
'''
content = content.replace('</style>', css + '</style>')

# Slide 3 (Top)
content = content.replace(
    '<div style="position: absolute; z-index: 10; top: 0; left: 0; width: 100%; background: rgba(0, 0, 0, 0.65);',
    '<div class="glass-responsive glass-top" style="position: absolute; z-index: 10; top: 0; left: 0; width: 100%; background: rgba(0, 0, 0, 0.65);'
)

# Slide 4 (Right)
content = content.replace(
    '<div style="position: absolute; right: 3%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65);',
    '<div class="glass-responsive" style="position: absolute; right: 3%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65);'
)

# Slide 6 (Center)
content = content.replace(
    '<div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 10; background: rgba(0, 0, 0, 0.65);',
    '<div class="glass-responsive" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 10; background: rgba(0, 0, 0, 0.65);'
)

# Slide 7 (Left)
content = content.replace(
    '<div style="position: absolute; left: 5%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65);',
    '<div class="glass-responsive" style="position: absolute; left: 5%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65);'
)

with open('articolo-milano-noleggio.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("articolo-milano-noleggio.html updated for mobile.")
