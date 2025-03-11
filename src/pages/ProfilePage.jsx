import { useContext, useEffect,} from "react"
import { Container,  Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import ProfileSideBar from "../components/ProfileSideBar"
import ProfileMidBody from "../components/ProfileMidBody"
import { getAuth } from "firebase/auth"
import { AuthContext } from "../components/AuthProvider"

export default function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)
  console.log(currentUser)
  
 
//without useEffect the currentUser might not be set yet at the time component render,cause not redirect to login page even if currentUser is null    if (!currentUser) {
//   useEffect(() => {
//     if (!currentUser) {
//     navigate('/login')
//   }
// },[currentUser,navigate])
  useEffect(() => {
     if (!currentUser) {
    navigate("/login")
  }
  },[currentUser,navigate])
 

  const handleLogout =async () => {
    await auth.signOut()
    navigate("/login")
    
  }

  
  return (
    <>
      <Container>
        <Row>
          <ProfileSideBar handleLogout={handleLogout} />
          <ProfileMidBody />
        </Row>
      </Container>
    </>
  )
}