'use client'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "@/app/firebase/config";
import React, {useState} from "react";
import { signOut } from "firebase/auth";
import {useRouter} from "next/navigation";
import Button from "@/app/components/Button";
import {addDoc, collection} from "@firebase/firestore";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";

export default function Home() {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const [text, setText] = useState("");
    const [messages] = useCollectionData(collection(firestore, "messages"));
    const sendMessage = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("sent message");
        setText("");
        await addDoc(collection(firestore, "messages"), {text})
    }
  return (
    <main className="flex  min-h-screen flex-col items-center justify-between p-24">
        Hello user {user?.displayName}

        <Button text="Log out" style="px-4 py-1 m-4" onClick={() => {
            router.push("/login");
            signOut(auth);
        }}/>
        {messages?.map((data) => {
            const {text} = data as {text: string};
            return (
                <p>
                    {text}
                </p>
            )
        })}
        <form onSubmit={sendMessage}>
            <input className="bg-secondary" value={text} onChange={(e) => setText(e.target.value)}/>
            <input type="submit" value="send" />
        </form>
    </main>
  );
}
