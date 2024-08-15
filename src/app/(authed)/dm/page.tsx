'use client'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore, storage} from "@/app/firebase/config";
import React, {createRef, RefObject, useContext, useEffect, useRef, useState} from "react";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    limit,
    orderBy,
    SnapshotOptions,
    updateDoc
} from "@firebase/firestore";
import {useCollection, useDocumentData} from "react-firebase-hooks/firestore";
import MessageCard from "@/app/components/MessageCard";
import {MessageInterface} from "@/app/lib/interfaces";
import {serverTimestamp, query} from "@firebase/firestore";
import {useSearchParams} from "next/navigation";
import {useUploadFile} from "react-firebase-hooks/storage";
import {getDownloadURL, ref} from "@firebase/storage";
import {SidebarContext} from "@/app/lib/contexts";
import {fetchBlurImage, getImageDimension} from "@/app/lib/utils";
import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
import Link from "next/link";

export default function DM() {
    const MAX_IMG_SIZE = 240;
    const MESSAGE_LOAD_AMT = 20;
    const SCROLL_LOAD_BUFFER = 200;
    const MESSAGE_BUNCHING_TIME = 30;
    const [user] = useAuthState(auth);
    const searchParams = useSearchParams();
    const [friendData] = useDocumentData(doc(firestore, "users", searchParams.get("id")!));
    const [text, setText] = useState("");
    const [file, setFile] = useState<File | undefined>(undefined);
    const dmId = [searchParams.get("id"), user?.uid].toSorted().join("-");
    const [messageLimit, setMessageLimit] = useState(MESSAGE_LOAD_AMT);
    const [messages] = useCollection(query(collection(firestore, "dm", dmId, "messages"), orderBy("timestamp", "desc"), limit(messageLimit)));
    const [savedMessages, setSavedMessages] = useState(messages);
    const [uploadFile] = useUploadFile();
    const textBox = createRef<HTMLInputElement>();
    const [editMessageId, setEditMessageId] = useState("");
    const [editMessage, setEditMessage] = useState("");
    const editBoxes = useRef<Map<string, RefObject<HTMLInputElement>>>(new Map());
    const sideBarState = useContext(SidebarContext);
    const [zoomImage, setZoomImage] = useState("");
    const [enableZoom, setEnableZoom] = useState(false);
    const [isUploadingFile, setIsUploadingFile] = useState(false);

    useEffect(() => {
        function handleKeyDown(ev: KeyboardEvent) {
            editMessageId == "" ? textBox.current?.focus() : editBoxes?.current.get(editMessageId)?.current?.focus();
            if(editMessageId && ev.key == "Escape") {
                setEditMessageId("");
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    });

    useEffect(() => {
        setText("");
    }, [dmId]);

    useEffect(() => {
        if (messages) {
            setSavedMessages(messages);
        }
    }, [messages]);

    const sendMessage = async (event: React.FormEvent) => {
        event.preventDefault();
        setText("");

        if(!text && !file) {
            return
        }

        const {displayName, photoURL, uid} = user!;
        const doc = {
            displayName,
            photoURL,
            uid,
            text,
            timestamp: serverTimestamp(),
            edited: false
        } as MessageInterface;

        if (file) {
            setIsUploadingFile(true);
            const tile = file;
            setFile(undefined);
            const type = tile.type.includes("image") ? "image" : "file";
            const path = `${type}/${dmId}/${tile.name}`;
            await uploadFile(ref(storage, path), tile);
            const url = await getDownloadURL(ref(storage, path));
            doc.file = {url, type, name: tile.name, size: tile.size}
            if (type == "image") {
                const url = URL.createObjectURL(tile);
               const {width, height} = await getImageDimension(MAX_IMG_SIZE, url);
               const placeholder = await fetchBlurImage(url);
               doc.file = {width, height, placeholder, ...doc.file}
            }
            setIsUploadingFile(false);
        }
        await addDoc(collection(firestore, "dm", dmId, "messages"), doc);
    }

    const deleteMessage = async (mid: string) => {
        await deleteDoc(doc(firestore, "dm", dmId, "messages", mid));
    }

    const resendMessage = async (docData: DocumentData, mid: string, text: string) => {
        await updateDoc(doc(firestore, "dm", dmId, "messages", mid), {...docData, text, edited: true});
        setEditMessageId("");
    }

    const loadMoreMessage = (e: React.UIEvent) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLOListElement;
        if (scrollHeight <= clientHeight - scrollTop + SCROLL_LOAD_BUFFER && messageLimit <= messages?.size!) {
            setMessageLimit(messageLimit+MESSAGE_LOAD_AMT)
        }
    }

    return (
        <article className="h-full flex flex-col w-full">
            <header className="border-tertiary border-b h-10 min-h-10 flex items-center sm:pl-5">
                <button className="px-2 group sm:hidden" onClick={() => sideBarState.setIsOpen(true)}>
                    <img src="/icons/left-arrow.png" alt="back" className="w-6 h-6 group-hover:brightness-125"/>
                </button>
                <span className="flex">
                  <img src={friendData?.photoURL} alt={friendData?.displayName!}
                       className="h-6 w-6 rounded-full mr-3 my-auto"/>
                  <p>{friendData?.displayName}</p>
              </span>
            </header>
            <ol className="flex flex-col-reverse flex-grow overflow-y-auto" onScroll={loadMoreMessage}>
                {
                    isUploadingFile && <div className="flex mt-4">
                        <div className="bg-secondary w-10 h-10 rounded-full mx-4 animate-pulse"/>
                        <div className="flex flex-col gap-2">
                            <div className="bg-secondary w-28 h-5 rounded-full animate-pulse"/>
                            <div className="bg-secondary w-52 h-52 rounded-xl animate-pulse"/>
                        </div>
                    </div>
                }
                {savedMessages?.docs.map((res, i, messages) => {
                    const options = {serverTimestamps: 'estimate'} as SnapshotOptions;
                    const messageData = res.data(options) as MessageInterface;
                    const id = res.id;
                    const ref = createRef<HTMLInputElement>();
                    const successiveMessage = i==messages.length-1 || (messageData?.timestamp?.seconds - messages[i+1].data(options)?.timestamp?.seconds) < MESSAGE_BUNCHING_TIME;
                    const sameUser = messages[i+1]?.data(options)?.uid == messageData?.uid;
                    let hideProfile = successiveMessage && sameUser;
                    editBoxes.current.set(id, ref);
                    return <MessageCard key={id} messageData={messageData as MessageInterface} editMessage={editMessage}
                                        hasOwnership={messageData?.uid == user?.uid} delFn={() => deleteMessage(id)}
                                        enableEdit={() => setEditMessageId(editMessageId == id ? "" : id)}
                                        isEdit={editMessageId == id} editRef={ref} setEditMessage={setEditMessage}
                                        resendFn={text => resendMessage(messageData, id, text)}
                                        setZoomImage={() => {
                                            setZoomImage(messageData.file?.url ?? "");
                                            setEnableZoom(true);
                                        }}
                                        hideProfile={hideProfile}
                    />
                })}
            </ol>
            <div className="flex flex-col bg-main-text-box rounded-xl mx-4 mb-4">
                {file && <FileBox file={file} delFile={() => setFile(undefined)}/>}
                <form onSubmit={sendMessage} className="flex p-2">
                    <label htmlFor="fileButton" className="mr-2 group hover:cursor-pointer">
                        <img src="/icons/upload.png" alt="upload" className="w-6 h-6 group-hover:brightness-125"/>
                    </label>
                    <input type="file" className="hidden" id="fileButton" onChange={(e) => {
                        setFile(e.target.files?.[0]);
                        e.target.value = "";
                    }}/>
                    {isUploadingFile && <img className={"flex animate-spin w-4 h-4 mx-1 my-auto"} src="/icons/loading.svg" alt="loading"/>}
                    <input type="text" className="appearance-none outline-none bg-main-text-box flex grow disabled:placeholder:text-disabled"
                           name="text" autoComplete="off" value={text} ref={textBox} disabled={isUploadingFile}
                           onChange={(e) => setText(e.target.value)}/>
                    <input type="submit" className="hidden"/>
                </form>
            </div>
            <Dialog onClose={() => setEnableZoom(false)} open={enableZoom} transition
                    className="relative z-50 transition duration-200 ease-in-out data-[closed]:opacity-0">
                <DialogBackdrop className="fixed inset-0 bg-black/60"/>
                <div className="fixed inset-0 flex flex-col w-screen items-center justify-center p-10">
                    <DialogPanel as="div" className="max-h-full max-w-4/6">
                        <img src={zoomImage} alt="Scaled Image" className="object-scale-down max-h-full max-w-4/6"/>
                        <Link href={zoomImage!} target="_blank"
                              className="text-tertiary-text hover:text-secondary-text hover:underline active:text-white">
                            Open In Browser</Link>
                    </DialogPanel>
                </div>
            </Dialog>
        </article>
    );
}

function FileBox({file, delFile}: { file: File, delFile: () => void }) {
    return (
        <>
            <div
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-xl m-4 bg-primary flex flex-col justify-center items-center relative">
                <button className="group" onClick={delFile}>
                <img src="/icons/bin.png" alt="bin"
                         className="w-6 h-6 absolute top-0 right-0 -m-2 group-hover:scale-110"/>
                </button>
                {
                    file.type.includes("image") ?
                        <img src={URL.createObjectURL(file)} alt={file.name}
                             className="object-contain rounded-xl h-52 w-52 sm:w-60 sm:h-60 sm:m-2 bg-line"/> :
                        <img src="/icons/file.png" alt={file.name}
                             className="object-contain rounded-xl w-20 h-20 m-4 sm:w-24 sm:h-24 sm:m-20 bg-line"/>
                }
                <p>{file.name}</p>
            </div>
            <hr className="text-line rounded-full mx-2"/>
        </>
    );
}
