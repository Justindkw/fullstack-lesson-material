'use client'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "@/app/firebase/config";
import React, {useState} from "react";
import { signOut } from "firebase/auth";
import {useRouter} from "next/navigation";
import Button from "@/app/components/Button";
import {addDoc, collection, orderBy} from "@firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";
import MessageCard from "@/app/components/MessageCard";
import {MessageInterface} from "@/app/lib/interfaces";
import {serverTimestamp, query} from "@firebase/firestore";

export default function Home() {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [text, setText] = useState("");
    const [messages] = useCollectionData(query(collection(firestore, "messages"), orderBy("timestamp", "desc")), {snapshotOptions: {serverTimestamps: "estimate"}});
    const sendMessage = async (event: React.FormEvent) => {
        event.preventDefault();
        setText("");
        const doc = {
            text,
            timestamp: serverTimestamp()
        } as MessageInterface;
        await addDoc(collection(firestore, "messages"), doc);
    }
    return (
        <section className="h-screen flex flex-col">
            <header className="border-tertiary border-b h-12 min-h-10 flex items-center justify-between px-5">
              <span className="flex">
                  <img src={user?.photoURL!} alt={user?.displayName!} className="h-6 w-6 rounded-full mr-3 my-auto"/>
                  <p>{user?.displayName}</p>
              </span>

                <Button text="Log out" style="px-4 py-1 m-4 w-max" onClick={() => {
                    router.push("/login");
                    signOut(auth);
                }}/>
            </header>
            <ol className="flex flex-col-reverse flex-grow overflow-y-auto">
                {messages?.map((data, i) => {
                    const {text, timestamp} = data as MessageInterface;
                    const {displayName, photoURL} = user!;
                    return (
                        <MessageCard key={i} text={text} displayName={displayName!} photoURL={photoURL!}
                                     timestamp={timestamp}/>
                    )
                })}
            </ol>
            <div>
                <form onSubmit={sendMessage} className="flex p-2 bg-main-text-box rounded-xl m-4">
                    <input type="text" className="appearance-none outline-none bg-main-text-box flex grow" name="text"
                           autoComplete="off" value={text} onChange={(e) => setText(e.target.value)}/>
                    <input type="submit" className="invisible w-0"/>
                </form>
            </div>
        </section>
    );
}
