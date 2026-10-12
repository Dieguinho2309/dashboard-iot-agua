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

export function DropletIcon(props) {
    return (
        <Svg {...props}>
            <path d="M12 2.7c-.4 2.4-1.9 4.7-3.9 6.3C6.1 10.6 5 12.7 5 15a7 7 0 0 0 14 0c0-2.3-1.1-4.4-3.1-6-2-1.6-3.5-3.9-3.9-6.3Z" />
        </Svg>
    );
}

export function ThermometerIcon(props) {
    return (
        <Svg {...props}>
            <path d="M14 4a2 2 0 0 0-4 0v10.5a4 4 0 1 0 4 0Z" />
            <path d="M12 9v6" />
        </Svg>
    );
}

export function BoltIcon(props) {
    return (
        <Svg {...props}>
            <path d="M13 2 3.5 13.5H11l-1 8.5 9.5-11.5H12l1-8.5Z" />
        </Svg>
    );
}

export function GithubIcon(props) {
    return (
        <Svg fill="currentColor" stroke="none" {...props}>
            <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
        </Svg>
    );
}