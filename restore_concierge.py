import re

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

bot_html = """  <!-- Floating Mobile Phone Button -->
  <button onclick="toggleConciergeBot()" class="mobile-floating-phone" title="Contatta Concierge Bot" aria-label="Contatta Concierge">
    <i class="ri-phone-line"></i>
  </button>

  <!-- ITERCARS Concierge Bot Window (Mock WhatsApp/Contact Assistant) -->
  <div class="concierge-bot-window glass-card" id="conciergeBotWindow">
    <div class="bot-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div class="bot-avatar"><i class="ri-vip-crown-fill"></i></div>
        <div>
          <h4 style="font-size: 1rem; color: #fff; margin: 0;">ITERCARS Concierge</h4>
          <span style="font-size: 0.75rem; color: #2ecc71; display: flex; align-items: center; gap: 4px;">
            <span class="status-dot"></span> Assistente Online
          </span>
        </div>
      </div>
      <button onclick="toggleConciergeBot()" class="btn-close-bot"><i class="ri-close-line"></i></button>
    </div>
    
    <div class="bot-body" id="botMessages">
      <div class="bot-msg">
        <p>Benvenuto in ITERCARS! Come preferisci metterti in contatto con il nostro team VIP?</p>
        
        <div class="bot-contact-cards">
          <a href="tel:+393755942143" class="bot-card-link">
            <i class="ri-phone-fill" style="color: var(--accent-primary); font-size: 1.3rem;"></i>
            <div>
              <strong>Chiama ITERCARS</strong>
              <span>+39 375 594 2143</span>
            </div>
          </a>
          
          <a href="mailto:info@itercars.com" class="bot-card-link">
            <i class="ri-mail-fill" style="color: var(--accent-red); font-size: 1.3rem;"></i>
            <div>
              <strong>Lascia un'email</strong>
              <span>info@itercars.com</span>
            </div>
          </a>
        </div>

        <p style="margin-top: 12px; font-size: 0.85rem; color: var(--text-muted);">Oppure scrivi il tuo messaggio qui sotto per essere reindirizzato direttamente su WhatsApp:</p>
      </div>
    </div>

    <form class="bot-footer" onsubmit="handleBotSendMessage(event)">
      <input type="text" id="botInputText" placeholder="Scrivi messaggio per WhatsApp..." required autocomplete="off">
      <button type="submit" class="btn btn-primary" style="padding: 10px 14px; border-radius: 12px;" title="Invia su WhatsApp"><i class="ri-send-plane-fill"></i></button>
    </form>
  </div>"""

old_button_pattern = re.compile(r'<!-- Floating Mobile Phone Button -->\s*<a href="tel:\+393755942143" class="mobile-floating-phone" title="Contatta Concierge">\s*<i class="ri-phone-line"></i>\s*</a>', re.DOTALL)

text = old_button_pattern.sub(bot_html, text)

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)
