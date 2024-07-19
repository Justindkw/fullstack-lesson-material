'use client'
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";

export default function AuthorizedLayout({children,}: Readonly<{ children: React.ReactNode }>) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    useEffect(() => {
        if (!user && !loading) {
            router.push('/login')
        }
    }, [loading, user, router])

    return (
        (!loading && user) &&
            <main className="flex min-h-screen flex-row items-center justify-between ">
                {children}
            </main>
    )
}