def fix_js_file(filepath, is_nbt=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        js = f.read()

    # 1. Fix img.onload in generateNativePDF to never hang forever
    old_img_promise = """    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });"""
    
    new_img_promise = """    await Promise.race([
      new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; }),
      new Promise((resolve) => setTimeout(resolve, 800))
    ]);"""

    if old_img_promise in js:
        js = js.replace(old_img_promise, new_img_promise)
        print(f"Fixed image loading hang in {filepath}")

    # 2. Refactor handleQuoteSubmit to show the quote immediately, eliminate alerts, and run DB/fetch in background
    # Let's find where handleQuoteSubmit starts and where officialQuoteContainer building starts
    start_idx = js.find('async function handleQuoteSubmit(event) {')
    if start_idx != -1:
        # Find where officialQuoteContainer building happens inside handleQuoteSubmit or right after
        # Let's check how handleQuoteSubmit is structured in the file
        pass

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(js)

fix_js_file('nbt-dettaglio.js', True)
fix_js_file('nlt-dettaglio.js', False)
