'use client'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "@/app/firebase/config";
import React, {useState} from "react";
import {addDoc, collection, orderBy} from "@firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";
import MessageCard from "@/app/components/MessageCard";
import {MessageInterface} from "@/app/lib/interfaces";
import {serverTimestamp, query} from "@firebase/firestore";

export default function GlobalChatSpace() {
    const [user] = useAuthState(auth);
    const [text, setText] = useState("");
    const [messages] = useCollectionData(query(collection(firestore, "messages"), orderBy("timestamp", "desc")));
    const sendMessage = async (event: React.FormEvent) => {
        event.preventDefault();
        setText("");
        const doc = {text, timestamp: serverTimestamp()} as MessageInterface;
        await addDoc(collection(firestore, "messages"), doc);
    }
  return (
      <section className="h-screen flex grow flex-col">
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
                  <input type="text" className="appearance-none outline-none bg-main-text-box flex grow" name="text" placeholder="Message everyone"
                         autoComplete="off" value={text} onChange={(e) => setText(e.target.value)}/>
                  <input type="submit" className="invisible w-0"/>
              </form>
          </div>
      </section>
  );
}
