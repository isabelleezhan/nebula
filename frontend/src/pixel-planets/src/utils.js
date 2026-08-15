import {createAsteroid} from "./Planets/asteroid.js";
import {createDryPlanet} from "./Planets/DryPlanet.js";
import {createEarthPlanet} from "./Planets/earthPlanet.js";
import {createGasGiant} from "./Planets/gasGiant.js";
import {createGasGiantRing} from "./Planets/gasGiantRing.js";
import {createIcePlanet} from "./Planets/icePlanet.js";
import {createLavaPlanet} from "./Planets/lavaPlanet.js";
import {createStarPlanet} from "./Planets/starPlanet.js";

import {createSeededRandom} from './seededRandom.js'

let randomSource = Math.random

export function random() {
    return randomSource()
}

export function setPlanetRandomSeed(seed) {
    randomSource =
        createSeededRandom(seed)
}

export function rand(min, max) {
    return Math.floor(randomSource() * (max - min + 1) + min)
}

export function flip() {
    return randomSource() > 0.5
}

export function randomPointOnSphere() {
    var u = randomSource()
    var v = randomSource()
    var theta = 2 * Math.PI * u;
    var phi = Math.acos(2 * v - 1);
    var x = 0 + (1 * Math.sin(phi) * Math.cos(theta));
    var y = 0 + (1 * Math.sin(phi) * Math.sin(theta));
    var z = 0 + (1 * Math.cos(phi));
    return {"x": x, "y": y, "z": z};
}

export function generatePlanetByType(type,
                                     colors = null,
                                     stage = "COMPLETE") {
    switch (type) {
        case "No atmosphere":
            return createNoAtmospherePlanet(colors, stage)
        case "Ice Planet":
            return createIcePlanet(colors, stage)
        case "Gas giant 1":
            return createGasGiant(colors, stage)
        case "Gas giant 2":
            return createGasGiantRing(colors, stage)
        case "Asteroid":
            return createAsteroid()
        case "Star":
            return createStarPlanet()
        case "Lava Planet":
            return createLavaPlanet(colors, stage)
        case "Dry Planet":
            return createDryPlanet(undefined, colors)
        case "Earth Planet":
            return createEarthPlanet(colors, stage)
    }
}