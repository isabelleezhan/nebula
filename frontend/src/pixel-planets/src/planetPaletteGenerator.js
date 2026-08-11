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

function wrapHue(hue) {
    if (hue < 0) {
        return hue + 1
    }

    if (hue > 1) {
        return hue - 1
    }

    return hue
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

    const analogousShift =
        (random() - 0.5) * 0.12

    const accentDirection =
        random() < 0.5
            ? -1
            : 1

    const accentShift =
        0.38 + random() * 0.06

    const primaryHue =
        baseHue

    const analogousHue =
        baseHue + analogousShift

    const accentHue =
        baseHue +
        accentDirection *
        accentShift

    const primarySaturation =
        0.48 +
        random() * 0.22

    const accentSaturation =
        0.25 +
        random() * 0.18

    return [
        // bright highlight
        makeColor(
            primaryHue,
            primarySaturation * 0.65,
            0.78
        ),

        // main planet color
        makeColor(
            primaryHue,
            primarySaturation,
            0.64
        ),

        // nearby analogous variation
        makeColor(
            analogousHue,
            primarySaturation * 0.9,
            0.52
        ),

        // darker analogous variation
        makeColor(
            analogousHue,
            primarySaturation * 0.75,
            0.40
        ),

        // ONE restrained contrasting accent
        makeColor(
            accentHue,
            accentSaturation,
            0.46
        ),

        // deep shadow returns to main family
        makeColor(
            primaryHue,
            primarySaturation * 0.55,
            0.20
        )
    ]
}