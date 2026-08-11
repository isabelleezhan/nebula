import {generatePlanetPalette} from './planetPaletteGenerator.js'
import {evolvePalette} from './PlanetColorEvolution.js'


const PLANET_TYPES = [
    'No atmosphere',
    'Ice Planet',
    'Gas giant 1',
    'Gas giant 2',
    'Lava Planet',
    'Dry Planet',
    'Earth Planet'
]


export function getPlanetType(seed) {
    const numericSeed =
        Math.abs(Number(seed) || 1)

    const index =
        numericSeed % PLANET_TYPES.length

    return PLANET_TYPES[index]
}


export function getPlanetGlowColor(planet) {
    if (!planet) {
        return 'rgba(92, 76, 145, 0.28)'
    }

    const seed =
        planet.id ?? 1

    const planetType =
        getPlanetType(seed)

    const finalPalette =
        generatePlanetPalette(
            seed,
            planetType
        )

    const visiblePalette =
        evolvePalette(
            finalPalette,
            planet.stage
        )

    const glow =
        visiblePalette[1]

    const r =
        Math.round(glow.x * 255)

    const g =
        Math.round(glow.y * 255)

    const b =
        Math.round(glow.z * 255)

    return `rgba(${r}, ${g}, ${b}, 0.28)`
}