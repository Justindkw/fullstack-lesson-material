import {Timestamp} from "@firebase/firestore";

export interface MessageInterface {
    uid: string,
    displayName: string,
    photoURL: string,
    text: string,
    timestamp: Timestamp,
    file?: FileInterface,
    edited?: boolean
}

export interface FileInterface {
    url: string,
    type: "file" | "image",
    name: string,
    size: number
}

export interface UserInterface {
    uid: string,
    displayName: string,
    photoURL: string,
    email: string,
    friends: string[]
}


export interface RequestInterface {
    senderID: string,
    senderEmail: string,
    senderName: string,
    senderPhotoURL: string,
    receiverID: string,
    receiverEmail: string,
    receiverName: string,
    receiverPhotoURL: string,
}