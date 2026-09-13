import {useEffect, useRef} from 'react'
import {Group} from 'three'
import {createCamera} from '../pixel-planets/src/camera.js'
import {createClock, createScene, createWebGlRenderer} from '../pixel-planets/src/Three.js'
import {generatePlanetByType, setPlanetRandomSeed} from '../pixel-planets/src/utils.js'
import {generatePlanetPalette} from '../pixel-planets/src/planetPaletteGenerator.js'
import {evolvePalette} from '../pixel-planets/src/PlanetColorEvolution.js'
import {getPlanetType} from '../pixel-planets/src/planetVisuals.js'
import '../styles/PixelPlanet.css'

function PixelPlanet({planet}) {
    const containerRef =
        useRef(null)
    const seed =
        planet?.seed ?? planet?.id ?? 1

    const planetType =
        getPlanetType(
            planet?.id ?? 1
        )
    console.log(
        'planet:',
        planet?.id,
        'seed:',
        seed,
        'type:',
        planetType
    )

    const finalPalette =
        generatePlanetPalette(
            planet?.id ?? 1,
            planetType
        )
    const visiblePalette =
        evolvePalette(
            finalPalette,
            planet?.stage
        )

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

        const planetGroup =
            new Group()

        setPlanetRandomSeed(
            planet?.id ?? 1
        )
        const generatedPlanet =
            generatePlanetByType(
                planetType,
                visiblePalette,
                planet?.stage
            )

        planetGroup.add(generatedPlanet)
        scene.add(planetGroup)

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

            generatedPlanet.children.forEach(
                layer => {
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
                    .parentNode === container
            ) {
                container.removeChild(
                    renderer.domElement
                )
            }
        }
    }, [planetType, planet?.id, planet?.stage])

    return (
        <div
            ref={containerRef}
            className="pixel-planet"
            role="img"
            aria-label={
                planet?.name
                    ? `Planet ${planet.name}`
                    : 'Planet'
            }
        />
    )
}

export default PixelPlanet