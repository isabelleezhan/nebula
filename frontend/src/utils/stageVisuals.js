// Shared visual metadata for planet evolution stages. Mirrors the backend's
// PlanetStage enum (BARREN -> ATMOSPHERE -> TERRAIN -> BIOSPHERE ->
// CIVILIZATION -> COMPLETE) and gives each stage a color so it reads as a
// rank at a glance across Orbit, Galaxy, and the detail pages.

export const STAGE_ORDER = [
    'BARREN',
    'ATMOSPHERE',
    'TERRAIN',
    'BIOSPHERE',
    'CIVILIZATION',
    'COMPLETE'
]

const STAGE_META = {
    BARREN: {
        label: 'Barren',
        color: '#b9b3c4',
        bg: 'rgba(144, 137, 161, 0.16)',
        border: 'rgba(144, 137, 161, 0.4)'
    },
    ATMOSPHERE: {
        label: 'Atmosphere forming',
        color: '#a9c8f2',
        bg: 'rgba(143, 180, 232, 0.14)',
        border: 'rgba(143, 180, 232, 0.4)'
    },
    TERRAIN: {
        label: 'Terrain forming',
        color: '#c2b8f5',
        bg: 'rgba(154, 143, 224, 0.16)',
        border: 'rgba(154, 143, 224, 0.42)'
    },
    BIOSPHERE: {
        label: 'Biosphere thriving',
        color: '#a3e8ba',
        bg: 'rgba(127, 217, 160, 0.14)',
        border: 'rgba(127, 217, 160, 0.4)'
    },
    CIVILIZATION: {
        label: 'Civilization',
        color: '#f3a4dc',
        bg: 'rgba(236, 111, 189, 0.16)',
        border: 'rgba(236, 111, 189, 0.45)'
    },
    COMPLETE: {
        label: 'Stabilized',
        color: '#efe9ff',
        bg: 'linear-gradient(135deg, rgba(236, 111, 189, 0.22), rgba(185, 164, 255, 0.22))',
        border: 'rgba(234, 224, 255, 0.5)'
    }
}

export function getStageMeta(stage) {
    return STAGE_META[stage] || STAGE_META.BARREN
}

export function getStageChipStyle(stage) {
    const meta = getStageMeta(stage)

    return {
        '--chip-color': meta.color,
        '--chip-bg': meta.bg,
        '--chip-border': meta.border
    }
}
