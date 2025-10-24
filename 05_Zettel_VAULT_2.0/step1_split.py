# step1_split.py

import os, json
from pathlib import Path

INPUT_FILE = "conversations.json"
OUTPUT_DIR = "cleaned_parts"
CONVERSATIONS_PER_FILE = 30

os.makedirs(OUTPUT_DIR, exist_ok=True)

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

for i in range(0, len(data), CONVERSATIONS_PER_FILE):
    part_index = (i // CONVERSATIONS_PER_FILE) + 1
    part_data = data[i:i + CONVERSATIONS_PER_FILE]
    out_path = Path(OUTPUT_DIR) / f"conversations_part{part_index}.json"
    with open(out_path, "w", encoding="utf-8") as f_out:
        json.dump(part_data, f_out, indent=2, ensure_ascii=False)
    print(f"✅ conversations_part{part_index}.json écrit.")
