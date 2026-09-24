#!/usr/bin/env python3
"""
Favicon es alkalmazasikonok gyartasa a logobol.

Futtatas:  python scripts/favicon.py
Kell hozza: python -m pip install pillow

A logo (a fejlecben latott csaladfa-jel) egy atlatszatlan feher korre kerul, igy sotet
bongeszotemaban is jol latszik a lapfulon. Kimenet a repo gyokereben:
  favicon.svg, favicon.ico (16/32/48), favicon-32.png, favicon-48.png,
  apple-touch-icon.png (180, teli feher negyzet: az iOS maga kerekiti le, az atlatszo
  sarkokat pedig feketere festene), icon-192.png, icon-512.png (a site.webmanifest-hez).
"""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INK = "#1A1F2B"
DOTS = [(8, "#7DDE92"), (16, "#2EBFA5"), (24, "#2B76C6"), (32, "#4E4187")]
STROKE = 2.2
# A logo szakaszai a 40x40-es rajzlapon (ugyanaz, mint a build.py LOGO-ja).
LINES = [((20, 11), (20, 17)), ((8, 17), (32, 17))] + [((x, 17), (x, 25)) for x in (8, 16, 24, 32)]
HEAD = (20, 7, 4.5)
DOT_R = 3.6

# A rajz befoglalo teglalapja: x 4.4-35.6, y 2.5-33.6. Ennek a kozepe kerul a kor kozepere.
CX, CY = 20, (2.5 + 33.6) / 2
ART_W = 35.6 - 4.4
# A rajz szelessege a vaszon hanyadresze. A also ket szelso potty a sarokba esik, ezert
# 0.76-nal mar pont a kor szelet erintene; 0.68-nal marad korulotte levego.
INSET = 0.68
BG = "#FFFFFF"


def scale_for(size):
    return size * INSET / ART_W


def draw(size, square=False, supersample=16):
    n = size * supersample
    img = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if square:
        d.rectangle([0, 0, n, n], fill=BG)
    else:
        d.ellipse([0, 0, n - 1, n - 1], fill=BG)
    k = scale_for(n)

    def pt(x, y):
        return (n / 2 + (x - CX) * k, n / 2 + (y - CY) * k)

    def dot(x, y, r, color):
        px, py = pt(x, y)
        d.ellipse([px - r * k, py - r * k, px + r * k, py + r * k], fill=color)

    for a, b in LINES:
        d.line([pt(*a), pt(*b)], fill=INK, width=max(1, round(STROKE * k)))
        dot(a[0], a[1], STROKE / 2, INK)   # kerek vegek
        dot(b[0], b[1], STROKE / 2, INK)
    dot(*HEAD, INK)
    for x, color in DOTS:
        dot(x, 30, DOT_R, color)
    return img.resize((size, size), Image.LANCZOS)


def svg():
    k = 40 * INSET / ART_W
    tx, ty = 20 - CX * k, 20 - CY * k
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">'
            '<circle cx="20" cy="20" r="20" fill="%s"/>'
            '<g transform="translate(%.3f %.3f) scale(%.4f)">'
            '<circle cx="20" cy="7" r="4.5" fill="%s"/>'
            '<path d="M20 11v6M8 17h24M8 17v8M16 17v8M24 17v8M32 17v8" stroke="%s" stroke-width="2.2" stroke-linecap="round" fill="none"/>'
            '%s</g></svg>\n') % (BG, tx, ty, k, INK, INK,
                                 "".join('<circle cx="%d" cy="30" r="3.6" fill="%s"/>' % (x, c) for x, c in DOTS))


def main():
    out = lambda name: os.path.join(ROOT, name)
    open(out("favicon.svg"), "w", encoding="utf-8", newline="\n").write(svg())
    draw(32).save(out("favicon-32.png"), optimize=True)
    draw(48).save(out("favicon-48.png"), optimize=True)
    draw(180, square=True).convert("RGB").save(out("apple-touch-icon.png"), optimize=True)
    draw(192).save(out("icon-192.png"), optimize=True)
    draw(512).save(out("icon-512.png"), optimize=True)
    draw(48).save(out("favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)],
                  append_images=[draw(16), draw(32)])
    print("Kész: favicon.svg, favicon.ico, favicon-32.png, favicon-48.png, apple-touch-icon.png, icon-192.png, icon-512.png")


if __name__ == "__main__":
    main()
