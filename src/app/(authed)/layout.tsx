'use client'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import SideBar from "@/app/components/SideBar";
import {Transition} from "@headlessui/react";
import {SidebarContext, SidebarContextProvider} from "@/app/lib/contexts";

export default function AuthLayout({children,}: Readonly<{ children: React.ReactNode; }>) {

    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const sideBarState = useContext(SidebarContext);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (!user && !loading) {
            router.push('/login')
        }
    }, [loading, user])

    useEffect(() => {
        function mediaQuery() {
            setIsMobile(!window.matchMedia("(min-width:640px)").matches)
        }
        window.addEventListener("resize", mediaQuery);
        return () => window.removeEventListener("resize", mediaQuery);
    });

    return (!loading && user) &&
        <main className="flex h-full">
            <Transition as="div"
                        className="w-full h-full sm:w-3/12 sm:min-w-60 sm:max-w-80 fixed sm:static top-0 z-10 transition duration-150 ease-in-out data-[closed]:-translate-x-full"
                        show={sideBarState.isOpen || !isMobile}
            >
                <SideBar/>
            </Transition>
            {children}
    </main>;
}