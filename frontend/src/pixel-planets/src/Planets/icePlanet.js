import {Group, Vector4} from "three"
import {createBasePlanet} from "../Layers/basePlanet.js"
import {createCloudLayer} from "../Layers/cloudLayer.js"
import {createLakeLayer} from "../Layers/lakeLayer.js"

export const createIcePlanet = (colors = null, stage = "COMPLETE") => {
    const icePlanet = new Group()
    const baseColorPalette =
        colors
            ? [
                colors[0],
                colors[2],
                colors[4]
            ]
            : [
                new Vector4(250 / 255, 255 / 255, 255 / 255, 1),
                new Vector4(199 / 255, 212 / 255, 255 / 255, 1),
                new Vector4(146 / 255, 143 / 255, 184 / 255, 1)
            ]
    const basePlanet = createBasePlanet(undefined, undefined, baseColorPalette)
    const lakeLayer =
        createLakeLayer(
            undefined,
            undefined,
            undefined,
            colors
                ? [
                    colors[1],
                    colors[3],
                    colors[5]
                ]
                : undefined
        )
    const cloudLayer = createCloudLayer(colors
        ? [
            colors[0],
            colors[1],
            colors[3],
            colors[5]
        ]
        : undefined)
    icePlanet.add(basePlanet)
    if (
        stage === 'TERRAIN' ||
        stage === 'BIOSPHERE' ||
        stage === 'CIVILIZATION' ||
        stage === 'COMPLETE'
    ) {
        icePlanet.add(lakeLayer)
    }

    if (
        stage === 'BIOSPHERE' ||
        stage === 'CIVILIZATION' ||
        stage === 'COMPLETE'
    ) {
        icePlanet.add(cloudLayer)
    }

    return icePlanet;
}