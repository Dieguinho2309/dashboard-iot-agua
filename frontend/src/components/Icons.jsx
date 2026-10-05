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

export function ChartIcon(props) {
    return (
        <Svg {...props}>
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="M8 15.5l3.2-4 2.8 2.4L20 7" />
            <path d="M20 7h-3.6" />
            <path d="M20 7v3.6" />
        </Svg>
    );
}

export function RecordsIcon(props) {
    return (
        <Svg {...props}>
            <path d="M8 4h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            <path d="M10 2.5h4v3h-4z" />
            <path d="M9.5 11h5" />
            <path d="M9.5 15h3.5" />
        </Svg>
    );
}

export function BellIcon(props) {
    return (
        <Svg {...props}>
            <path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5Z" />
            <path d="M13.7 19a2 2 0 0 1-3.4 0" />
        </Svg>
    );
}

export function SettingsIcon(props) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 8.9 19.3a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.7 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9.1a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.56 1Z" />
        </Svg>
    );
}

export function DropletIcon(props) {
    return (
        <Svg {...props}>
            <path d="M12 2.8s6.3 6.4 6.3 10.4a6.3 6.3 0 0 1-12.6 0C5.7 9.2 12 2.8 12 2.8Z" />
            <path d="M9.2 14.6a2.9 2.9 0 0 0 2.9 2.6" />
        </Svg>
    );
}

export function ThermometerIcon(props) {
    return (
        <Svg {...props}>
            <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4.5 4.5 0 1 0 4 0Z" />
            <path d="M12 9.5v6.6" />
        </Svg>
    );
}

export function BoltIcon(props) {
    return (
        <Svg {...props}>
            <path d="M13.4 2.5 4.8 13.2a.6.6 0 0 0 .48.98h4.6l-1.1 7.32 8.6-10.7a.6.6 0 0 0-.48-.98h-4.6Z" />
        </Svg>
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

export function MapPinIcon(props) {
    return (
        <Svg {...props}>
            <path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
            <circle cx="12" cy="10.2" r="2.7" />
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

export function CpuIcon(props) {
    return (
        <Svg {...props}>
            <rect x="6.5" y="6.5" width="11" height="11" rx="2.4" />
            <rect x="10" y="10" width="4" height="4" rx="1" />
            <path d="M10 3v3.5M14 3v3.5M10 17.5V21M14 17.5V21M3 10h3.5M3 14h3.5M17.5 10H21M17.5 14H21" />
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

export function ClockIcon(props) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.4V12l3 1.8" />
        </Svg>
    );
}

export function ArrowUpRightIcon(props) {
    return (
        <Svg {...props}>
            <path d="M7.5 16.5 16.5 7.5" />
            <path d="M9.5 7.5h7v7" />
        </Svg>
    );
}

export function ArrowDownRightIcon(props) {
    return (
        <Svg {...props}>
            <path d="M7.5 7.5 16.5 16.5" />
            <path d="M9.5 16.5h7v-7" />
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

export function RefreshIcon(props) {
    return (
        <Svg {...props}>
            <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
            <path d="M20.9 4.2v4.6h-4.6" />
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

export function CloseIcon(props) {
    return (
        <Svg {...props}>
            <path d="m6 6 12 12M18 6 6 18" />
        </Svg>
    );
}

export function SearchIcon(props) {
    return (
        <Svg {...props}>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
        </Svg>
    );
}

export function SparkIcon(props) {
    return (
        <Svg {...props}>
            <path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21" />
            <path d="m6 6 2.4 2.4M15.6 15.6 18 18M18 6l-2.4 2.4M8.4 15.6 6 18" />
            <circle cx="12" cy="12" r="2.6" />
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
