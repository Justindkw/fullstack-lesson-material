import {Timestamp} from "@firebase/firestore";

export interface MessageInterface {
    text: string,
    timestamp: Timestamp,
    file?: FileInterface
}

export interface FileInterface {
    url: string,
    type: "file" | "image",
    name: string
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