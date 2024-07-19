
interface Button {
    text: string,
    onClick?: () => any,
    style?: string,
    loading?: boolean,
    submit?: boolean
}

export default function Button({text, onClick, style = "", loading = false, submit=false} : Button) {
    return (
        <button
            className={"bg-blurple hover:bg-blurple-hover active:bg-blurple-active disabled:bg-blurple-active text-white p-2 rounded " + style}
            onClick={onClick} disabled={loading} type={submit ? "submit" : "button"}
        >
            <span className="flex align-top justify-center gap-1 text-white">
                {loading && <img className={"flex animate-spin w-4 h-4 my-auto"} src="/icons/loading.svg" alt="loading"/>}
                {text}
            </span>

        </button>
    )
}