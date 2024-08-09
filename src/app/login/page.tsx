'use client'
import {auth, firestore} from "@/app/firebase/config";
import {useSignInWithGoogle} from "react-firebase-hooks/auth";
import Button from "@/app/components/Button";
import {useRouter} from "next/navigation";
import {UserInterface} from "@/app/lib/interfaces";
import {doc, setDoc} from "@firebase/firestore";
import ToolTip from "@/app/components/ToolTip";

export default function Home() {
    const [signInWithGoogle, cred, loading, error] = useSignInWithGoogle(auth);
    const router = useRouter();
    const signIn = async () => {
        const res = await signInWithGoogle();
        if (!res?.user) {
            return
        }
        const {uid, displayName, photoURL, email} = res?.user!;
        const docData = {
            uid,
            displayName,
            photoURL,
            email
        } as UserInterface;
        await setDoc(doc(firestore, "users", uid), docData, {merge: true});
        if (res) {
            router.push("/");
        }
    }
    return (
        <div className="flex items-center justify-center h-full">
            <div className="flex flex-col w-80 p-12 rounded md:shadow-md sm:bg-drawer items-center">
                <h2 className="mb-4 text-4xl font-bold text-center flex justify-center items-center">Fiscord</h2>
                <Button text="Log in with Google" onClick={signIn} loading={loading} style="w-full" />
                {error &&
                    <ToolTip tip={error.message}>
                        <p className="text-sm text-warning mt-1">Sign in failed, please try again</p>
                    </ToolTip>}
            </div>
        </div>
    );
}