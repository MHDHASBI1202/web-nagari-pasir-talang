import re
f = r"d:\Web NPT\admin\index.html"
with open(f, "r", encoding="utf-8") as fp:
    c = fp.read()
# Remove setWaliWa field
c = re.sub(r'<div class="field">\s*<label for="setWaliWa">.*?</label>\s*<input type="text" id="setWaliWa".*?/>\s*</div>', '', c, flags=re.DOTALL)
# Remove setWaliWa JS assignments
c = re.sub(r"document\.getElementById\('setWaliWa'\)\.value\s*=\s*d\.waliWa\s*\|\|\s*'';\n?", '', c)
c = re.sub(r"waliWa:\s*document\.getElementById\('setWaliWa'\)\.value\.trim\(\),\n?", '', c)
with open(f, "w", encoding="utf-8") as fp:
    fp.write(c)
print("admin/index.html cleaned")

f = r"d:\Web NPT\assets\js\settings-loader.js"
with open(f, "r", encoding="utf-8") as fp:
    c = fp.read()
c = re.sub(r"// Update WhatsApp button.*?\}", "", c, flags=re.DOTALL)
c = re.sub(r"var waBtn\s*=\s*document\.querySelector\('\.btn-wali-wa'\);.*?if\s*\(waBtn\)\s*waBtn\.href\s*=\s*waLink;", "", c, flags=re.DOTALL)
with open(f, "w", encoding="utf-8") as fp:
    fp.write(c)
print("settings-loader.js cleaned")
