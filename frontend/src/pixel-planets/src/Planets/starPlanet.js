import {Group} from "three"
import {createStar} from "../Layers/star.js"
import {createStarBlobLayer} from "../Layers/starBlobLayer.js"
import {createStarFlareLayer} from "../Layers/starFlareLayer.js"

export const createStarPlanet = (color = null) => {
    const StarPlanet = new Group()

    const basePlanet = createStar(undefined, undefined,
        undefined, undefined, color)
    const starFlareLayer = createStarFlareLayer(undefined, undefined, undefined, color)
    const blobLayer = createStarBlobLayer()

    starFlareLayer.position.z = 0.01
    starFlareLayer.scale.set(1.2, 1.2)
    blobLayer.position.z = -0.01
    blobLayer.scale.set(1.9, 1.9)

    StarPlanet.add(basePlanet)
    StarPlanet.add(starFlareLayer)
    StarPlanet.add(blobLayer)

    return StarPlanet
}