'use client'

import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {useSearchParams} from "next/navigation";
import {useState} from "react";
import {auth, firestore} from "@/app/firebase/config";
import {useAuthState} from "react-firebase-hooks/auth";
import {addDoc, collection, doc, orderBy, query, serverTimestamp} from "@firebase/firestore";
import {MessageInterface} from "@/app/lib/interfaces";
import {User} from "@firebase/auth-types";
import MessageCard from "@/app/components/MessageCard";

export default function DirectMessages() {
    const [text, setText] = useState('');
    const searchParams = useSearchParams();
    const [user] = useAuthState(auth);
    const dmId = [searchParams.get("id"), user?.uid].toSorted().join("-");
    const msgQuery = query(collection(firestore, "dm", dmId, "messages"), orderBy("timestamp", "desc"));
    const [messages] = useCollectionData(msgQuery, {snapshotOptions: {serverTimestamps: 'estimate'}});
    const [friend] = useDocumentData(doc(firestore, "users", searchParams.get("id")!));
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (text.length == 0) {
            return
        }
        setText("");
        const { uid, photoURL, displayName } = auth.currentUser as User;
        const docData = {
            uid,
            displayName,
            photoURL,
            text,
            timestamp: serverTimestamp()
        } as MessageInterface;
        await addDoc(collection(firestore, "dm", dmId, "messages"), docData);
    }
    return (
        <article className="h-screen flex flex-col flex-grow">
            <header className="border-tertiary border-b h-10 min-h-10 flex items-center pl-10 sm:pl-5">
                <img src={friend?.photoURL} alt={friend?.displayName} className="h-6 w-6 rounded-full mr-3 my-auto"/>
                <p>{friend?.displayName}</p>
            </header>
            <section className="flex flex-col-reverse flex-grow overflow-y-scroll">
                {messages?.map((message, i) => {
                    const {displayName, photoURL, text, timestamp} = message as MessageInterface;
                    return <MessageCard key={i} displayName={displayName} text={text} photoURL={photoURL}
                                        timestamp={timestamp}/>
                })}
            </section>
            <section>
                <form onSubmit={sendMessage} className="flex">
                    <input type="text"
                           className="appearance-none outline-none bg-main-text-box flex flex-grow rounded p-2 mx-4 mb-4"
                           value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message ${friend?.displayName}`}/>
                    <button className="invisible" type="submit"/>
                </form>
            </section>
        </article>
    )
}