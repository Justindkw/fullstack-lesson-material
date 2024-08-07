import moment from "moment";
import React from "react";
import {Timestamp} from "@firebase/firestore";
import {FileInterface} from "@/app/lib/interfaces";
import Link from "next/link";
import {prettyByteSize} from "@/app/lib/utils";

interface MessageCardInterface {
    displayName: string,
    photoURL: string,
    text: string,
    timestamp: Timestamp,
    file?: FileInterface
}

export default function MessageCard({photoURL, text, displayName, timestamp, file}: MessageCardInterface) {
    return (
        <li className="flex my-2 hover:bg-hover-d">
            <img src={photoURL}  alt={displayName} className="max-w-10 max-h-10 rounded-full mx-4"/>
            <div className="flex flex-col grow">
                <span className="inline-block">
                    <span className="mr-1">{displayName}</span>
                    <span className="text-tertiary-text text-xs">{moment(timestamp.toDate()).format("DD/MM/YYYY LT")}</span>
                </span>
                {text}
                {file && (file.type == "image" ?
                    <img src={file.url} alt={"image"} className="max-w-60 max-h-60 object-contain"/> :
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
        </li>
    )
}