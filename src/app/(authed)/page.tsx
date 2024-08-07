'use client'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "@/app/firebase/config";
import Button from "@/app/components/Button";
import {FormEvent, useState} from "react";
import {arrayUnion, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where} from "@firebase/firestore";
import {RequestInterface, UserInterface} from "@/app/lib/interfaces";
import {useCollectionData} from "react-firebase-hooks/firestore";
import InviteCard from "@/app/components/InviteCard";

export default function Home() {
    const [user] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [incomingRequests] = useCollectionData(query(collection(firestore, "requests"), where("receiverID", "==", user?.uid!)));
    const [isError, setIsError] = useState(false);
    const [outGoingRequests] = useCollectionData(query(collection(firestore, "requests"), where("senderID", "==", user?.uid!)));
    const sendRequest = async (e: FormEvent) => {
        e.preventDefault();
        setIsError(false);
        const userQuery = query(collection(firestore, "users"), where("email", "==", email));
        const data = await getDocs(userQuery);
        if (data.size == 0) {
            setIsError(true);
            return
        }
        const {uid: receiverID, displayName: receiverName, photoURL: receiverPhotoURL, email: receiverEmail} = data.docs[0].data() as UserInterface;
        const {uid: senderID, displayName: senderName, photoURL: senderPhotoURL, email: senderEmail} = user!;
        const docData = {
            senderID,
            senderName,
            senderPhotoURL,
            senderEmail,
            receiverID,
            receiverName,
            receiverPhotoURL,
            receiverEmail

        } as RequestInterface;

        await setDoc(doc(firestore, "requests", `${senderID}-${receiverID}`), docData);
    };
    const deleteRequest = async (inviterUid: string, inviteeUid: string) => {
        await deleteDoc(doc(firestore, "invites", `${inviterUid}-${inviteeUid}`))
    }

    const acceptRequest = async (senderID: string, receiverID: string) => {
        await deleteDoc(doc(firestore, "requests", `${senderID}-${receiverID}`))
        await updateDoc(doc(firestore, "users", senderID), {friends: arrayUnion(receiverID)});
        await updateDoc(doc(firestore, "users", receiverID), {friends: arrayUnion(senderID)});
    }
  return (
      <div className="min-h-screen flex flex-col grow p-4 gap-2 mt-4 sm:mt-0">
          <article className="flex flex-col gap-2 mb-2">
              <h2 className="font-semibold mx-auto sm:mx-0">ADD FRIEND</h2>
              <p className="text-tertiary-text text-sm mx-auto sm:mx-0">You can add friends with their account
                  email.</p>
              <form onSubmit={sendRequest} className="flex flex-col sm:flex-row sm:bg-tertiary rounded-lg">
                  <input
                      type="email"
                      className="outline-none bg-tertiary flex grow rounded m-2 p-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="You can add friends with their account email."
                  />
                  <Button text="Send Friend Request" style="m-2 text-sm font-semibold"/>
              </form>
              <p className={"text-sm text-warning text-center sm:text-start " + (isError ? "" : "invisible h-0")}>The
                  email is invalid or user is not registered</p>
          </article>
          <hr className="text-active-l rounded-full"/>
          <h2 className="font-semibold">INCOMING INVITES</h2>
          <ul>
              {incomingRequests?.map((invites) => {
                  const {
                      senderName,
                      senderPhotoURL,
                      senderEmail,
                      receiverID,
                      senderID
                  } = invites as RequestInterface;
                  return <InviteCard key={senderID} username={senderName} email={senderEmail}
                                     photoURL={senderPhotoURL} onCancel={() => deleteRequest(senderID, receiverID)}
                  onAccept={() => acceptRequest(senderID, receiverID)}/>
              })}
          </ul>
          <hr className="text-active-l rounded-full"/>
          <h2 className="font-semibold">OUTGOING INVITES</h2>
          <ul>
              {outGoingRequests?.map((invites) => {
                  const {
                      receiverName,
                      receiverPhotoURL,
                      receiverEmail,
                      receiverID,
                      senderID
                  } = invites as RequestInterface;
                  return <InviteCard key={receiverID} username={receiverName} email={receiverEmail}
                                     photoURL={receiverPhotoURL} onCancel={() => deleteRequest(senderID, receiverID)}/>
              })}
          </ul>
      </div>
)
    ;
}
