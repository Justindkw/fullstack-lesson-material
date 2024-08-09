import moment from "moment";
import React, {RefObject} from "react";
import {MessageInterface} from "@/app/lib/interfaces";
import Link from "next/link";
import {prettyByteSize} from "@/app/lib/utils";

interface MessageCardInterface {
    messageData: MessageInterface,
    hasOwnership: boolean,
    delFn: () => Promise<void>,
    resendFn: (text: string) => Promise<void>,
    enableEdit: () => void,
    isEdit: boolean,
    editRef: RefObject<HTMLInputElement>,
    editMessage: string,
    setEditMessage: (message: string) => void,
}

export default function MessageCard(
    {messageData, hasOwnership, delFn, resendFn, enableEdit, isEdit, editRef, editMessage, setEditMessage}: MessageCardInterface
) {
    const {photoURL, displayName, timestamp, file, text, edited} = messageData;
    return (
        <li className="flex my-2 group relative hover:bg-hover-d">
            <img src={photoURL}  alt={displayName} className="max-w-10 max-h-10 rounded-full mx-4"/>
            <div className="flex flex-col grow">
                <span className="inline-block">
                    <span className="mr-1">{displayName}</span>
                    <span className="text-tertiary-text text-xs">{moment(timestamp.toDate()).format("DD/MM/YYYY LT")}</span>
                </span>
                {isEdit ?
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        resendFn(editMessage);
                    }}
                          className="flex p-2 bg-main-text-box rounded-xl mb-2 mr-10">
                        <input type="text" className="appearance-none outline-none bg-main-text-box grow"
                               autoComplete="off"
                               value={editMessage} onChange={(e) => setEditMessage(e.target.value)}
                               ref={editRef} name="text"/>
                        <input className="hidden" type="submit"/>
                    </form>
                    :
                    <p>
                        {text}
                        {edited && <span className="text-xs text-tertiary-text"> (edited)</span>}
                    </p>
                }


                {file && (file.type == "image" ?
                    <div className="flex mt-2">
                        <img src={file.url} alt={file.name} className="max-w-60 max-h-60 object-contain"/>
                    </div>
                    :
                    <div className="flex bg-secondary rounded-lg min-w-60 p-2 gap-2 mt-2 w-min">
                        <img src="/icons/file.png" alt="file" className="object-contain rounded-l w-10"/>
                        <div>
                            <Link
                                className="text-blurple hover:text-blurple-hover hover:underline active:text-blurple-active"
                                href={file?.url!}>{file?.name}</Link>
                            <p className="text-sm">{prettyByteSize(file?.size ?? 0)}</p>
                        </div>
                    </div>)
                }
            </div>
            { hasOwnership &&
                <div
                    className="flex sm:gap-2 gap-10 absolute -top-2 right-8 invisible group-hover:visible bg-primary p-2 border border-secondary rounded-lg">
                    <img src="/icons/edit.png" alt="edit" onClick={() => {
                        setEditMessage(text);
                        enableEdit();
                    }}
                         className="w-6 h-6 hover:brightness-125 hover:cursor-pointer"/>
                    <img src="/icons/cancel.png" alt="delete" onClick={delFn}
                         className="w-6 h-6 hover:brightness-125 hover:cursor-pointer"/>
                </div>}
        </li>
    )
}