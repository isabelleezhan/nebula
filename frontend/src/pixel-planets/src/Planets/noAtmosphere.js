import {Group} from "three"
import {createBasePlanet} from "../Layers/basePlanet.js"
import {createCraterLayer} from "../Layers/craterLayer.js"

export const createNoAtmospherePlanet = (colors = null, stage = "COMPLETE") => {
    const noAtmospherePlanet = new Group()

    const basePlanet = createBasePlanet(undefined, undefined, colors)
    const craterLayer = createCraterLayer(undefined,
        colors
            ? [
                colors[1],
                colors[3],
                colors[5]
            ]
            : undefined)

    noAtmospherePlanet.add(basePlanet)
    if (stage !== 'BARREN') {
        noAtmospherePlanet.add(craterLayer)
    }

    return noAtmospherePlanet
}