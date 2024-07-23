'use client'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "@/app/firebase/config";
import Button from "@/app/components/Button";
import {FormEvent, useState} from "react";
import {arrayUnion, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where} from "@firebase/firestore";
import {RequestInterface, UserInterface} from "@/app/lib/interfaces";
import {useCollectionData} from "react-firebase-hooks/firestore";

export default function Home() {
    const [user] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [incomingRequests] = useCollectionData(query(collection(firestore, "requests"), where("receiverID", "==", user?.uid!)));
    const [outGoingRequests] = useCollectionData(query(collection(firestore, "requests"), where("senderID", "==", user?.uid!)));
    const sendRequest = async (e: FormEvent) => {
        e.preventDefault()
        const userQuery = query(collection(firestore, "users"), where("email", "==", email));
        const data = await getDocs(userQuery);
        if (data.size == 0) {
            console.log("this email does not exists");
            //todo: add error text to show that the email does not exist in database
            return
        }
        const {uid: receiverID, displayName: receiverDisplayName} = data.docs[0].data() as UserInterface;
        const {uid: senderID, displayName: senderDisplayName} = user!;
        const docData = {
            senderID,
            senderDisplayName,
            receiverID,
            receiverDisplayName,
        } as RequestInterface;

        await setDoc(doc(firestore, "requests", `${senderID}-${receiverID}`), docData);
    };

    const acceptRequest = async (senderID: string, receiverID: string) => {
        await deleteDoc(doc(firestore, "requests", `${senderID}-${receiverID}`))
        await updateDoc(doc(firestore, "users", senderID), {friends: arrayUnion(receiverID)});
        await updateDoc(doc(firestore, "users", receiverID), {friends: arrayUnion(senderID)});
    }
  return (
      <section className="h-screen flex flex-col">
          <form onSubmit={(e) => sendRequest(e)}>
              <input className="bg-secondary" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button text="Add User"/>
          </form>
          <h3>INCOMING INVITES</h3>
          {incomingRequests?.map((data) => {
              const {senderDisplayName, senderID, receiverID} = data as RequestInterface;
              return (
                  <div key={senderID} className="flex">
                      <p>{senderDisplayName} Requests you as a friend</p>
                      <button className="p-2 bg-blurple" onClick={() => acceptRequest(senderID, receiverID)}>add friend</button>
                  </div>
              );
          })}
          <h3>OUTGOING INVITES</h3>
          {outGoingRequests?.map((data) => {
              const {receiverDisplayName, receiverID} = data as RequestInterface;
              return (
                  <p key={receiverID}>Request to {receiverDisplayName} sent</p>
              );
          })}
      </section>
  );
}
