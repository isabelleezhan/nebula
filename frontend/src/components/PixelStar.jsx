import {useEffect, useRef} from 'react'
import {Group} from 'three'

import {createCamera} from '../pixel-planets/src/camera.js'
import {createClock, createScene, createWebGlRenderer} from '../pixel-planets/src/Three.js'

import {createStarPlanet} from '../pixel-planets/src/Planets/starPlanet.js'
import {setPlanetRandomSeed} from '../pixel-planets/src/utils.js'
import '../styles/PixelStar.css'

function PixelStar({color = null}) {
    const containerRef = useRef(null)

    useEffect(() => {
        const container =
            containerRef.current

        if (!container) {
            return
        }

        const aspect =
            container.clientWidth /
            container.clientHeight

        const scene =
            createScene()

        const clock =
            createClock()

        const camera =
            createCamera(
                75,
                aspect,
                0.1,
                100000
            )

        const renderer =
            createWebGlRenderer()

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        )

        renderer.setPixelRatio(
            window.devicePixelRatio
        )

        renderer.setClearColor(
            0x000000,
            0
        )

        const starGroup =
            new Group()

        setPlanetRandomSeed(
            'landing-star'
        )

        const star = color ? createStarPlanet(color) : createStarPlanet()

        starGroup.add(star)
        scene.add(starGroup)

        camera.position.z = 1

        container.appendChild(
            renderer.domElement
        )

        let animationFrameId

        function animate() {
            animationFrameId =
                requestAnimationFrame(
                    animate
                )

            star.children.forEach(
                (layer) => {
                    const uniforms =
                        layer.material
                            ?.uniforms

                    if (
                        uniforms &&
                        uniforms.time
                    ) {
                        uniforms.time.value =
                            clock.getElapsedTime()
                    }
                }
            )

            renderer.render(
                scene,
                camera
            )
        }

        animate()

        return () => {
            cancelAnimationFrame(
                animationFrameId
            )

            renderer.dispose()

            if (
                renderer.domElement
                    .parentNode ===
                container
            ) {
                container.removeChild(
                    renderer.domElement
                )
            }
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="pixel-star"
        />
    )
}

export default PixelStar