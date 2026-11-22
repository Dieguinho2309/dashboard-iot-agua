export default function Panel({ as: Tag = "div", className = "", children, ...props }) {
    return (
        <Tag className={`rounded-lg border border-slate-800 bg-slate-900/40 p-4 ${className}`} {...props}>
            {children}
        </Tag>
    );
}
