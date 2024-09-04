import { useContext,useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { savePost } from "../features/posts/postsSlice"
import { AuthContext } from "./AuthProvider"

export default function NewPostModal({ show, handleClose }) {
  const [postContent, setPostContent] = useState("")
  const[file,setFile]=useState(null)
  const dispatch = useDispatch()
  //current user is get from AuthProvider function which return AuthContext.provider
  const { currentUser } = useContext(AuthContext)
  const userId=currentUser.uid

  const handleSave = () => {
    dispatch(savePost({userId,postContent,file}))
    handleClose()
    setPostContent("")
    setFile(null)
  }

  const handleFileChange = (e) => {
    //files is the property of input element of type="file"
    setFile(e.target.files[0])
    console.log(e.target.files)
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="postContent">
              <Form.Control
                placeholder="What is happening?!"
                as="textarea"
                rows={3}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <br />
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="rounded-pill"
            onClick={handleSave}
          >
            Tweet
          </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}