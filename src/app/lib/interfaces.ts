import {Timestamp} from "@firebase/firestore";

export interface MessageInterface {
    uid: string,
    displayName: string,
    photoURL: string,
    text: string,
    timestamp: Timestamp
}

export interface UserInterface {
    uid: string,
    displayName: string,
    photoURL: string,
    email: string,
    friends: []
}

export interface InviteInterface {
    inviterUid: string,
    inviterEmail: string,
    inviterName: string,
    inviterPhotoURL: string,
    inviteeUid: string,
    inviteeEmail: string,
    inviteeName: string,
    inviteePhotoURL: string,
}