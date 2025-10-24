import json
import os
from datetime import datetime

INPUT_FILE = "conversations.json"
OUTPUT_DIR = "cleaned_parts"
CONVERSATIONS_PER_FILE = 40
CLEAN_PREFIX = "conversations_clean_part"
TITLES_PREFIX = "titres_part"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def convert_ts(ts):
    try:
        return datetime.fromtimestamp(ts).strftime("%Y-%m-%d %H:%M:%S")
    except:
        return ts

def clean_conversation(convo):
    keep_keys = {"title", "create_time", "update_time", "project", "project_id", "id", "conversation_id", "messages"}
    cleaned = {k: v for k, v in convo.items() if k in keep_keys}
    # Dates lisibles
    if "create_time" in cleaned:
        cleaned["create_time"] = convert_ts(cleaned["create_time"])
    if "update_time" in cleaned:
        cleaned["update_time"] = convert_ts(cleaned["update_time"])
    # Nettoyage messages
    msgs = []
    for msg in cleaned.get("messages", []):
        text = msg.get("text", "").strip()
        if not text or text in ["```"] or "image_asset_pointer" in text:
            continue
        author = msg.get("author") or msg.get("role")
        if author == "system":
            continue
        msgs.append({
            "author": author,
            "text": text
        })
    if msgs:
        cleaned["messages"] = msgs
    else:
        # Pas de messages utiles = on ignore la conversation
        return None
    # Nettoyer les champs vides
    cleaned = {k: v for k, v in cleaned.items() if v not in ["", None, {}, []]}
    return cleaned
    
# Charger le JSON principal
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)
# Split + Clean
for i in range(0, len(data), CONVERSATIONS_PER_FILE):
    part_index = i // CONVERSATIONS_PER_FILE + 1
    part_convs = data[i:i + CONVERSATIONS_PER_FILE]
    cleaned_list = []
    titles_list = []
    for conv in part_convs:
        cleaned = clean_conversation(conv)
        if cleaned:
            cleaned_list.append(cleaned)
            titles_list.append(cleaned["title"])
    # Sauvegarde JSON nettoyé
    with open(f"{OUTPUT_DIR}/{CLEAN_PREFIX}{part_index}.json", "w", encoding="utf-8") as f_json:
        json.dump(cleaned_list, f_json, indent=2, ensure_ascii=False)
    # Sauvegarde titres
    with open(f"{OUTPUT_DIR}/{TITLES_PREFIX}{part_index}.txt", "w", encoding="utf-8") as f_titles:
        for title in titles_list:
            f_titles.write(title + "\n")
    print(f"✅ conversations_clean_part{part_index}.json et titres_part{part_index}.txt créés.")
