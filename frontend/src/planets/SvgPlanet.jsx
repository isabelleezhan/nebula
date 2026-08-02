function SvgPlanet() {
    return (
        <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
        >
            <defs>
                <radialGradient
                    id="planetLighting"
                    cx="35%"
                    cy="30%"
                    r="70%"
                >
                    <stop
                        offset="0%"
                        stopColor="#7dd8ff"
                    />

                    <stop
                        offset="55%"
                        stopColor="#2674b8"
                    />

                    <stop
                        offset="100%"
                        stopColor="#07182f"
                    />
                </radialGradient>

                <clipPath id="planetClip">
                    <circle
                        cx="200"
                        cy="200"
                        r="120"
                    />
                </clipPath>
            </defs>

            {/* atmosphere */}
            <circle
                cx="200"
                cy="200"
                r="128"
                fill="#59c7ff"
                opacity="0.15"
            />

            {/* ocean sphere */}
            <circle
                cx="200"
                cy="200"
                r="120"
                fill="url(#planetLighting)"
            />

            {/* everything below is clipped inside planet */}
            <g clipPath="url(#planetClip)">

                {/* continent */}
                <path
                    d="
            M120 160
            C145 125, 185 130, 190 155
            C205 175, 185 190, 160 185
            C140 205, 110 190, 120 160
          "
                    fill="#6aa85d"
                />

                {/* another continent */}
                <path
                    d="
            M230 220
            C255 190, 295 205, 300 235
            C280 250, 275 285, 245 280
            C220 265, 215 240, 230 220
          "
                    fill="#84bc67"
                />

                {/* cloud */}
                <path
                    d="
            M105 205
            C145 190, 185 200, 215 215
          "
                    fill="none"
                    stroke="white"
                    strokeWidth="12"
                    strokeLinecap="round"
                    opacity="0.35"
                />

                {/* shadow */}
                <ellipse
                    cx="265"
                    cy="215"
                    rx="95"
                    ry="130"
                    fill="black"
                    opacity="0.32"
                />

            </g>
        </svg>
    )
}

export default SvgPlanet