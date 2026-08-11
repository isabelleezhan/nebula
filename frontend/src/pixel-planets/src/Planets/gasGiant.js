import {Group} from "three";
import {createBaseGasPlanet} from "../Layers/baseGasPlanet.js";
import {createGasPLayer} from "../Layers/gasLayer.js";

export const createGasGiant = (colors = null, stage = "COMPLETE") => {
    const gasGiantGroup = new Group()
    const baseColors =
        colors
            ? [
                colors[1],
                colors[2],
                colors[4],
                colors[5]
            ]
            : undefined

    const gasColors =
        colors
            ? [
                colors[0],
                colors[2],
                colors[3],
                colors[5]
            ]
            : undefined

    const basePlanet = createBaseGasPlanet(undefined,
        undefined,
        baseColors)
    const gasLayer = createGasPLayer(undefined,
        undefined,
        gasColors)
    gasGiantGroup.add(basePlanet)
    if (stage !== 'BARREN') {
        gasGiantGroup.add(gasLayer)
    }

    return gasGiantGroup
}