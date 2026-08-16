import os

def fix_routes():
    for root, _, files in os.walk('backend/modules'):
        if 'routes.py' in files:
            filepath = os.path.join(root, 'routes.py')
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Skip if already fixed
            if '@router.get("")\n@router.get("/")' in content or '@router.get("")\n@router.get("/",' in content:
                print(f"Skipping {filepath} (already fixed)")
                # continue (we still want to check POST routes)
                
            new_content = content.replace('@router.get("/")', '@router.get("")\n@router.get("/")')
            new_content = new_content.replace('@router.get("/",', '@router.get("")\n@router.get("/",')
            new_content = new_content.replace('@router.post("/")', '@router.post("")\n@router.post("/")')
            new_content = new_content.replace('@router.post("/",', '@router.post("")\n@router.post("/",')
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed {filepath}")

if __name__ == '__main__':
    fix_routes()
