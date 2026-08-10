import {Mesh, MeshBasicMaterial, NearestFilter, PlaneGeometry, TextureLoader} from "three";
import highlightURL from '../Images/highlight.png'

export const Border = () => {
    const texture = new TextureLoader().load(highlightURL);
    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter
    const planetGeometry = new PlaneGeometry(1, 1);
    const material = new MeshBasicMaterial({
        map: texture
    })
    const mesh = new Mesh(planetGeometry, material)
    return mesh
}