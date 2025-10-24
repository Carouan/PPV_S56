# step3_filter_by_titles.py

import os, json
from pathlib import Path

INPUT_DIR = "cleaned_parts"

for json_file in sorted(Path(INPUT_DIR).glob("conversations_clean_part*.json")):
    part_index = json_file.stem.replace("conversations_clean_part", "")
    titles_file = Path(INPUT_DIR) / f"titres_part{part_index}_OK.txt"

    if not titles_file.exists():
        print(f"⏭️  Fichier de titres non trouvé pour part{part_index}. Ignoré.")
        continue

    with open(json_file, "r", encoding="utf-8") as f_json:
        conversations = json.load(f_json)

    with open(titles_file, "r", encoding="utf-8") as f_titles:
        accepted_titles = set(t.strip() for t in f_titles if t.strip())

    filtered = [c for c in conversations if c.get("title") in accepted_titles]

    output_path = Path(INPUT_DIR) / f"important_cleaned_conv_part{part_index}.json"
    with open(output_path, "w", encoding="utf-8") as f_out:
        json.dump(filtered, f_out, indent=2, ensure_ascii=False)

    print(f"✅ {output_path.name} généré avec {len(filtered)} conversations retenues.")
