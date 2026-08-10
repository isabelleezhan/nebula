import {Group} from "three"
import {createBasePlanet} from "../Layers/basePlanet.js"
import {createCraterLayer} from "../Layers/craterLayer.js"

export const createNoAtmospherePlanet = (colors = null) => {
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
    noAtmospherePlanet.add(craterLayer)

    return noAtmospherePlanet
}