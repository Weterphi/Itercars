import re

with open('ingest_listini.py', 'r', encoding='utf-8') as f:
    content = f.read()

old_func = '''def calculate_client_price(net_price: float, markup_type: str, markup_val: float) -> tuple[float, float]:
    """
    Calcola il ricarico del broker e il canone finale per il cliente.
    Ritorna: (broker_markup_monthly, client_monthly_price)
    """
    if markup_type == "percentage":
        markup = round(net_price * (markup_val / 100.0), 2)
    else:
        markup = round(markup_val, 2)
    
    client_price = round(net_price + markup, 2)
    return markup, client_price'''

new_func = '''def calculate_client_price(net_price: float, markup_type: str, markup_val: float) -> tuple[float, float]:
    """
    Calcola il ricarico del broker (a scaglioni) e il canone finale per il cliente.
    Ritorna: (broker_markup_monthly, client_monthly_price)
    """
    if net_price <= 350:
        markup = round(net_price * 0.15, 2)
    elif net_price <= 800:
        markup = round(net_price * 0.12, 2)
    else:
        markup = round(net_price * 0.10, 2)
    
    client_price = round(net_price + markup, 2)
    return markup, client_price'''

content = content.replace(old_func, new_func)

with open('ingest_listini.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated ingest_listini.py')
