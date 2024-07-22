'use client'
import React, {useState} from "react";
import {auth, firestore} from "@/app/firebase/config";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {User} from "@firebase/auth-types";
import {
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where
} from "@firebase/firestore";
import Button from "@/app/components/Button";
import InviteCard from "@/app/components/InviteCard";
import {useAuthState} from "react-firebase-hooks/auth";
import {InviteInterface, UserInterface} from "@/app/lib/interfaces";

export default function Home() {
    const [user] = useAuthState(auth);
    const uid = user?.uid ?? "";
    const [inviteEmail, setInviteEmail] = useState('');
    const [invitesSent] = useCollectionData(
        query(collection(firestore, "invites"), where("inviterUid", "==", uid))
    )
    const [invitesReceived] = useCollectionData(
        query(collection(firestore, "invites"), where("inviteeUid", "==", uid))
    )
    const sendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inviteEmail.length == 0) {
            return
        }
        setInviteEmail("");
        const userQuery = query(collection(firestore, "users"), where("email", "==", inviteEmail))
        const snapshot = await getDocs(userQuery);
        if (snapshot.docs.length == 0) {
            console.log("na man")
            //todo: get the valid/invalid done
            return
        }
        const {uid: inviteeUid, email: inviteeEmail, displayName: inviteeName, photoURL: inviteePhotoURL} = snapshot.docs[0].data() as unknown as UserInterface
        const {uid: inviterUid, email: inviterEmail, displayName: inviterName,photoURL: inviterPhotoURL } = user as User
        const inviteDoc = {
            inviterUid,
            inviterName,
            inviterEmail,
            inviterPhotoURL,
            inviteeUid,
            inviteeName,
            inviteePhotoURL,
            inviteeEmail,
        } as InviteInterface;
        await setDoc(doc(firestore, "invites", `${uid}-${inviteeUid}`), inviteDoc);
    }
    const deleteInvite = async (inviterUid: string, inviteeUid: string) => {
        await deleteDoc(doc(firestore, "invites", `${inviterUid}-${inviteeUid}`));
    }
    const acceptInvite = async (inviterUid: string, inviteeUid: string) => {
        await Promise.all([
            updateDoc(doc(firestore, "users", inviterUid), {friends: arrayUnion(inviteeUid)}),
            updateDoc(doc(firestore, "users", inviteeUid), {friends: arrayUnion(inviterUid)}),
            deleteDoc(doc(firestore, "invites", `${inviterUid}-${inviteeUid}`))
        ])
    }
    return (
        <div className="min-h-screen flex flex-col flex-grow p-4 gap-2">
        <article className="flex flex-col gap-2 mb-2">
        <h2 className="font-semibold">ADD FRIEND</h2>
    <p className="text-tertiary-text text-sm">You can add friends with their account email.</p>
    <section>
    <form onSubmit={sendInvite} className="flex bg-tertiary rounded-lg">
    <input
        type="text"
    className="outline-none bg-tertiary flex flex-grow rounded m-2 ml-4"
    value={inviteEmail}
    onChange={(e) => setInviteEmail(e.target.value)}
    placeholder="You can add friends with their account email."
        />
        <Button submit text="Send Friend Request" style="m-2 text-sm font-semibold"/>
        </form>
        </section>
        </article>
        <hr className="text-active-l rounded-full"/>
    <article>
        <h2 className="font-semibold">INCOMING INVITES</h2>
    {invitesReceived?.map((invites) => {
        const {inviterName, inviterPhotoURL, inviterEmail, inviterUid, inviteeUid} = invites as InviteInterface;
        return <InviteCard key={inviterUid} username={inviterName} email={inviterEmail} photoURL={inviterPhotoURL} onCancel={() => deleteInvite(inviterUid, inviteeUid)} onAccept={() => acceptInvite(inviterUid, inviteeUid)}/>
    })}
    </article>
    <hr className="text-active-l rounded-full"/>
    <article>
        <h2 className="font-semibold">OUTGOING INVITES</h2>
    {invitesSent?.map((invites) => {
        const {inviteeName, inviteePhotoURL, inviteeEmail,  inviterUid, inviteeUid} = invites as InviteInterface;
        return <InviteCard key={inviteeUid} username={inviteeName} email={inviteeEmail} photoURL={inviteePhotoURL} onCancel={() => deleteInvite(inviterUid, inviteeUid)} />
    })}
    </article>
    </div>
);
}
