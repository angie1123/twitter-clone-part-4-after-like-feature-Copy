import { createContext, useEffect, useState } from "react"
import { auth } from "../firebase"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    /*
    onAuthStateChanged: This is a method provided by Firebase Auth. 
    It allows you to set up a listener that will be called whenever 
    the user's sign-in state changes. This includes when a user signs 
    in, signs out, or when the user's authentication token is refreshed.
    */
    return auth.onAuthStateChanged((user) => {
      console.log(user)
      setCurrentUser(user)//store currently logged-in user to currentUser state variable
      setLoading(false)
    })
  }, [])
  

//create an object,this equivalent to { currentUser: currentUser }
  const value = { currentUser} 
  console.log(value)
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}