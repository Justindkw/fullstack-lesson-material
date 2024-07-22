
interface Button {
    text: string,
    onClick?: () => any,
    style?: string,
    loading?: boolean,
    submit?: boolean
}

export default function Button({text, onClick, style, loading, submit = false}: Button) {
    return (
        <button
            disabled={loading}
            className={"flex items-center justify-center gap-2 bg-blurple hover:bg-blurple-hover active:bg-blurple-active disabled:bg-blurple-active text-white p-2 rounded " + style}
            onClick={onClick}
            type={submit ? "submit" : "button"}
        >
            {loading && <img src="/icons/loading.svg" alt="" className="size-4 animate-spin"/>}
            {text}
        </button>
    );
}