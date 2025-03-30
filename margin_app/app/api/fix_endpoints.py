import os
import re

ROUTES_DIR = "margin_app/app/api"

route_regex = re.compile(r'(@router\.get\(["\'](/\\w+)(/\\w+)?["\'])')
func_def_regex = re.compile(r'(@router\.get\(["\']/all["\'].*\)\s+async def \w+\()')

def fix_file(path):
    print(f"Processing file: {path}")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    def fix_route(match):
        prefix, base, sub = match.groups()
        if sub != "/all":
            print(f"Renaming route {base}{sub} to {base}/all in {path}")
            return f"{prefix.split(base)[0]}{base}/all"
        return match.group(0)
    
    content = route_regex.sub(fix_route, content)

    def add_params(match):
        sig = match.group(0)
        if "limit:" in sig and "offset:" in sig:
            return sig
        print(f"Adding limit and offset to endpoint in {path}")
        return re.sub(
            r'\(',
            '(limit: int = Query(25, description="Number of deposits to retrieve"), offset: int = Query(0, description="Number of deposits to skip"), ',
            sig,
            count=1
        )
    content, count = func_def_regex.subn(add_params, content)
    if count:
        print(f"Modified {count} function signature(s) in {path}")
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Finished processing {path}\n")

def main():
    if not os.path.exists(ROUTES_DIR):
        print(f"Directory {ROUTES_DIR} does not exist. Please check the path.")
        return

    found_file = False
    for root, _, files in os.walk(ROUTES_DIR):
        for file in files:
            if file.endswith(".py"):
                found_file = True
                fix_file(os.path.join(root, file))
    if not found_file:
        print("No Python files found in the specified directory.")

if __name__ == "__main__":
    main()
