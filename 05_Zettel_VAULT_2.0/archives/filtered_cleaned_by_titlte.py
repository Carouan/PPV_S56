import json
import os

INPUT_DIR = "cleaned_parts"
CLEAN_PREFIX = "conversations_clean_part"
TITLES_OK_PREFIX = "titres_part"
OUTPUT_PREFIX = "important_cleaned_conversations_part"

# Détection automatique des fichiers disponibles
for filename in os.listdir(INPUT_DIR):
    if filename.startswith(CLEAN_PREFIX) and filename.endswith(".json"):
        part_num = filename.replace(CLEAN_PREFIX, "").replace(".json", "")
        json_path = os.path.join(INPUT_DIR, filename)
        txt_path = os.path.join(INPUT_DIR, f"{TITLES_OK_PREFIX}{part_num}_OK.txt")

        if not os.path.exists(txt_path):
            print(f"⚠️ Fichier titres OK manquant pour part {part_num}, ignoré.")
            continue

        # Chargement des conversations nettoyées
        with open(json_path, "r", encoding="utf-8") as f_json:
            cleaned_conversations = json.load(f_json)

        # Lecture des titres à conserver
        with open(txt_path, "r", encoding="utf-8") as f_txt:
            selected_titles = set(line.strip() for line in f_txt if line.strip())

        # Sélection des conversations complètes
        filtered = [
            convo for convo in cleaned_conversations
            if convo.get("title", "").strip() in selected_titles
        ]

        output_path = os.path.join(INPUT_DIR, f"{OUTPUT_PREFIX}{part_num}.json")
        with open(output_path, "w", encoding="utf-8") as f_out:
            json.dump(filtered, f_out, indent=2, ensure_ascii=False)

        print(f"✅ Fichier filtré créé : {output_path} ({len(filtered)} conversations)")
