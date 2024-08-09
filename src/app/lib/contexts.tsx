'use client'
import React, { useState } from 'react'

export const SidebarContext = React.createContext({
    isOpen: true,
    setIsOpen: (isOpen: boolean) => {}
})

export const SidebarContextProvider = (props: any) => {
    const [isOpen, setIsOpen] = useState(true);
    const initState = {
        isOpen,
        setIsOpen
    }


    return (
        <SidebarContext.Provider value={initState}>
            {props.children}
        </SidebarContext.Provider>
    )
}