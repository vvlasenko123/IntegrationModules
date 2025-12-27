export const shapes = {
    line: ({ stroke, sw = 2 }) => (
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
    ),

    arrow: ({ stroke, sw = 2 }) => (
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
                <marker
                    id="arrowhead-end"
                    markerWidth="10"
                    markerHeight="10"
                    refX="10"
                    refY="5"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <polygon points="0 0, 10 5, 0 10" fill={stroke || "#000"} />
                </marker>
            </defs>
            <line
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                stroke={stroke || "#000"}
                strokeWidth={sw}
                markerEnd="url(#arrowhead-end)"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    ),

    dblarrow: ({ stroke, sw = 2 }) => (
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
                <marker
                    id="arrowhead-end"
                    markerWidth="10"
                    markerHeight="10"
                    refX="10"
                    refY="5"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <polygon points="0 0, 10 5, 0 10" fill={stroke || "#000"} />
                </marker>
                <marker
                    id="arrowhead-start"
                    markerWidth="10"
                    markerHeight="10"
                    refX="0"
                    refY="5"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <polygon points="10 0, 0 5, 10 10" fill={stroke || "#000"} />
                </marker>
            </defs>
            <line
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                stroke={stroke || "#000"}
                strokeWidth={sw}
                markerStart="url(#arrowhead-start)"
                markerEnd="url(#arrowhead-end)"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    ),

    square: ({ fill, stroke, sw = 2 }) => (
        <rect width="100%" height="100%" fill={fill || "transparent"} stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
    ),

    circle: ({ fill, stroke, sw = 2 }) => (
        <ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill={fill || "transparent"} stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
    ),

    triangle: ({ fill, stroke, sw = 2 }) => (
        <polygon points="50,0 100,100 0,100" fill={fill || "transparent"} stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
    ),

    star: ({ fill, stroke, sw = 2 }) => (
        <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill={fill || "transparent"} stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
    ),

    parallelogram: ({ fill, stroke, sw = 2 }) => (
        <polygon points="20,0 100,0 80,100 0,100" fill={fill || "transparent"} stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
    ),

    roundedRect: ({ fill, stroke, sw = 2 }) => (
        <rect width="100%" height="100%" rx="20" ry="20" fill={fill || "transparent"} stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
    ),

    capsule: ({ fill, stroke, sw = 2 }) => (
        <rect width="100%" height="100%" rx="50" ry="50" fill={fill || "transparent"} stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
    ),

    pentagon: ({ fill, stroke, sw = 2 }) => (
        <polygon points="50,0 100,38 82,100 18,100 0,38" fill={fill || "transparent"} stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
    ),
    chevron: ({ stroke, sw = 2 }) => (
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <polyline points="0,0 50,100 100,0" fill="none" stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
        </svg>
    ),

    table3x3: ({ fill, stroke, sw = 2, innerSw = 1 }) => (
        <>
            <rect width="100%" height="100%" fill={fill || "transparent"} stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke"/>
            <line x1="0" y1="33%" x2="100%" y2="33%" stroke={stroke || "#000"} strokeWidth={innerSw} vectorEffect="non-scaling-stroke"/>
            <line x1="0" y1="66%" x2="100%" y2="66%" stroke={stroke || "#000"} strokeWidth={innerSw} vectorEffect="non-scaling-stroke"/>
            <line x1="33%" y1="0" x2="33%" y2="100%" stroke={stroke || "#000"} strokeWidth={innerSw} vectorEffect="non-scaling-stroke"/>
            <line x1="66%" y1="0" x2="66%" y2="100%" stroke={stroke || "#000"} strokeWidth={innerSw} vectorEffect="non-scaling-stroke"/>
        </>
    ),

    table3x3LeftMerge: ({ fill, stroke, sw = 2, innerSw = 1 }) => (
        <>
            <rect width="100%" height="100%" fill={fill || "transparent"} stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke"/>
            <line x1="33%" y1="0" x2="33%" y2="100%" stroke={stroke || "#000"} strokeWidth={innerSw} vectorEffect="non-scaling-stroke"/>
            <line x1="66%" y1="0" x2="66%" y2="100%" stroke={stroke || "#000"} strokeWidth={innerSw} vectorEffect="non-scaling-stroke"/>
            <line x1="33%" y1="33%" x2="100%" y2="33%" stroke={stroke || "#000"} strokeWidth={innerSw} vectorEffect="non-scaling-stroke"/>
            <line x1="33%" y1="66%" x2="100%" y2="66%" stroke={stroke || "#000"} strokeWidth={innerSw} vectorEffect="non-scaling-stroke"/>
        </>
    ),

    pyramid: ({ fill, stroke, sw = 2, innerSw = 1 }) => (
        <>
            <polygon points="50,0 100,100 0,100" fill={fill || "transparent"} stroke={stroke || "#000"} strokeWidth={sw} vectorEffect="non-scaling-stroke"/>
            {[0.2, 0.4, 0.6, 0.8].map((t, idx) => (
                <line key={idx} x1={50 - 50*t} y1={t*100} x2={50 + 50*t} y2={t*100} stroke={stroke || "#000"} strokeWidth={innerSw} vectorEffect="non-scaling-stroke"/>
            ))}
        </>
    ),

    circleArrow: ({ fill, stroke, sw = 2 }) => (
        <svg width="100%" height="100%" viewBox="0 -30 100 130" preserveAspectRatio="xMidYMid meet">
            <defs>
                <marker
                    id="arrowhead-circle"
                    markerWidth="8"
                    markerHeight="8"
                    refX="4"
                    refY="4"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <polygon points="0 0, 8 4, 0 8" fill={stroke || "#000"} />
                </marker>
            </defs>

            <circle
                cx="50"
                cy="50"
                r="48"
                fill={fill || "transparent"}
                stroke={stroke || "#000"}
                strokeWidth={sw}
                vectorEffect="non-scaling-stroke"
            />

            <line
                x1="50"
                y1="2"
                x2="50"
                y2="-20"
                stroke={stroke || "#000"}
                strokeWidth={sw}
                markerEnd="url(#arrowhead-circle)"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )
};