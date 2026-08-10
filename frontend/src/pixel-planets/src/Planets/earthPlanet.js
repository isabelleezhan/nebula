import {Group, Vector4} from "three";
import {createAtmosphereLayer} from "../Layers/atmosphereLayer.js";
import {createBasePlanet} from "../Layers/basePlanet.js";
import {createCloudLayer} from "../Layers/cloudLayer.js";
import {createlandMassLayer} from "../Layers/landMass.js";

export const createEarthPlanet = (colors = null) => {
    const earth = new Group();
    const baseColors =
        colors
            ? [
                colors[1],
                colors[3],
                colors[5]
            ]
            : [
                new Vector4(102 / 255, 176 / 255, 199 / 255, 1),
                new Vector4(102 / 255, 176 / 255, 199 / 255, 1),
                new Vector4(52 / 255, 65 / 255, 157 / 255, 1)
            ]

    const landColors =
        colors
            ? [
                colors[0],
                colors[2],
                colors[4],
                colors[5]
            ]
            : undefined

    const cloudColors =
        colors
            ? [
                colors[0],
                colors[1],
                colors[2],
                colors[4]
            ]
            : undefined

    const basePlanet = createBasePlanet(undefined, undefined, baseColors)
    const landmass = createlandMassLayer(undefined, undefined, landColors, undefined, undefined, 0.5);
    const clouds = createCloudLayer(cloudColors)
    const atmosphere = createAtmosphereLayer()

    earth.add(basePlanet, landmass, clouds, atmosphere)
    return earth
}