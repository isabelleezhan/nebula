# Attributions

## Pixel Planet Rendering

Nebula's procedural pixel-planet rendering system is currently adapted in part from **PixelPlanets**, a
JavaScript/Three.js port created by **Timur310**, which itself ports the original **Pixel Planet Generator** created by
**Deep-Fold**.

### Original project

**Pixel Planet Generator — Deep-Fold**

The original Pixel Planet Generator and its shaders were created by Deep-Fold and are distributed under the MIT License.

Nebula draws inspiration from and adapts concepts from the original project's layered procedural planet-generation
system, including shader-based terrain, atmosphere, cloud, and planetary surface effects.

### JavaScript / Three.js port

**PixelPlanets — Timur310**

Nebula's initial browser-based planet renderer was developed using Timur310's JavaScript/Three.js port of Deep-Fold's
Pixel Planet Generator as a reference and implementation starting point.

Nebula has subsequently introduced application-specific modifications and systems, including:

* deterministic planet generation from persistent seeds;
* Nebula-specific planet archetypes and generation rules;
* deterministic color palettes;
* progression-based visual evolution;
* gradual palette and feature reveal as focus time accumulates;

At the time of writing, Timur310's repository does not appear to contain an explicit software license. Its code is
therefore acknowledged here separately from Deep-Fold's MIT-licensed original. Nebula's planet renderer is being
progressively refactored to replace port-derived implementation with original Nebula code while retaining attribution
for the projects that informed its development.

## MIT License Notice

Portions derived from or based directly on Deep-Fold's Pixel Planet Generator are used in accordance with the MIT
License.

The full MIT license and applicable copyright notice for Deep-Fold's original project should be preserved alongside
Nebula's third-party license documentation.

