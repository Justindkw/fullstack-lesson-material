
export default function Home() {
    return (

        <div className="flex items-center justify-center min-h-screen">
            <div className="w-80 p-12 rounded shadow-md bg-drawer">
                <h2 className="mb-4 text-4xl font-bold text-center flex justify-center items-center">Fiscord</h2>
                <button className="w-full bg-blurple hover:bg-blurple-hover active:bg-blurple-active disabled:bg-blurple-active text-white p-2 rounded">
                    Log in with Google
                </button>
            </div>
        </div>
    );
}