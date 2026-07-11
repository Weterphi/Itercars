with open('nbt-dettaglio.html', 'r', encoding='utf-8') as f:
    content = f.read()

km_html = '''            <!-- STEP 1.5: LIMITE KM GIORNALIERI -->
            <div class="config-section">
              <div class="config-section-title"><i class="ri-road-map-line"></i> 2. Limite Km Giornalieri</div>
              <div class="config-options-grid" id="configKmDailyGroup">
                <button type="button" class="config-option-btn" data-value="100" onclick="setConfigKmDaily(100, this)">100 Km/g</button>
                <button type="button" class="config-option-btn active" data-value="150" onclick="setConfigKmDaily(150, this)">150 Km/g</button>
                <button type="button" class="config-option-btn" data-value="200" onclick="setConfigKmDaily(200, this)">200 Km/g</button>
                <button type="button" class="config-option-btn" data-value="99999" onclick="setConfigKmDaily(99999, this)">Illimitati</button>
              </div>
            </div>

'''

content = content.replace('<!-- STEP 2: DEPOSITO CAUZIONALE -->', km_html + '            <!-- STEP 3: DEPOSITO CAUZIONALE -->')
content = content.replace('2. Deposito Cauzionale', '3. Deposito Cauzionale')
content = content.replace('<!-- STEP 3: KASKO -->', '<!-- STEP 4: KASKO -->')
content = content.replace('3. Franchigia Kasko', '4. Opzione Franchigia Assicurativa')

with open('nbt-dettaglio.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated nbt-dettaglio.html")
