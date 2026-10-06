function Svg({ className = "h-5 w-5", strokeWidth = 1.7, children, ...rest }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
            {...rest}
        >
            {children}
        </svg>
    );
}

export function WavesIcon(props) {
    return (
        <Svg {...props}>
            <path d="M2.5 8.5c1.6 0 1.6 1.6 3.2 1.6s1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6 1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6 1.6-1.6 3-1.6" />
            <path d="M2.5 14c1.6 0 1.6 1.6 3.2 1.6S7.3 14 8.9 14s1.6 1.6 3.2 1.6 1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6 1.6-1.6 3-1.6" />
        </Svg>
    );
}

export function LayoutIcon(props) {
    return (
        <Svg {...props}>
            <rect x="3" y="3" width="7.5" height="8.5" rx="2" />
            <rect x="13.5" y="3" width="7.5" height="5.5" rx="2" />
            <rect x="3" y="15" width="7.5" height="6" rx="2" />
            <rect x="13.5" y="12" width="7.5" height="9" rx="2" />
        </Svg>
    );
}

export function CloseIcon(props) {
    return (
        <Svg {...props}>
            <path d="m6 6 12 12M18 6 6 18" />
        </Svg>
    );
}

export function CpuIcon(props) {
    return (
        <Svg {...props}>
            <rect x="6.5" y="6.5" width="11" height="11" rx="2.4" />
            <rect x="10" y="10" width="4" height="4" rx="1" />
            <path d="M10 3v3.5M14 3v3.5M10 17.5V21M14 17.5V21M3 10h3.5M3 14h3.5M17.5 10H21M17.5 14H21" />
        </Svg>
    );
}

export function WifiIcon(props) {
    return (
        <Svg {...props}>
            <path d="M2.8 9.2a13.6 13.6 0 0 1 18.4 0" />
            <path d="M6.1 12.9a8.7 8.7 0 0 1 11.8 0" />
            <path d="M9.4 16.6a3.9 3.9 0 0 1 5.2 0" />
            <path d="M12 20.2h.01" />
        </Svg>
    );
}

export function MenuIcon(props) {
    return (
        <Svg {...props}>
            <path d="M4 7h16M4 12h16M4 17h16" />
        </Svg>
    );
}

export function ActivityIcon(props) {
    return (
        <Svg {...props}>
            <path d="M3 12h3.5l2.2-6.5 4 13 2.4-6.5H21" />
        </Svg>
    );
}

export function ShieldIcon(props) {
    return (
        <Svg {...props}>
            <path d="M12 2.8 4.6 5.6v6.1c0 4.4 3 8.1 7.4 9.5 4.4-1.4 7.4-5.1 7.4-9.5V5.6Z" />
            <path d="m9.2 12 2 2 3.6-3.8" />
        </Svg>
    );
}

export function ClockIcon(props) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.4V12l3 1.8" />
        </Svg>
    );
}

export function GraduationIcon(props) {
    return (
        <Svg {...props}>
            <path d="M12 3.5 22 8l-10 4.5L2 8Z" />
            <path d="M6.5 10.2v4.6c0 1.7 2.5 3.2 5.5 3.2s5.5-1.5 5.5-3.2v-4.6" />
        </Svg>
    );
}
