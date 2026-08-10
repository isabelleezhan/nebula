import {Color, Vector4} from 'three'

function hashString(value) {
    const stringValue = String(value)

    let hash = 2166136261

    for (let i = 0; i < stringValue.length; i++) {
        hash ^= stringValue.charCodeAt(i)
        hash = Math.imul(hash, 16777619)
    }

    // Mix the bits more so nearby IDs
    // produce very different results.
    hash ^= hash >>> 16
    hash = Math.imul(hash, 0x7feb352d)
    hash ^= hash >>> 15
    hash = Math.imul(hash, 0x846ca68b)
    hash ^= hash >>> 16

    return hash >>> 0
}

function hslToVector4(h, s, l) {
    const color = new Color()

    color.setHSL(
        h,
        s,
        l
    )

    return new Vector4(
        color.r,
        color.g,
        color.b,
        1
    )
}

export function getPlanetPalette(planet) {
    const hash =
        hashString(
            planet?.id ?? 1
        )

    /*
     * Hue must be between 0 and 1.
     *
     * Different planet IDs therefore
     * start at different places around
     * the color wheel.
     */
    const hue =
        (hash % 360) / 360

    /*
     * Slightly vary saturation too so
     * planets don't all have the exact
     * same intensity.
     */
    const saturation =
        0.45 +
        ((hash >> 4) % 25) / 100

    return [
        hslToVector4(
            hue,
            saturation,
            0.72
        ),

        hslToVector4(
            hue,
            saturation,
            0.56
        ),

        hslToVector4(
            hue,
            saturation,
            0.40
        ),

        hslToVector4(
            hue,
            saturation,
            0.27
        )
    ]
}

export function getTexturePaletteIndex(planet) {
    const hash =
        hashString(
            planet?.id ?? 1
        )

    return hash % 2
}