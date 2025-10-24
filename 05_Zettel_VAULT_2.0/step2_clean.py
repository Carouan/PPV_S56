import os
import json
from datetime import datetime

# === CONFIGURATION ===
INPUT_DIR = "cleaned_parts"  # <== on réutilise bien les fichiers de step1
OUTPUT_DIR = "cleaned_parts_step2"  # output distinct pour ne rien écraser
CONVERSATION_PREFIX = "conversations_clean_part"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# === UTILITAIRES ===
def convert_ts(ts):
    try:
        return datetime.fromtimestamp(ts).strftime("%Y-%m-%d %H:%M:%S")
    except:
        return ts

def clean_conversation(conv):
    keep_keys = [
        "title", "create_time", "update_time",
        "project", "project_id", "id", "conversation_id", "messages"
    ]
    cleaned = {k: v for k, v in conv.items() if k in keep_keys}

    # Dates
    if "create_time" in cleaned:
        cleaned["create_time"] = convert_ts(cleaned["create_time"])
    if "update_time" in cleaned:
        cleaned["update_time"] = convert_ts(cleaned["update_time"])

    # Nettoyage des messages
    messages = []
    for msg in conv.get("messages", []):
        if not isinstance(msg, dict):
            continue

        text = msg.get("text", "")
        author = msg.get("author", "")

        # Si texte vide ou suspect
        if not text or not isinstance(text, str):
            continue
        text = text.strip()
        if text in ["…"] or "image_asset_pointer" in text:
            continue
        if author.lower() == "system" or msg.get("role", "").lower() == "system":
            continue

        messages.append({
            "author": author,
            "text": text
        })

    if not messages:
        return None

    cleaned["messages"] = messages

    # Supprime champs vides
    cleaned = {k: v for k, v in cleaned.items() if v not in ["", None, {}, []]}
    return cleaned

# === TRAITEMENT ===
for filename in os.listdir(INPUT_DIR):
    if not filename.startswith(CONVERSATION_PREFIX) or not filename.endswith(".json"):
        continue

    input_path = os.path.join(INPUT_DIR, filename)
    output_path = os.path.join(OUTPUT_DIR, filename)

    with open(input_path, "r", encoding="utf-8") as f:
        conversations = json.load(f)

    cleaned_list = []
    for conv in conversations:
        cleaned = clean_conversation(conv)
        if cleaned:
            cleaned_list.append(cleaned)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(cleaned_list, f, indent=2, ensure_ascii=False)

    print(f"✅ {filename} → {len(cleaned_list)} conversations gardées")
