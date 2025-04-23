import { Children, createContext, useState } from "react";

export const RoleContext=createContext()

export const RoleContextProvider=({Children})=>{

    const [role,setRole]=useState('')
    const [isLogged,setIsLogged]=useState(false)

    return(
        <>
            <RoleContext.Provider value={{role,setRole,isLogged,setIsLogged}}>
                {Children}
            </RoleContext.Provider>    
        </>
    )
}