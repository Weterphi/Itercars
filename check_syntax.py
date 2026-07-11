import subprocess
import sys

for fname in ['nbt-dettaglio.js', 'nlt-dettaglio.js']:
    try:
        res = subprocess.run(['node', '--check', fname], capture_output=True, text=True)
        print(f"Node syntax check for {fname}: exit={res.returncode}")
        if res.returncode != 0:
            print(res.stderr)
    except Exception as e:
        print(f"Node execution error: {e}")
