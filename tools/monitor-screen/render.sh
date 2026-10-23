#!/usr/bin/env bash
# Render screen.html to the glTF screen texture (flipped vertically: the model's UVs expect that).
# Also renders the cursor-off frame used for the blink (public/models/screen-nocursor.webp).
# Usage: tools/monitor-screen/render.sh <screen.png> [<screen-nocursor.webp>]
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
tmp="$(mktemp -d)"
shoot() {
  google-chrome-stable --headless=new --no-sandbox --allow-file-access-from-files --hide-scrollbars \
    --window-size=1920,1080 --screenshot="$tmp/$1.png" "file://$here/screen.html$2" >/dev/null 2>&1
}
shoot on ""
shoot off "#nocursor"
python3 - "$tmp" "$1" "${2:-}" <<'PY'
import sys
from PIL import Image, ImageOps
tmp, out_on, out_off = sys.argv[1:4]
def flip(name):
    im = Image.open(f"{tmp}/{name}.png").convert("RGB")
    assert im.size == (1920, 1080), im.size
    return ImageOps.flip(im)
flip("on").save(out_on, optimize=True)
print("wrote", out_on)
if out_off:
    flip("off").save(out_off, lossless=True, quality=100, method=6)
    print("wrote", out_off)
PY
rm -rf "$tmp"
