import React from "react";

export const SHAPE_ICONS = {
    square: (
        <svg width="40" height="40">
            <rect x="4" y="4" width="32" height="32" stroke="black" fill="none" strokeWidth="2"/>
        </svg>
    ),

    circle: (
        <svg width="40" height="40">
            <circle cx="20" cy="20" r="14" stroke="black" fill="none" strokeWidth="2"/>
        </svg>
    ),

    triangle: (
        <svg width="40" height="40">
            <polygon points="20,6 34,34 6,34" stroke="black" fill="none" strokeWidth="2"/>
        </svg>
    ),

    star: (
        <svg width="40" height="40">
            <polygon
                points="20,4 25,16 38,16 27,24 32,36 20,28 8,36 13,24 2,16 15,16"
                stroke="black"
                fill="none"
                strokeWidth="2"
            />
        </svg>
    ),

    stick: (
        <svg width="40" height="40">
            <rect x="16" y="4" width="8" height="32" stroke="black" fill="none" strokeWidth="2" />
        </svg>
    ),

    line: (
        <svg width="40" height="40">
            <line x1="4" y1="20" x2="36" y2="20" stroke="black" strokeWidth="2" />
        </svg>
    ),

    arrow: (
        <svg width="40" height="40">
            <line x1="4" y1="20" x2="30" y2="20" stroke="black" strokeWidth="2"/>
            <polygon points="30,14 38,20 30,26" fill="black"/>
        </svg>
    ),

    dblarrow: (
        <svg width="40" height="40">
            <polygon points="4,20 12,14 12,26" fill="black"/>
            <line x1="12" y1="20" x2="28" y2="20" stroke="black" strokeWidth="2"/>
            <polygon points="28,14 36,20 28,26" fill="black"/>
        </svg>
    ),

    parallelogram: (
        <svg width="40" height="40" viewBox="0 0 40 40">
            <polygon points="8,8 34,8 26,32 0,32" stroke="black" fill="none" strokeWidth="2"/>
        </svg>
    ),

    roundedRect: (
        <svg width="40" height="40" viewBox="0 0 40 40">
            <rect x="6" y="10" width="28" height="20" rx="4" ry="4" stroke="black" fill="none" strokeWidth="2"/>
        </svg>
    ),

    capsule: (
        <svg width="40" height="40" viewBox="0 0 40 40">
            <rect x="6" y="14" width="28" height="12" rx="6" ry="6" stroke="black" fill="none" strokeWidth="2"/>
        </svg>
    ),

    pentagon: (
        <svg width="40" height="40" viewBox="0 0 40 40">
            <polygon points="20,6 34,15 28,32 12,32 6,15" stroke="black" fill="none" strokeWidth="2"/>
        </svg>
    ),

    cloud: (
        <svg width="40" height="40" viewBox="0 0 40 40">
            <path
                d="M8 24 C6 18 12 14 16 16 C18 10 26 10 30 14 C36 14 36 20 32 22 C28 26 12 26 8 24 Z"
                stroke="black"
                fill="none"
                strokeWidth="2"
            />
        </svg>
    ),

    speech: (
        <svg width="40" height="40" viewBox="0 0 40 40">
            <path
                d="M6 10 Q20 2 34 10 Q36 18 30 24 L24 24 L20 30 L18 24 L10 24 Q4 18 6 10 Z"
                stroke="black"
                fill="none"
                strokeWidth="2"
            />
        </svg>
    ),

    chevron: (
        <svg width="40" height="40" viewBox="0 0 40 40">
            <polyline
                points="6,28 20,12 34,28"
                fill="none"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    table3x3: (
        <svg width="40" height="40" viewBox="0 0 40 40">
            <rect x="4" y="4" width="32" height="32" stroke="black" fill="none" strokeWidth="2"/>

            <line x1="14" y1="4" x2="14" y2="36" stroke="black" strokeWidth="2"/>
            <line x1="26" y1="4" x2="26" y2="36" stroke="black" strokeWidth="2"/>

            <line x1="4" y1="14" x2="36" y2="14" stroke="black" strokeWidth="2"/>
            <line x1="4" y1="26" x2="36" y2="26" stroke="black" strokeWidth="2"/>
        </svg>
    ),

    pyramid: (
        <svg width="40" height="40" viewBox="0 0 40 40">
            <polygon points="4,4 36,4 20,36" stroke="black" fill="none" strokeWidth="2" />

            <line x1="8" y1="12" x2="32" y2="12" stroke="black" strokeWidth="2" />
            <line x1="12" y1="20" x2="28" y2="20" stroke="black" strokeWidth="2" />
            <line x1="16" y1="28" x2="24" y2="28" stroke="black" strokeWidth="2" />
        </svg>
    ),
    circleArrow: (
        <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="14" stroke="black" fill="none" strokeWidth="2"/>
            <line x1="20" y1="6" x2="20" y2="0" stroke="black" strokeWidth="2"/>
            <polygon points="18,2 22,2 20,0" fill="black"/>
        </svg>
    ),

    table3x3LeftMerge: (
        <svg width="40" height="40" viewBox="0 0 40 40">
            <rect x="4" y="4" width="32" height="32" stroke="black" fill="none" strokeWidth="2"/>
            <line x1="14" y1="4" x2="14" y2="36" stroke="black" strokeWidth="2"/>
            <line x1="26" y1="4" x2="26" y2="36" stroke="black" strokeWidth="2"/>
            <line x1="14" y1="16" x2="36" y2="16" stroke="black" strokeWidth="2"/>
            <line x1="14" y1="28" x2="36" y2="28" stroke="black" strokeWidth="2"/>
        </svg>
    ),
};
