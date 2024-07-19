'use client'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";

export default function Home() {
    const [user, loading] = useAuthState(auth);
  return (
    <main className="flex min-h-screen grow items-center justify-center">
        <div>Welcome {user?.displayName}</div>
    </main>
  );
}
