'use client'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import SideBar from "@/app/components/SideBar";

export default function AuthLayout({children,}: Readonly<{ children: React.ReactNode; }>) {

    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if (!user && !loading) {
            router.push('/login')
        }
    }, [loading, user])

    return (!loading && user) && <main className="flex">
        <SideBar/>
        {children}
    </main>;
}