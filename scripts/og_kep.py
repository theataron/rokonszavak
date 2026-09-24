#!/usr/bin/env python3
"""
A megosztasi kep (og-kep.png, 1200x630) ujrarajzolasa az oldal szineivel.
Futtatas (csak ha a szinek vagy a szoveg valtozik):  python scripts/og_kep.py
Kell hozza: python -m pip install pillow, es a Georgia / Segoe UI betutipus (Windows).
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts")

BG, TEXT, SOFT = "#F8FFE5", "#1A1F2B", "#555C68"
LEVELS = ["#7DDE92", "#2EBFA5", "#2B76C6", "#4E4187"]
S = 2  # rajzolas dupla meretben, a vegen kicsinyites: simabb szelek

img = Image.new("RGB", (1200 * S, 630 * S), BG)
d = ImageDraw.Draw(img)


def circle(cx, cy, r, fill):
    d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=fill)


def line(x1, y1, x2, y2):
    d.line([x1 * S, y1 * S, x2 * S, y2 * S], fill=TEXT, width=6 * S)


circle(600, 95, 20, TEXT)
line(600, 112, 600, 143)
line(342, 143, 858, 143)
for i, x in enumerate([345, 515, 685, 855]):
    line(x, 143, x, 186)
    circle(x, 217, 32, LEVELS[i])


def text(y, s, font, size, fill):
    f = ImageFont.truetype(os.path.join(FONTS, font), size * S)
    d.text((600 * S, y * S), s, font=f, fill=fill, anchor="ms")


text(398, "Melyik négy szó illik össze?", "georgiab.ttf", 64, TEXT)
text(484, "Rokonszavak", "georgiab.ttf", 46, TEXT)
text(550, "napi magyar szójáték · rokonszavak.hu", "segoeuib.ttf", 30, SOFT)

img.resize((1200, 630), Image.LANCZOS).save(os.path.join(ROOT, "og-kep.png"), optimize=True)
print("   og-kep.png")
