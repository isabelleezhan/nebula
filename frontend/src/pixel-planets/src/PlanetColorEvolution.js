import {Vector4} from 'three'

function toGray(vector) {
    const luminance =
        vector.x * 0.299 +
        vector.y * 0.587 +
        vector.z * 0.114

    return new Vector4(
        luminance,
        luminance,
        luminance,
        vector.w
    )
}

function mixVector4(from, to, amount) {
    return new Vector4(
        from.x + (to.x - from.x) * amount,
        from.y + (to.y - from.y) * amount,
        from.z + (to.z - from.z) * amount,
        from.w + (to.w - from.w) * amount
    )
}

export function getEvolutionAmount(stage) {
    switch (stage) {
        case 'BARREN':
            return 0

        case 'ATMOSPHERE':
            return 0.2

        case 'TERRAIN':
            return 0.45

        case 'BIOSPHERE':
            return 0.7

        case 'CIVILIZATION':
            return 0.9

        case 'COMPLETE':
            return 1

        default:
            return 0
    }
}

export function evolvePalette(
    finalPalette,
    stage
) {
    const amount =
        getEvolutionAmount(stage)

    return finalPalette.map(
        finalColor => {
            const gray =
                toGray(finalColor)

            return mixVector4(
                gray,
                finalColor,
                amount
            )
        }
    )
}