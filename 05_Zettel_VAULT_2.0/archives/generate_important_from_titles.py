import os
import json

def generate_filtered_conversations():
    files = os.listdir()
    part_numbers = set()

    for f in files:
        if f.startswith("cleaned_part") and f.endswith(".json"):
            part = f.replace("cleaned_", "").replace(".json", "")
            txt_name = f"titres_{part}_OK.txt"
            if txt_name in files:
                part_numbers.add(part)

    for part in sorted(part_numbers):
        json_file = f"cleaned_{part}.json"
        txt_file = f"titres_{part}_OK.txt"
        output_file = f"important_cleaned_conv_{part}.json"

        with open(json_file, "r", encoding="utf-8") as f:
            conversations = json.load(f)
        with open(txt_file, "r", encoding="utf-8") as f:
            accepted_titles = set(line.strip() for line in f if line.strip())

        filtered = [c for c in conversations if c["title"] in accepted_titles]

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(filtered, f, indent=2, ensure_ascii=False)

        print(f"✅ {output_file} généré avec {len(filtered)} conversations sélectionnées.")