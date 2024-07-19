'use client'
import {auth, firestore} from "@/app/firebase/config";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import Button from "@/app/components/Button";
import {useRouter} from "next/navigation";
import {doc, serverTimestamp, setDoc} from "@firebase/firestore";
import {UserInterface} from "@/app/lib/interfaces";

export default function Home() {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
    const router = useRouter();
    const handleSignIn = async () => {
        try {
            const cred = await signInWithGoogle();
            if (cred == undefined) {
                console.error('Error 1 signing in with Google:', error);
            } else {
                const {uid, displayName, photoURL, email} = cred.user
                const docData = {
                    uid,
                    displayName,
                    photoURL,
                    email,
                    timestamp: serverTimestamp()
                } as UserInterface;
                await setDoc(doc(firestore, "users", uid), docData, { merge: true });
                router.push('/');
            }
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-80 p-12 rounded shadow-md bg-drawer">
                <h2 className="mb-4 text-4xl font-bold text-center flex justify-center items-center">Fiscord</h2>
                <Button style="w-full" text="Log in with Google" onClick={handleSignIn} loading={loading}/>
                <p className={"text-warning text-xs text-center my-1 " + (error ? "" : "invisible")}>An error has
                    occurred, please try again</p>
            </div>
        </div>
    );
}