import {Group, NearestFilter, Sprite, SpriteMaterial, TextureLoader} from "three";
import {flip, rand, randomPointOnSphere} from "../utils.js";
import starsSpecialURL from "../stars/stars-special.png"
import starsURL from "../stars/stars.png"

export function createStars(count) {
    const starGroup = new Group()
    let mat;

    for (let i = 0; i < count; i++) {
        let isSpecial = flip()
        if (isSpecial) {
            const texture = new TextureLoader().load(starsSpecialURL)

            texture.magFilter = NearestFilter
            texture.minFilter = NearestFilter

            texture.repeat.x = 1 / 6;
            texture.offset.x = Math.floor((rand(1, 6)) % 6) * 25 / 150;

            const mat = new SpriteMaterial({
                map: texture,
                color: flip() ? "#ffef9e" : "#ffffff",
                transparent: true,
                opacity: rand(0.1, 1)
            })

            const starObj = new Sprite(mat);
            starObj.scale.set(0.05, 0.05)
            const position = randomPointOnSphere()
            starObj.position.z = position.z
            starObj.position.y = position.y
            starObj.position.x = position.x
            starGroup.add(starObj);
        } else {
            const texture = new TextureLoader().load(starsURL)

            texture.magFilter = NearestFilter
            texture.minFilter = NearestFilter

            texture.repeat.x = 1 / 17;
            texture.offset.x = Math.floor((rand(1, 17)) % 9) * 9 / 144;

            const mat = new SpriteMaterial({
                map: texture,
                color: flip() ? "#ffef9e" : "#ffffff",
                transparent: true,
                opacity: rand(0.1, 1)
            })

            const starObj = new Sprite(mat);
            starObj.scale.set(0.03, 0.03)
            const position = randomPointOnSphere()
            starObj.position.z = position.z
            starObj.position.y = position.y
            starObj.position.x = position.x
            starGroup.add(starObj);
        }
    }
    return starGroup
}