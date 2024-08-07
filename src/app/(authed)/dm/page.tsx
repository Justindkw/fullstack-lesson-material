'use client'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore, storage} from "@/app/firebase/config";
import React, {useState} from "react";
import {addDoc, collection, doc, orderBy} from "@firebase/firestore";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import MessageCard from "@/app/components/MessageCard";
import {MessageInterface} from "@/app/lib/interfaces";
import {serverTimestamp, query} from "@firebase/firestore";
import {useSearchParams} from "next/navigation";
import {useUploadFile} from "react-firebase-hooks/storage";
import {getDownloadURL, ref} from "@firebase/storage";

export default function DM() {
    const [user] = useAuthState(auth);
    const searchParams = useSearchParams();
    const [friendData] = useDocumentData(doc(firestore, "users", searchParams.get("id")!));
    const [text, setText] = useState("");
    const [file, setFile] = useState<File | undefined>(undefined);
    const dmId = [searchParams.get("id"), user?.uid].toSorted().join("-");
    const [messages] = useCollectionData(query(collection(firestore, "dm", dmId, "messages"), orderBy("timestamp", "desc")), {snapshotOptions: {serverTimestamps: "estimate"}});
    const [uploadFile] = useUploadFile();

    const sendMessage = async (event: React.FormEvent) => {
        event.preventDefault();
        setText("");
        const doc = {
            text,
            timestamp: serverTimestamp()
        } as MessageInterface;

        if (file) {
            const type = file.type.includes("image") ? "image" : "file";
            const path = `${type}/${dmId}/${file.name}`
            await uploadFile(ref(storage, path), file);
            setFile(undefined);
            const url = await getDownloadURL(ref(storage, path));
            doc.file = {url, type, name: file.name, size: file.size}
        }

        await addDoc(collection(firestore, "dm", dmId, "messages"), doc);
    }
    return (
        <section className="h-screen flex flex-col w-full">
            <header className="border-tertiary border-b h-10 min-h-10 flex items-center justify-between px-5">
              <span className="flex">
                  <img src={friendData?.photoURL} alt={friendData?.displayName!} className="h-6 w-6 rounded-full mr-3 my-auto"/>
                  <p>{friendData?.displayName}</p>
              </span>
            </header>
            <ol className="flex flex-col-reverse flex-grow overflow-y-auto">
                {messages?.map((data, i) => {
                    const {text, timestamp, file} = data as MessageInterface;
                    const {displayName, photoURL} = user!;
                    return (
                        <MessageCard key={i} text={text} displayName={displayName!} photoURL={photoURL!}
                                     timestamp={timestamp} file={file}/>
                    )
                })}
            </ol>
            <div className="flex flex-col bg-main-text-box rounded-xl mx-4 mb-4">
                {file && <FileBox file={file} delFile={() => setFile(undefined)}/>}
                <form onSubmit={sendMessage} className="flex p-2">
                    <label htmlFor="fileButton" className="mr-2 group hover:cursor-pointer">
                        <img src="/icons/upload.png" alt="upload" className="w-6 h-6 group-hover:brightness-125"/>
                    </label>
                    <input type="file" className="invisible w-0" id="fileButton" onChange={(e) => setFile(e.target.files?.[0])}/>
                    <input type="text" className="appearance-none outline-none bg-main-text-box flex grow" name="text"
                           autoComplete="off" value={text} onChange={(e) => setText(e.target.value)}/>
                    <input type="submit" className="invisible w-0"/>
                </form>
            </div>
        </section>
    );
}

function FileBox({file, delFile}: { file: File, delFile: () => void }) {
    return (
        <>
            <div className="w-72 h-72 rounded-xl m-4 bg-primary flex flex-col justify-center items-center relative">
                <button className="group" onClick={delFile}>
                    <img src="/icons/bin.png" alt="bin"
                         className="w-6 h-6 absolute top-0 right-0 -m-2 group-hover:scale-110"/>
                </button>
                {
                    file.type.includes("image") ?
                        <img src={URL.createObjectURL(file)} alt={file.name}
                             className="object-contain rounded-xl w-60 h-60 m-2 bg-line"/> :
                        <img src="/icons/file.png" alt={file.name}
                             className="object-contain rounded-xl w-24 h-24 m-20 bg-line"/>
                }
                <p>{file.name}</p>
            </div>
            <hr className="text-line rounded-full mx-2"/>
        </>
    );
}
