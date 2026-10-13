#!/usr/bin/env bash
# Recorta Iosevka a los caracteres que usa el sitio (P-10).
# La fuente completa pesa ~1 MB por peso; el recorte, unas decenas de KB.
# Requiere fonttools (`brew install fonttools`). Si el contenido suma un
# carácter fuera de este rango, agrégalo a UNICODES y vuelve a ejecutar.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=node_modules/@fontsource/iosevka/files
OUT=src/assets/fonts
# Latín básico, Latín-1 (tildes, ñ, ¿, ©, ·), guiones, comillas, viñeta, elipsis y →.
UNICODES="U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+2192"

for weight in 400 700; do
  pyftsubset "$SRC/iosevka-latin-$weight-normal.woff2" \
    --unicodes="$UNICODES" \
    --flavor=woff2 \
    --output-file="$OUT/iosevka-$weight.woff2"
done
