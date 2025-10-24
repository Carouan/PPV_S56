import os
import json

def clean_conversation(conversation):
    keys_to_keep = {"title", "create_time", "update_time", "messages"}
    cleaned = {k: v for k, v in conversation.items() if k in keys_to_keep}

    if "messages" in cleaned:
        cleaned_messages = []
        for msg in cleaned["messages"]:
            role = msg.get("role")
            text = msg.get("text", "")
            if text:
                cleaned_messages.append({"role": role, "text": text})
        cleaned["messages"] = cleaned_messages

    return cleaned if cleaned["messages"] else None

def process_and_clean_json_file(input_path):
    base_name = os.path.splitext(os.path.basename(input_path))[0]
    with open(input_path, "r", encoding="utf-8") as f:
        conversations = json.load(f)

    cleaned = []
    titles = []

    for conv in conversations:
        result = clean_conversation(conv)
        if result:
            cleaned.append(result)
            titles.append(result["title"])

    cleaned_json_path = f"cleaned_{base_name}.json"
    titles_txt_path = f"titres_{base_name}.txt"

    with open(cleaned_json_path, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, indent=2, ensure_ascii=False)

    with open(titles_txt_path, "w", encoding="utf-8") as f:
        f.write("\n".join(titles))

    print(f"✅ Nettoyage terminé. Fichiers générés : {cleaned_json_path}, {titles_txt_path}")