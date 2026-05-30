#!/usr/bin/env python3
"""Generate cute fantasy app icons with no external dependencies.

Draws a purple->pink diagonal gradient rounded square with a white
five-point star and a few sparkles. Pure stdlib (zlib + struct) PNG writer.
"""
import math
import struct
import zlib
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "www", "icons")


def lerp(a, b, t):
    return a + (b - a) * t


def write_png(path, width, height, pixels):
    """pixels: bytes of RGBA, length width*height*4."""
    raw = bytearray()
    stride = width * 4
    for y in range(height):
        raw.append(0)  # filter type 0
        raw.extend(pixels[y * stride:(y + 1) * stride])
    compressed = zlib.compress(bytes(raw), 9)

    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data +
                struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff))

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)  # RGBA
    with open(path, "wb") as f:
        f.write(sig)
        f.write(chunk(b"IHDR", ihdr))
        f.write(chunk(b"IDAT", compressed))
        f.write(chunk(b"IEND", b""))


def point_in_star(px, py, cx, cy, r_outer, r_inner, rot=-math.pi / 2):
    """Return True if point is inside a 5-point star centered at cx,cy."""
    ang = math.atan2(py - cy, px - cx) - rot
    ang = ang % (2 * math.pi)
    seg = math.pi / 5  # 36deg
    # angle within a 72deg sector
    a = ang % (2 * seg)
    if a > seg:
        a = 2 * seg - a
    # boundary radius interpolated between outer (a=0) and inner (a=seg)
    t = a / seg
    r_bound = lerp(r_outer, r_inner, t)
    dist = math.hypot(px - cx, py - cy)
    return dist <= r_bound


def make_icon(size):
    px = bytearray(size * size * 4)
    radius = size * 0.18  # rounded corner radius
    cx, cy = size / 2, size / 2

    # gradient endpoints (top-left -> bottom-right)
    c0 = (167, 139, 250)   # soft violet
    c1 = (244, 114, 182)   # pink
    c2 = (96, 165, 250)    # sky blue accent

    sparkles = [(size * 0.74, size * 0.30, size * 0.05),
                (size * 0.26, size * 0.70, size * 0.04),
                (size * 0.70, size * 0.72, size * 0.035),
                (size * 0.30, size * 0.28, size * 0.03)]

    for y in range(size):
        for x in range(size):
            i = (y * size + x) * 4
            # rounded-square mask
            dx = max(abs(x - cx) - (size / 2 - radius), 0)
            dy = max(abs(y - cy) - (size / 2 - radius), 0)
            corner_d = math.hypot(dx, dy)
            if corner_d > radius:
                px[i + 3] = 0  # transparent outside rounded square
                continue

            t = (x + y) / (2 * size)
            # three-stop gradient
            if t < 0.5:
                tt = t / 0.5
                r = lerp(c0[0], c2[0], tt)
                g = lerp(c0[1], c2[1], tt)
                b = lerp(c0[2], c2[2], tt)
            else:
                tt = (t - 0.5) / 0.5
                r = lerp(c2[0], c1[0], tt)
                g = lerp(c2[1], c1[1], tt)
                b = lerp(c2[2], c1[2], tt)

            # main star
            if point_in_star(x, y, cx, cy, size * 0.30, size * 0.135):
                r, g, b = 255, 255, 255
            else:
                # sparkles
                for sxc, syc, sr in sparkles:
                    if point_in_star(x, y, sxc, syc, sr, sr * 0.42):
                        r, g, b = 255, 245, 255
                        break

            # soft anti-alias on the rounded corner edge
            a = 255
            if corner_d > radius - 1.5:
                a = int(255 * max(0.0, (radius - corner_d) / 1.5))

            px[i] = int(r)
            px[i + 1] = int(g)
            px[i + 2] = int(b)
            px[i + 3] = a
    return px


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for size in (192, 512):
        data = make_icon(size)
        out = os.path.join(OUT_DIR, f"icon-{size}.png")
        write_png(out, size, size, data)
        print("wrote", os.path.normpath(out))
    # maskable padded icon (extra safe-zone padding) reuse 512
    print("done")


if __name__ == "__main__":
    main()
