import os
import re

dir_path = r'c:\PROJECTS\mini project\frontend\src\screens'
files = [f for f in os.listdir(dir_path) if f.endswith('.js')]

theme_row = """      <View style={{flexDirection: "row", alignItems: "center", alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, position: "absolute", bottom: 20, zIndex: 1000}}>
        <Text style={{color: "#8a8ea8", fontSize: 10, fontWeight: "bold", marginRight: 10}}>THEME</Text>
        <TouchableOpacity onPress={() => { console.log('theme click purple'); setAppTheme("purple"); }}><View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: appTheme === "purple" ? "#fff" : "#8C52FF", borderWidth: appTheme === "purple" ? 2 : 0, borderColor: "#8C52FF", marginLeft: 8}} /></TouchableOpacity>
        <TouchableOpacity onPress={() => { console.log('theme click blue'); setAppTheme("blue"); }}><View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: appTheme === "blue" ? "#fff" : "#00E5FF", borderWidth: appTheme === "blue" ? 2 : 0, borderColor: "#00E5FF", marginLeft: 8}} /></TouchableOpacity>
        <TouchableOpacity onPress={() => { console.log('theme click green'); setAppTheme("green"); }}><View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: appTheme === "green" ? "#fff" : "#4CAF50", borderWidth: appTheme === "green" ? 2 : 0, borderColor: "#4CAF50", marginLeft: 8}} /></TouchableOpacity>
        <TouchableOpacity onPress={() => { console.log('theme click orange'); setAppTheme("orange"); }}><View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: appTheme === "orange" ? "#fff" : "#FF9900", borderWidth: appTheme === "orange" ? 2 : 0, borderColor: "#FF9900", marginLeft: 8}} /></TouchableOpacity>
      </View>"""

for file_name in files:
    full_path = os.path.join(dir_path, file_name)
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False

    if 'useAppState' in content:
        # Add appTheme and setAppTheme to useAppState destructuring
        if 'setAppTheme' not in content:
            content = re.sub(
                r'(const \{\s*.*?)(?=\s*\}\s*=\s*useAppState\(\);)', 
                r'\1, appTheme, setAppTheme', 
                content, count=1, flags=re.DOTALL
            )
            
            # Now insert the color array declaration
            def replacer(match):
                hook_statement = match.group(0)
                insertion = '\n  const themeBgColors = appTheme === "blue" ? ["#0B101A", "#152E4D"] : appTheme === "green" ? ["#0A1A0D", "#15401E"] : appTheme === "orange" ? ["#1A0C0B", "#421A0F"] : ["#0B091A", "#1D1B38"];\n'
                return hook_statement + insertion
                
            content = re.sub(r'const \{.*?\} = useAppState\(\);', replacer, content, count=1, flags=re.DOTALL)
            modified = True

        # Replace LinearGradient colors
        if 'LinearGradient colors={["#0B091A", "#1D1B38"]}' in content:
            content = content.replace('LinearGradient colors={["#0B091A", "#1D1B38"]}', 'LinearGradient colors={themeBgColors}')
            modified = True
            
        # Replace the <View style={styles.themeRow}> block if it exists
        theme_block_pattern = re.compile(r'<View style=\{styles\.themeRow\}>.*?</View>', re.DOTALL)
        if theme_block_pattern.search(content):
            content = theme_block_pattern.sub(theme_row, content)
            modified = True

    if modified:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file_name}')

print('Script finished.')
