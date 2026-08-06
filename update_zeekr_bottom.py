# -*- coding: utf-8 -*-
import codecs
import re

with codecs.open('articolo-zeekr-9x.html', 'r', 'utf-8') as f:
    content = f.read()

start_tag = '<article class="mag-reading-section">'
end_tag = '</article>'
start_idx = content.find(start_tag) + len(start_tag)
end_idx = content.find(end_tag, start_idx)

new_html = '''
    <div class="reading-container">
      <div class="mag-article-interactions" style="margin-bottom: 40px; padding: 20px; background: rgba(255,255,255,0.02); border-radius: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.05);">
        <div class="interaction-likes">
          <button class="btn-like" id="likeBtn" style="background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; gap: 8px; font-size: 1.1rem; padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: all 0.3s;">
            <i class="ri-heart-3-line" id="heartIcon"></i> <span id="likeCount">198</span>
          </button>
        </div>
        <div class="interaction-share">
          <button class="btn-share" id="shareBtn" style="background: var(--accent-primary); color: #fff; border: none; padding: 10px 20px; border-radius: 30px; display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer;">
            <i class="ri-share-forward-line"></i> Condividi l'Articolo
          </button>
        </div>
      </div>
      
      <p style="font-size: 1.15rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 25px;">
        Dimenticate le vecchie gerarchie, quelle che per decenni hanno dettato legge nei salotti buoni dell'automobilismo internazionale. Per generazioni, la formula del lusso su quattro ruote è stata una liturgia immutabile, declinata rigorosamente in tedesco o in inglese. Bastava sfoggiare tonnellate di pelle trapuntata a mano, piallature di radica e un possente motore V8 che bruciava ottani come se il domani non esistesse, per assicurarsi il rispetto in strada e i margini nei bilanci. Ma la strada non guarda in faccia al blasone, guarda ai risultati. E oggi, la geografia del potere automobilistico sta subendo un terremoto di magnitudo altissima.
      </p>

      <p style="font-size: 1.15rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 40px;">
        Il nuovo heavyweight del settore è appena atterrato sul suolo europeo e non ha la minima intenzione di chiedere il permesso per sedersi al tavolo dei grandi. Zeekr, l'asso pigliatutto di Geely, ha deciso di calare il carico da novanta lanciando la Zeekr 9X. Non stiamo parlando del solito SUV elettrico di transizione, nato per compiacere le normative sulle emissioni. Ci troviamo di fronte a un leviatano di oltre cinque metri di lunghezza e quasi tre tonnellate di stazza, un manifesto di superiorità tecnologica che punta dritto alla giugulare di corazzate storiche come la Range Rover, la BMW X7 o la Mercedes Classe G. È alta ingegneria travestita da abito sartoriale, con un'attitudine puramente da strada e la spavalderia di chi sa di avere le carte vincenti in mano.
      </p>
      
      <img src="zeekr_ai_action.png" alt="Zeekr AI Action" style="width: 100%; border-radius: 15px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">

      <p style="font-size: 1.15rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 25px;">
        Quando si parla di numeri, la 9X smonta pezzo per pezzo la vecchia narrativa secondo cui le dimensioni massicce debbano necessariamente sacrificare le prestazioni brute. Sotto quella scocca imponente si nasconde una centrale elettrica di pura violenza. La configurazione scelta per dominare l'Europa è un sistema Super Hybrid EREV, ovvero un veicolo elettrico ad autonomia estesa. In termini pratici, questo significa che sotto il cofano lavora un motore termico da 2.0 litri turbo che non ha il compito di far girare le ruote, ma agisce esclusivamente come un generatore instancabile per alimentare il pacco batterie. La vera spinta, la trazione vera e propria che morde l'asfalto, è affidata a due motori elettrici che erogano una potenza combinata di 897 cavalli.
      </p>

      <p style="font-size: 1.15rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 40px;">
        Stiamo parlando di una brutalità ingegneristica che si traduce in un pugno di ferro in guanto di velluto. Quest'auto sradica la sua stessa massa portandoti da zero a cento chilometri orari in appena 4,1 secondi. È uno scatto bruciante da semaforo che ridicolizza supercar ben più blasonate e leggere, ma tu lo stai eseguendo comodamente sprofondato in un salotto insonorizzato. E per chi vive nel terrore dell'ansia da ricarica, la 9X risponde con un'architettura elettrica a 900 Volt che cambia letteralmente il modo in cui percepiamo il tempo. Attaccandosi a una colonnina ultra-rapida, il pacco batterie passa dal dieci all'ottanta percento in soli nove minuti e mezzo. È il tempo di un caffè espresso, di una telefonata veloce per chiudere un deal, e sei di nuovo in pista, supportato da un'autonomia complessiva nel ciclo combinato che tocca i 737 chilometri. Puoi macinare distanze interregionali senza mai dover guardare con ansia l'indicatore sul cruscotto.
      </p>
      
      <img src="zeekr_ai_grille.png" alt="Zeekr AI Grille" style="width: 100%; border-radius: 15px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">

      <p style="font-size: 1.15rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 25px;">
        Aprire le portiere di questa vettura significa varcare la soglia di un mondo dove i vecchi standard del lusso sono stati piallati e ricostruiti da zero. Il centro stile svedese ha concepito un abitacolo che è la fusione perfetta tra una lounge VIP esclusiva e un hub operativo della Silicon Valley. La configurazione a sei posti, disposti su tre file, offre uno spazio vitale immenso. Guidare o essere guidati diventa un'esperienza visiva e sensoriale totale. La plancia è dominata da un doppio display OLED con risoluzione 3.5K, mentre i passeggeri posteriori godono di un monitor da 17 pollici che scende elegantemente dal tetto. Ma è chi siede al volante a godere del pezzo forte: un mastodontico Head-Up Display in realtà aumentata da 47 pollici che proietta ogni singola informazione vitale, dalle traiettorie del navigatore agli ostacoli, direttamente sul parabrezza, fondendo il mondo digitale con l'asfalto reale.
      </p>
      
      <p style="font-size: 1.15rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 40px;">
        I sedili, ribattezzati non a caso "Nuvola Flottante", sono veri e propri troni dotati di riscaldamento, ventilazione e funzioni di massaggio avanzate, permettendo a chi viaggia nella seconda fila di reclinare la seduta fino a trasformarla in un letto di prima classe. L'isolamento acustico è degno di uno studio di registrazione, un silenzio di tomba che viene squarciato, solo quando lo decidi tu, da un impianto audio Naim da quasi quattromila Watt e 32 altoparlanti, capace di far vibrare la cassa toracica. A orchestrare tutta questa tecnologia c'è un cervello elettronico spaventoso, alimentato da doppi chip Qualcomm Snapdragon 8295 per l'infotainment e processori Nvidia Drive Thor dedicati esclusivamente alla gestione fluida e sicura della guida autonoma. Zero ritardi, zero incertezze, solo pura performance di calcolo.
      </p>

      <img src="zeekr_ai_interior.png" alt="Zeekr AI Interior" style="width: 100%; border-radius: 15px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">

      <p style="font-size: 1.15rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 25px;">
        È proprio qui, analizzando l'impatto sul mercato, che la questione si fa tremendamente seria e cambia le dinamiche del business. Un mezzo con queste specifiche non è solo l'ennesimo status symbol per ricchi annoiati; è uno strumento capace di riscrivere le regole del brokering automobilistico di altissimo livello. Quando si opera nel mercato del noleggio di lusso e dell'intermediazione, lavorare in maniera intelligente significa massimizzare i profitti minimizzando i costi fissi. L'approccio asset-light è la chiave per sopravvivere e dominare.
      </p>
      
      <p style="font-size: 1.15rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 40px;">
        Immaginate il potenziale di avere una Zeekr 9X posizionata strategicamente nel proprio shadow inventory. Non serve immobilizzare capitali enormi per riempire un autosalone fisico; basta avere la disponibilità virtuale, la garanzia di poter procurare questo specifico modello in tempi record. Quando il cliente di fascia alta, il CEO o l'artista di turno si stanca delle solite ammiraglie tedesche e cerca il vero game-changer per fare il suo ingresso in scena, questa è l'arma definitiva da sfoderare. Offrire una 9X significa garantire ai propri clienti non solo un veicolo, ma un'esperienza che unisce l'hype del prodotto rivoluzionario, le prestazioni di un'hypercar e il comfort di un jet privato, con un rapporto qualità-prezzo che attualmente sta facendo venire i sudori freddi ai consigli di amministrazione di mezza Europa.
      </p>
      
      <img src="zeekr_ai_sunset.png" alt="Zeekr AI Sunset" style="width: 100%; border-radius: 15px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">

      <p style="font-size: 1.15rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 25px;">
        La strada ha sempre chiesto risultati tangibili, presenza scenica e innovazione spietata. La Zeekr 9X ha risposto presente all'appello, entrando in scena con la forza di un uragano e piazzando l'asticella a un'altezza vertiginosa. Le vecchie case automobilistiche sono avvisate: vivere di rendita sulla propria storia non basta più. Il futuro è già parcheggiato qui fuori, e ha un aspetto formidabile.
      </p>

    </div>
'''

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_html + content[end_idx:]
    with codecs.open('articolo-zeekr-9x.html', 'w', 'utf-8') as f:
        f.write(content)
    print("Article bottom section updated successfully!")
else:
    print("Could not find mag-reading-section!")

