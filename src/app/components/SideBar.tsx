'use client'
import Button from "@/app/components/Button";
import { signOut } from "firebase/auth";
import {auth, firestore} from "@/app/firebase/config";
import {useRouter, useSearchParams} from "next/navigation";
import {useAuthState} from "react-firebase-hooks/auth";
import Link from "next/link";
import {arrayRemove, doc, updateDoc} from "@firebase/firestore";
import {useDocumentData} from "react-firebase-hooks/firestore";


export default function Sidebar() {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const uid = user?.uid ?? "";
    const [userData] = useDocumentData(doc(firestore, "users", uid));
    const searchParams = useSearchParams();
    return (
        <aside className="flex flex-col bg-secondary w-80 min-h-screen p-4 justify-between">
            <div className="flex flex-col gap-1">
                <Link
                    className={"flex items-center rounded p-2 hover:bg-hover-l active:bg-active-l text-tertiary-text hover:text-secondary-text active:text-white " + (searchParams.has("id") ? "" : "bg-active-l text-white")}
                    href="/"
                >
                    <img src="/icons/invite.png" alt="invite" className="w-8 h-8 mr-3"/>
                    <p>Invites</p>
                </Link>
                <h4 className="text-xs font-mono text-tertiary-text">DIRECT MESSAGES</h4>
                <div className="flex flex-col gap-2">
                    {userData?.friends?.map((fid: string) => {
                        return <FriendCard key={fid} fid={fid} uid={uid} isActive={searchParams.get("id") == userData.uid}/>
                    })}
                </div>
            </div>
            <Button text="Log out" style="px-4 py-1 mb-4" onClick={() => {
                router.push("/")
                signOut(auth)
            }}/>
        </aside>
    )
}

export function FriendCard({fid, uid, isActive}: { fid: string, uid:string, isActive: boolean }) {
    const router = useRouter();
    const [friendData] = useDocumentData(doc(firestore, "users", fid));
    const removeFriend = async (uid: string, fid: string) => {
        await updateDoc(doc(firestore, "users", uid), {friends: arrayRemove(fid)});
        await updateDoc(doc(firestore, "users", fid), {friends: arrayRemove(uid)});
        router.push("/");
    }
    return (
        <Link
            className={"group flex justify-between items-center text-left rounded p-2 hover:bg-hover-l active:bg-active-l text-tertiary-text hover:text-secondary-text active:text-white " + (isActive ? "bg-active-l text-white" : "")}
            href={`/dm?id=${friendData?.uid}`}
        >
            <article className="flex items-center">
                <img src={friendData?.photoURL} alt={friendData?.displayName} className="max-w-9 max-h-9 rounded-full mr-3 my-auto"/>
                <p>{friendData?.displayName}</p>
            </article>
            <img src="/icons/cancel.png" alt="remove friend" className="invisible group-hover:visible w-5 h-5 hover:scale-110" onClick={() => removeFriend(uid, friendData?.uid)}/>
        </Link>
    )
}