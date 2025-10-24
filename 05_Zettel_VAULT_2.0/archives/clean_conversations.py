import json
import os





INPUT_FILE = "conversations_part3.json"  # À adapter si nécessaire
OUTPUT_FILE = "cleaned_conversations_part3.json"

def is_valid_conversation(conv):
    # On exclut les conversations supprimées ou archivées
    return not conv.get("is_archived", False) and not conv.get("is_deleted", False)

def extract_project_tag(conv):
    project = conv.get("project_id")
    return f"#project/{project}" if project else None

def simplify_conversation(conv):
    simplified = {
        "title": conv.get("title", "Sans titre"),
        "create_time": conv.get("create_time"),
        "update_time": conv.get("update_time"),
        "project_tag": extract_project_tag(conv),
        "messages": []
    }

    mapping = conv.get("mapping", {})
    
    # Construction du fil de discussion à partir de la racine
    def get_root_node_id():
        for node_id, node in mapping.items():
            if node.get("parent") is None:
                return node_id
        return None

    def extract_thread(node_id):
        node = mapping.get(node_id, {})
        message = node.get("message")
        if message and message.get("author", {}).get("role") in ("user", "assistant"):
            simplified["messages"].append({
                "role": message["author"]["role"],
                "text": "".join(message["content"].get("parts", []))
            })
        for child_id in node.get("children", []):
            extract_thread(child_id)

    root_id = get_root_node_id()
    if root_id:
        extract_thread(root_id)

    return simplified

def main():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    cleaned = []
    for conv in data:
        if is_valid_conversation(conv):
            cleaned.append(simplify_conversation(conv))

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, indent=2, ensure_ascii=False)

    print(f"✅ Nettoyage terminé. Fichier exporté : {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
