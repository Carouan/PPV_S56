import json
import os
from datetime import datetime

# === CONFIGURATION ===
INPUT_FILE = "conversations.json"              # Fichier source
OUTPUT_DIR = "cleaned_parts"                   # Dossier de sortie
PREFIX_CLEAN = "conversations_clean_part"
PREFIX_IMPORTANT = "important_cleaned_conversations_part"
CONVERSATIONS_PER_FILE = 40                    # Nombre par fichier

os.makedirs(OUTPUT_DIR, exist_ok=True)

# === OUTIL : Convertit timestamp en date lisible ===
def convert_ts(ts):
    try:
        return datetime.fromtimestamp(ts).strftime("%Y-%m-%d %H:%M:%S")
    except:
        return ts

# === OUTIL : Nettoyage d’une conversation ===
def clean_conversation(convo):
    # Convertir les timestamps
    if "create_time" in convo:
        convo["create_time"] = convert_ts(convo["create_time"])
    if "update_time" in convo:
        convo["update_time"] = convert_ts(convo["update_time"])

    # Supprimer les champs vides
    convo = {k: v for k, v in convo.items() if v not in ["", None, [], {}]}

    # Nettoyer les messages
    messages = []
    for msg in convo.get("messages", []):
        if not msg.get("text", "").strip():
            continue
        try:
            parsed = json.loads(msg["text"])
            cleaned = {k: v for k, v in parsed.items() if k in ["asset_pointer", "content_type"]}
            msg["text"] = json.dumps(cleaned, ensure_ascii=False)
        except:
            pass
        messages.append(msg)
    if messages:
        convo["messages"] = messages
    else:
        convo.pop("messages", None)

    return convo

# === CHARGEMENT DU FICHIER D’ORIGINE ===
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    all_conversations = json.load(f)

# === TRAITEMENT PAR BLOCS ===
total = len(all_conversations)
for i in range(0, total, CONVERSATIONS_PER_FILE):
    block = all_conversations[i:i + CONVERSATIONS_PER_FILE]
    index = i // CONVERSATIONS_PER_FILE + 1

    cleaned_conversations = []
    important_conversations = []

    for convo in block:
        cleaned = clean_conversation(convo)
        title = cleaned.get("title", "(aucun titre)")
        print(f"\nTitre : {title}")
        keep = input("Souhaitez-vous l’inclure dans la version importante ? (Y/N) : ").strip().lower()
        cleaned_conversations.append(cleaned)
        if keep == "y":
            important_conversations.append(cleaned)

    # Sauvegarde des fichiers
    file_clean = os.path.join(OUTPUT_DIR, f"{PREFIX_CLEAN}{index}.json")
    file_important = os.path.join(OUTPUT_DIR, f"{PREFIX_IMPORTANT}{index}.json")

    with open(file_clean, "w", encoding="utf-8") as f1:
        json.dump(cleaned_conversations, f1, indent=2, ensure_ascii=False)

    with open(file_important, "w", encoding="utf-8") as f2:
        json.dump(important_conversations, f2, indent=2, ensure_ascii=False)

    print(f"\n✅ Partie {index} traitée :")
    print(f"   - {file_clean} ({len(cleaned_conversations)} conversations nettoyées)")
    print(f"   - {file_important} ({len(important_conversations)} conversations importantes)")
