import moment from "moment";
import React from "react";
import {MessageInterface} from "@/app/lib/interfaces";
import {Timestamp} from "@firebase/firestore";

interface MessageCardInterface {
    displayName: string,
    photoURL: string,
    text: string,
    timestamp: Timestamp
}

export default function MessageCard({photoURL, text, displayName, timestamp}: MessageCardInterface) {
    return (
        <li className="flex my-2 hover:bg-hover-d">
            <img src={photoURL}  alt={displayName} className="max-w-10 max-h-10 rounded-full mx-4"/>
            <div className="flex flex-col grow">
                <span className="inline-block">
                    <span className="mr-1">{displayName}</span>
                    <span className="text-tertiary-text text-xs">{moment(timestamp?.toDate()).format("DD/MM/YYYY LT")}</span>
                </span>
                {text}
            </div>
        </li>
    )
}