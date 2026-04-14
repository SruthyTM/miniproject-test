import os
import re

dir_path = r'c:\PROJECTS\mini project\frontend\src\screens'
files = [f for f in os.listdir(dir_path) if f.endswith('.js')]

for file_name in files:
    full_path = os.path.join(dir_path, file_name)
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False

    if 'themeBgColors' in content and 'const themeBgColors' not in content:
        # We need to add the declaration block inside the component.
        
        # Make sure appTheme is destructured or added.
        if 'useAppState' not in content:
            # We must import useAppState and declare it
            content = content.replace('import React from "react";', 'import React from "react";\nimport { useAppState } from "../../App";')
            content = re.sub(r'(export function .*?\{)', r'\1\n  const { appTheme } = useAppState();\n  const themeBgColors = appTheme === "blue" ? ["#0B101A", "#152E4D"] : appTheme === "green" ? ["#0A1A0D", "#15401E"] : appTheme === "orange" ? ["#1A0C0B", "#421A0F"] : ["#0B091A", "#1D1B38"];', content, count=1)
            modified = True
        else:
            if 'appTheme' not in content:
                content = re.sub(r'(export function .*?\{)', r'\1\n  const { appTheme } = useAppState();\n  const themeBgColors = appTheme === "blue" ? ["#0B101A", "#152E4D"] : appTheme === "green" ? ["#0A1A0D", "#15401E"] : appTheme === "orange" ? ["#1A0C0B", "#421A0F"] : ["#0B091A", "#1D1B38"];', content, count=1)
                modified = True
            else:
                 content = re.sub(r'(export function .*?\{)', r'\1\n  const themeBgColors = appTheme === "blue" ? ["#0B101A", "#152E4D"] : appTheme === "green" ? ["#0A1A0D", "#15401E"] : appTheme === "orange" ? ["#1A0C0B", "#421A0F"] : ["#0B091A", "#1D1B38"];', content, count=1)
                 modified = True

    if modified:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed missing declarations in {file_name}')

print('Check complete.')
