interface InviteCard {
    username: string,
    email: string,
    photoURL: string,
    onCancel: () => void,
    onAccept?: () => void,
}
export default function InviteCard({username, email, photoURL, onCancel, onAccept}:InviteCard) {
    return (
        <li className="flex my-2 justify-between">
            <section className="flex items-center">
                <img src={photoURL} alt={username} className="max-w-9 max-h-9 rounded-full mr-3"/>
                <div>
                    <p>{username}</p>
                    <p className="text-tertiary-text text-xs">{email}</p>
                </div>
            </section>
            <div className="flex gap-2">
                {onAccept && <button className="group w-10 bg-secondary rounded-full" onClick={onAccept}>
                        <img src="/icons/add.png" alt="add" className="w-6 m-auto group-hover:brightness-125"/>
                    </button>
                }
                <button className="group w-10 bg-secondary rounded-full" onClick={onCancel}>
                    <img src="/icons/cancel.png" alt="cancel" className="w-5 m-auto group-hover:brightness-125"/>
                </button>
            </div>
        </li>
    )
}