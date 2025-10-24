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
    keep_keys = ["title", "create_time", "update_time", "project_id", "messages"]
    cleaned = {k: v for k, v in convo.items() if k in keep_keys}
    # Dates lisibles
    if "create_time" in cleaned:
        cleaned["create_time"] = convert_ts(cleaned["create_time"])
    if "update_time" in cleaned:
        cleaned["update_time"] = convert_ts(cleaned["update_time"])
    # Nettoyage messages
    msgs = []
    for msg in cleaned.get("messages", []):
        if not msg.get("text", "").strip():
            continue
        if msg.get("author") == "system":
            continue
        msgs.append({
            "author": msg.get("author", ""),
            "text": msg.get("text", "")
        })
    if msgs:
        cleaned["messages"] = msgs
    else:
        cleaned.pop("messages", None)
    # Supprimer champs vides
    cleaned = {k: v for k, v in cleaned.items() if v not in ["", None, [], {}]}
    return cleaned
    

# Chargement du JSON principal
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)
# Split + clean
total = len(data)
for i in range(0, total, CONVERSATIONS_PER_FILE):
    block = data[i:i + CONVERSATIONS_PER_FILE]
    part_num = i // CONVERSATIONS_PER_FILE + 1
    cleaned_block = []
    titles = []
    for convo in block:
        if convo.get("is_archived") or convo.get("is_deleted"):
            continue
        c = clean_conversation(convo)
        title = c.get("title", "(aucun titre)")
        cleaned_block.append(c)
        titles.append(title)
    # Enregistrement
    with open(f"{OUTPUT_DIR}/{CLEAN_PREFIX}{part_num}.json", "w", encoding="utf-8") as f_out:
        json.dump(cleaned_block, f_out, indent=2, ensure_ascii=False)
    with open(f"{OUTPUT_DIR}/{TITLES_PREFIX}{part_num}.txt", "w", encoding="utf-8") as f_txt:
        f_txt.write("\n".join(titles))
    print(f"✅ Partie {part_num} générée ({len(cleaned_block)} conversations)")
