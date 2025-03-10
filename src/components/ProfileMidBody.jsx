
import { useContext, useEffect } from "react"
import{AuthContext} from "./AuthProvider"
import { Button, Col, Image, Nav, Row, Spinner, } from "react-bootstrap"
import ProfilePostCard from "./ProfilePostCard"
import {   useDispatch, useSelector } from "react-redux"
import { fetchPostsByUser } from "../features/posts/postsSlice"


export default function ProfileMidBody() {
  const url = "https://i.pinimg.com/originals/33/8e/de/338ede5f9f949b9c4cc6c1c0c15c6a00.jpg"
  const pic="https://static.vecteezy.com/system/resources/previews/022/538/039/original/yellow-face-wow-emoji-surprised-shocked-emoticon-3d-render-illustration-free-png.png"

  const dispatch=useDispatch()
  const posts = useSelector((state) => state.posts.posts)
  const loading = useSelector((state) => state.posts.loading)
//   console.log(posts)
  const { currentUser } = useContext(AuthContext)
  
  useEffect(() => {
  dispatch(fetchPostsByUser(currentUser.uid))
  }, [dispatch, currentUser])
  // Any variable, prop, or function that you reference inside the useEffect should be included in the dependency array unless you have a clear reason not to.

  return (
    <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
      <Image src={url} fluid />{/*fluid spanning the the entire width*/}
      <br />
      <Image
        src={pic}
        roundedCircle
        style={{
          width: 150,
          position: "absolute",
          top: "140px",
          border: "4px solid #F8F9FA",
          marginLeft:15
        }}
      />

      <Row className="justify-content-end">
        <Col xs="auto">
          <Button className="rounded-pill mt-2" variant="outline-secondary">
            Edit Profile
        </Button>
        </Col>
      </Row>

      <p className="mt-5" style={{ margin: 0, fontWeight: "bold", fontSize: "15px" }}>
        Haris
      </p>

      <p style={{marginBottom:"2px"}}>@haris.samingan</p>
      
      <p>I help people switch careers to be a software developer at sigmaschool.co</p>

      <p>Entrepreneur</p>
    
      <p>
        <strong>271</strong> Following <strong>610</strong> Followers
      </p>

      {/*justify prop makes the navigation items fill the entire width of the container, distributing the space evenly among all the items. */}
      <Nav variant="underline" defaultActiveKey="/home" justify>
        <Nav.Item>
          <Nav.Link eventKey="/home">Tweets</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Replies</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Highlights</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-3">Media</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-4">Likes</Nav.Link>
        </Nav.Item>
      </Nav>
      {loading && (<Spinner animation="border" className="ms-3 mt-3" variant="primary" />
      )}
      {posts.length > 0 && posts.map((post) => (
        <ProfilePostCard key={post.id} post={post}/> 
      ))}
      
    </Col>
  )
}