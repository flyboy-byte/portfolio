#!/usr/bin/env bash
# Render screen.html to the glTF screen texture (flipped vertically: the model's UVs expect that).
# Usage: tools/monitor-screen/render.sh <output.png>
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
tmp="$(mktemp -d)"
google-chrome-stable --headless=new --no-sandbox --allow-file-access-from-files --hide-scrollbars \
  --window-size=1920,1080 --screenshot="$tmp/screen.png" "file://$here/screen.html" >/dev/null 2>&1
python3 -c "
from PIL import Image, ImageOps
im = Image.open('$tmp/screen.png').convert('RGB')
assert im.size == (1920, 1080), im.size
ImageOps.flip(im).save('$1', optimize=True)
"
rm -rf "$tmp"
echo "wrote $1"
