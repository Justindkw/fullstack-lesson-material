import {auth, firestore} from "@/app/firebase/config";
import {useAuthState} from "react-firebase-hooks/auth";
import {useDocumentData, useDocumentDataOnce} from "react-firebase-hooks/firestore";
import {arrayRemove, doc, updateDoc} from "@firebase/firestore";
import {UserInterface} from "@/app/lib/interfaces";
import Button from "@/app/components/Button";
import {signOut} from "firebase/auth";
import React from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";

export default function SideBar() {
    const [user] = useAuthState(auth);
    const [userData] = useDocumentData(doc(firestore, "users", user?.uid!));
    const searchParams = useSearchParams();
    const router = useRouter();
    return (
        <section className="min-w-60 max-w-80 h-screen bg-secondary justify-between flex flex-col">
            <div>
                <header className="border-tertiary border-b h-10 min-h-10">
                    <Link
                        className={"flex items-center justify-center p-2 hover:bg-hover-l active:bg-active-l text-tertiary-text hover:text-secondary-text active:text-white " + (searchParams.has("id") ? "" : "bg-active-l text-white")}
                        href="/"
                    >
                        <img src="/icons/invite.png" alt="invite" className="w-6 h-6 mr-3"/>
                        <p>Invites</p>
                    </Link>
                </header>
                {(userData as UserInterface)?.friends?.map((fid) => {

                    return (
                        <FriendCard key={fid} fid={fid} uid={user?.uid!} isActive={searchParams.get("id") == fid}/>
                    )
                })}
            </div>
            <Button text="Log out" style="px-4 py-1 m-4" onClick={() => {
                router.push("/login");
                signOut(auth);
            }}/>
        </section>
    )
}

export function FriendCard({fid, uid, isActive}: { fid: string, uid: string, isActive: boolean, }) {
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
            href={`/dm?id=${fid}`}
        >
            <article className="flex items-center">
                <img src={friendData?.photoURL} alt={friendData?.displayName} className="max-w-9 max-h-9 rounded-full mr-3 my-auto"/>
                <p>{friendData?.displayName}</p>
            </article>
            <img src="/icons/cancel.png" alt="remove friend" className="invisible group-hover:visible w-5 h-5 hover:brightness-125" onClick={() => removeFriend(uid, friendData?.uid)}/>
        </Link>
    )
}