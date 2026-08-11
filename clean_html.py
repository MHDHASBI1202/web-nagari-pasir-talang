import re

f = r"d:\Web NPT\index.html"
with open(f, "r", encoding="utf-8") as fp:
    c = fp.read()

# Remove btn-modal-wa
c = re.sub(r'<button class="btn-modal-wa"[^>]*>.*?</button>', '', c, flags=re.DOTALL)

# Remove btn-wali-wa completely
c = re.sub(r'<!-- \S+ Klik \S+ WhatsApp ke nomor kantor -->\s*<a[^>]*class="btn-wali-wa"[^>]*>.*?</a>', '', c, flags=re.DOTALL)
c = re.sub(r'<a[^>]*class="btn-wali-wa"[^>]*>.*?</a>', '', c, flags=re.DOTALL)

# Remove layanan-btn-wa
c = re.sub(r'<!-- \S+ Setiap layanan: klik "Ajukan Layanan".*?-->', '', c)
c = re.sub(r'<a[^>]*class="layanan-btn-wa[^"]*"[^>]*>.*?</a>', '', c, flags=re.DOTALL)

# Remove floating WhatsApp button
c = re.sub(r'<!-- \S+ WhatsApp Floating Button -->\s*<a href="https://wa\.me.*?</a>', '', c, flags=re.DOTALL)
c = re.sub(r'<a href="https://wa\.me/[^>]*class="floating-wa"[^>]*>.*?</a>', '', c, flags=re.DOTALL)

with open(f, "w", encoding="utf-8") as fp:
    fp.write(c)
print("index.html cleaned")
