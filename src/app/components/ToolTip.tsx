export default function ToolTip({children, tip}: Readonly<{ children: React.ReactNode, tip: string}>) {
    return (
        <div className="group flex relative">
            {children}
            <span className="group-hover:opacity-100 pointer-events-none transition-opacity bg-black px-1 text-sm rounded-md absolute left-1/2
    -translate-x-1/2 translate-y-full w-max opacity-0 p-1">{tip}</span>
        </div>
    )
}