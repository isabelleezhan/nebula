import {Color, Vector4} from 'three'

import {createSeededRandom} from './seededRandom.js'

function colorToVector4(color) {
    return new Vector4(
        color.r,
        color.g,
        color.b,
        1
    )
}

function makeColor(
    hue,
    saturation,
    lightness
) {
    const color =
        new Color()

    color.setHSL(
        hue,
        saturation,
        lightness
    )

    return colorToVector4(color)
}

export function generatePlanetPalette(
    seed,
    planetType
) {
    const random =
        createSeededRandom(
            `${seed}-${planetType}-palette`
        )

    const baseHue =
        random()

    /*
     * Instead of four shades of exactly
     * one hue, let neighboring colors
     * wander around the color wheel.
     */
    const hueShift1 =
        (random() - 0.5) * 0.12

    const hueShift2 =
        (random() - 0.5) * 0.20

    const saturation =
        0.45 +
        random() * 0.35

    return [
        makeColor(
            baseHue,
            saturation,
            0.78
        ),

        makeColor(
            baseHue + hueShift1 * 0.5,
            saturation,
            0.66
        ),

        makeColor(
            baseHue + hueShift1,
            saturation * 0.95,
            0.54
        ),

        makeColor(
            baseHue + hueShift2,
            saturation * 0.9,
            0.42
        ),

        makeColor(
            baseHue + hueShift2 * 1.2,
            saturation * 0.82,
            0.30
        ),

        makeColor(
            baseHue + hueShift2 * 1.4,
            saturation * 0.72,
            0.20
        )
    ]
}