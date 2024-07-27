import { useEffect, useState } from "react"
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap"
import axios from "axios"
import useLocalStorage from "use-local-storage"
import { useNavigate } from "react-router-dom"
export default function AuthPage() {
  const loginImage = "https://sig1.co/img-twitter-1"
  const url="https://746dcf9b-393b-478b-8884-6857c551a34c-00-2fh96p197sqx9.picard.replit.dev"
  // const [show, setShow] = useState(false)
  // const handleClose = () => setShow(false)
  // const handleShow = () => setShow(true)
  const [modalShow, setModalShow] = useState(null)
  const handleShowSignUp = () => setModalShow("SignUp")
  const handleShowLogin=()=>setModalShow("Login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [authToken,setAuthToken]=useLocalStorage("authToken","")
  
  const navigate = useNavigate()
  
  useEffect(() => {
    if (authToken) {
      navigate("/profile")
    }
  },[authToken,navigate])
  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      //axios is javascript library for making HTTP request.it works with Node.js and in web browser
      //use to request data from server,if the request is successful,the server responds with the reqested data
      
      /*axios takes tow main input
      1.url  of api endpoint,in this case ,signup endpoint
      2.data to send, in this case ,user information in json format
      */
      //using awai tot ask javascript to wait fot the server to send a response back bafore continuing the code
      const res = await axios.post(`${url}/signup`, { username, password })
      console.log(res)
      console.log(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${url}/login`, { username, password })
      if (res.data && res.data.auth === true && res.data.token) {
        console.log(res)
        setAuthToken(res.data.token)
        console.log('Login was sucessfully,token saved')
    }
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
          <Button className="rounded-pill" variant="outline-dark">
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