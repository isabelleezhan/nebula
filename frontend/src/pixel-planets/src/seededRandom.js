export function createSeededRandom(seedValue) {
    const seedString =
        String(seedValue ?? 1)

    let seed = 2166136261

    for (let i = 0; i < seedString.length; i++) {
        seed ^= seedString.charCodeAt(i)
        seed = Math.imul(seed, 16777619)
    }

    return function random() {
        seed += 0x6D2B79F5

        let t = seed

        t = Math.imul(
            t ^ (t >>> 15),
            t | 1
        )

        t ^= t +
            Math.imul(
                t ^ (t >>> 7),
                t | 61
            )

        return (
            (t ^ (t >>> 14)) >>> 0
        ) / 4294967296
    }
}