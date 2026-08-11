import {Group} from "three";
import {createDenseGasPlanet} from "../Layers/denseGasLayer.js";
import {createRingLayer} from "../Layers/ringLayer.js";

export const createGasGiantRing = (colors = null, stage = "COMPLETE") => {
    const gasGiantGroup = new Group()

    const ring = createRingLayer(undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        colors)
    const gasPlanet = createDenseGasPlanet(undefined,
        undefined,
        colors)
    ring.position.z = 0.01
    ring.scale.set(2.0, 2.0)
    gasGiantGroup.add(gasPlanet)
    if (
        stage === 'CIVILIZATION' ||
        stage === 'COMPLETE'
    ) {
        gasGiantGroup.add(ring)
    }

    return gasGiantGroup
}