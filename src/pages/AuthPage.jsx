import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword
 } from "firebase/auth"
import { useContext, useEffect,useState } from "react"
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import{AuthContext} from "../components/AuthProvider"

export default function AuthPage() {
  const loginImage = "https://sig1.co/img-twitter-1"
 
  const [modalShow, setModalShow] = useState(null)
  const handleShowSignUp = () => setModalShow("SignUp")
  const handleShowLogin=()=>setModalShow("Login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const auth = getAuth()
  const { currentUser } = useContext(AuthContext)
  
  useEffect(() => {
    if(currentUser) navigate("/profile")
  },[currentUser,navigate])
  
  
  
  const [signUpError, setSignUpError] = useState("")
  const[loginError,setLoginError]=useState("")
  
  
  // useEffect(() => {
  //   if (authToken) {
  //     navigate("/profile")
  //   }
  // }, [authToken, navigate])
  
  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      //createUserWithEmailAndPassword is firebase function to create user
      const res = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      ) 
      console.log(res.user)
    } catch (error) {
      /*when the response in api return with 400 status code, 
      axios detect 400 status code and throw an error*/ 
      console.error(error)
      if (error.response.data.message) {
        setSignUpError(error.response.data.message)
      } else {
        setSignUpError("An error occurred during sign-up. Please try again.")
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth,username,password)
    }
     catch (error) {
     console.error(error)
      if (error.response.data.auth === false) {
        //if password is incorrect
        setLoginError(" password is incorrect")
      } else {
        //if username is incorrect
        setLoginError(error.response.data.message)
      }
    }
  }

  const provider = new GoogleAuthProvider()
  const handleGoogleLogin = async (e) => {
    e.preventDefault()

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error)
    }
  }
  const handleClose=()=>setModalShow(null)
  return (
    <Row>
      <Col sm={6}>
        <Image src={loginImage} fluid/>
      </Col>
      <Col sm={6} className="p-4">
        <i className="bi bi-twitter" style={{ fontSize: 50, color: "dodgerblue" }} />
        
        <p className="mt-5" style={{ fontSize: 64 }}> Happening Now</p>
        <h2 className="my-5" style={{ fontSize: 31 }}>Join Twitter Todoy. </h2>
      
        <Col sm={5} className="d-grid gap-2">
          <Button className="rounded-pill" variant="outline-dark"
            onClick={handleGoogleLogin}>
            <i className="bi bi-google"/> Sign up with Google
          </Button>
          <Button className="rounded-pill" variant="outline-dark">
          <i className="bi bi-apple"/> Sign up with Apple
          </Button>
          <p style={{ textAlign: "center" }}>or</p>
          <Button className="rounded-pill" onClick={handleShowSignUp}>
            Create an account
          </Button>
          <p style={{fontSize:"12px"}}>
            By signing up, you agree to the Terms of Service and Privacy Policy including Cookie Use.
          </p>

          <p className="mt-5" style={{fontWeight:"bold"}}>
          Already have an account?
          </p>
          <Button onClick={handleShowLogin} className="rounded-pill" variant="outline-primary">Sign In</Button>
        </Col>
        <Modal show={modalShow !== null}
          onHide={handleClose}
          animation={false}
          centered>
          <Modal.Body >
            <h2 className="mb-4" style={{ fontWeight: "bold" }}>
              {modalShow === "SignUp" ?
                "Create your account" :
                "Log in to your account"}
            </h2>
            <Form className="d-grid gap-2 px-5"
              onSubmit={modalShow==="SignUp" ? handleSignUp:handleLogin}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                onChange={(e)=>setUsername(e.target.value)}
                  type="email" placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                onChange={(e)=>setPassword(e.target.value)}
                  type="password" placeholder="Password" />
              </Form.Group>

               {/*
               the && operator will allow the JSX expression
                (<p style={{ color: "red", fontSize: "14px" }}>{signUpError}</p>) 
                to be rendered.
               */}
              {modalShow === "SignUp" && signUpError  && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  {signUpError}
                </p>
              )}
              
              {modalShow === 'Login' && loginError && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  {loginError}
                </p>
              )}
            
            <p style={{fontSize:"12px"}}>
              By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
              SigmaTweets may use your contact information ,including your email address and phone number
              for purpose outlined in our Privacy Policy,Like keeping your account secure and personalising 
              our services, including ads. Learn more.
            </p>
              <Button className="rounded-pill" type="submit">
                {modalShow==="SignUp"?"Sign up":"Log in"}
            </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  )
}