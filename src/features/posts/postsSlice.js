import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {collection,doc,getDoc,getDocs,setDoc, updateDoc,deleteDoc} from "firebase/firestore"
import{db,storage} from "../../firebase"
import { getDownloadURL,ref,uploadBytes } from "firebase/storage"


export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ userId, postId }) => {
    try {
      const postRef = doc(db, `users/${userId}/posts/${postId}`)
      
      await deleteDoc(postRef)

      return postId
    } catch (error) {
      console.error(error)
      throw error
    }
  }
)

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ userId, postId, newPostContent, newFile }) => {
    try {
      let newImageUrl
      if (newFile) {//newFile store new image in updatePost modal component
        const imageRef = ref(storage, `posts/${newFile.name}`)
        const response = await uploadBytes(imageRef, newFile)
        newImageUrl=await getDownloadURL(response.ref)
      }

      const postRef = doc(db, `users/${userId}/posts/${postId}`)
      const postSnap = await getDoc(postRef)
      if (postSnap.exists()) {
        const postData = postSnap.data()
        
        const updatedData = {
          ...postData,
          content: newPostContent || postData.content,
          imageUrl:newImageUrl||postData.imageUrl//if newImageUtl remain undefined,the previous image is remain
        }

        await updateDoc(postRef, updatedData)
        
        const updatedPost = { id: postId, ...updatedData }
        return updatedPost
      } else {
        throw new Error("Post does not exist")
      }
    }
    catch (error) {
      console.error(error)
      throw error
    }
  }
)
export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchByUser",
  async (userId) => {
    try {
      //get refernece of where the user's posts are store in firebase database
      const postsRef = collection(db, `users/${userId}/posts`)
      
      //getDocs() get all the documents located at document path specified in `postsRef`
      const querySnapshot = await getDocs(postsRef)
      /*
      ({}): Used to immediately return an object from an arrow function without needing 
      to explicitly write return.

      docs=[{},{},{}]
       */
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
          ...doc.data()//... (spread operator) is used to spread out all the key-value pairs from the doc.data() object into a new object.
      //doc.data() is a method that retrieves the data stored in the document as a plain JavaScript object.
      }))
    return docs
    } catch (error) {
      console.error(error)
      throw error
    }
  }
)

export const savePost = createAsyncThunk(
  "posts/savePost",
  async ({ userId, postContent ,file}) => {
    try {
      /*ref create a reference to specific location in your firebase storage,reference can be used to 
      upload,download,or manage files at that location*/
      /*(storage,`posts/${file.name}`) :
      storage： represent storage bucket where the files are stored
      `posts/${file.name}`：path within storage bucket where the file will be stored
      */
      let imageUrl=""//when no file pass in ,this empty string will be extract in profile post card and assign to the image src of the post
      if (file !== null) {
        const imageRef = ref(storage, `posts/${file.name}`)//if no file pass in ,the file.name will be null
      const response = await uploadBytes(imageRef, file)//upload a file to firebase storage(where the file been upload,file to upload)
      console.log(response)
      imageUrl = await getDownloadURL(response.ref)//the .ref property in the response object is a Reference object. This Reference points to the exact location in Firebase Storage where the file was uploaded.
      console.log(imageUrl)
      }
      
      //A collection in Firestore is a group of documents.
      const postsRef = collection(db, `users/${userId}/posts`)
      // console.log(`users/${userId}/posts`)
      const newPostRef = doc(postsRef)
      console.log(newPostRef)
      /*doc(postsRef): This function creates a new document reference in the Firestore
       collection referenced by postsRef.
       
       By calling doc(postsRef) without specifying a document ID, 
       Firestore automatically generates a unique ID for the new document.
       */
      // console.log(postContent)
      //setDoc() add data into newPostRef document
      await setDoc(newPostRef, { content: postContent, likes: [],imageUrl })
      const newPost = await getDoc(newPostRef)
      console.log(newPost)
      const post = {
        id: newPost.id,
        ...newPost.data()//retrieve the content in the document
      };
      console.log(post)

      return post
    } catch (error) {
      console.error(error)
      throw error
    }
  }
)


export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ userId, postId }) => {
    try {
      /*The doc() function is a Firebase Firestore function used to create
       a reference to a specific document within a collection or subcollection.*/
     
       const postRef = doc(db, `users/${userId}/posts/${postId}`)
      
      //getDoc get all the data inside the document
      const docSnap = await getDoc(postRef)
      
      if (docSnap.exists()) {
        const postData = docSnap.data()
        /*
        postData={
        content:'Hello from firebse',
        likes:[userID1,userID2,userID3]
        }
        
        */
        console.log(postData)
        //spread previous user alredy like the post and add new user who like the post in the likes variable
        const likes = [...postData.likes, userId]
        
        //it re-write the data inside the post with setDoc,it takes two parameter
        //1.A document path(postRef)
        //2.data to be added
        //{postRef,{postData,likes}}
        //{postData,likes}={content:'Hello from firebase',likes:[userID1,userID2,userID3],likes:[userID1,userID2,userID3,userID4]}
        //if had two same key name, javascript will always takes the most updated one which is the right one
        //final answer iwll be{postData,likes}={content:'Hello from firebase',likes:[userID1,userID2,userID3,userID4]}

        await setDoc(postRef, {...postData, likes })
      }
      return {userId,postId}
    } catch (error) {
      console.error(error)
      throw error
    }
  }
)

export const removeLikeFromPost = createAsyncThunk(
  "posts/removeLikeFromPost",
  async ({ userId, postId }) => {
    try {
      const postRef = doc(db, `users/${userId}/posts/${postId}`)
 
      const docSnap = await getDoc(postRef)
      if (docSnap.exists()) {
        /*
        It extracts the data from the document snapshot and returns it as 
        a plain JavaScript object. This object contains all the fields and
        values stored in the document.
        */
        const postData = docSnap.data()
        console.log(postData)
        const likes = postData.likes.filter((id) => id !== userId)
        
        await setDoc(postRef,{...postData,likes})
      }

      return {userId,postId}
    } catch (error) {
      console.error(error)
      throw error
    }
  }
)
const postsSlice = createSlice({
  name: "posts",
  initialState: { posts: [], loading: true },
  reducers: {},

  /*  
When you create an async action using createAsyncThunk, Redux Toolkit automatically generates three action types for you:

pending: Dispatched when the async function starts.
fulfilled: Dispatched when the async function successfully completes.
rejected: Dispatched when the async function fails.
  */
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        /* 
         action.payload represents docs because docs is the value returned from the asynchronous 
         function handling the data fetch, and Redux Toolkit automatically assigns this returned 
         value to action.payload.
        */ 
      state.posts = action.payload
      state.loading=false
      })
      .addCase(savePost.fulfilled, (state, action) => {
      state.posts=[action.payload,...state.posts]//[return value,previous state post value]
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { userId, postId } = action.payload
        
        const postIndex = state.posts.findIndex((post) => post.id === postId)
        
        if (postIndex !== -1) {
          state.posts[postIndex].likes.push(userId)
        }

      })
      .addCase(removeLikeFromPost.fulfilled, (state, action) => {
        const { userId, postId } = action.payload
        
        const postIndex = state.posts.findIndex((post) => post.id === postId)
        if (postIndex !== -1) {
          state.posts[postIndex].likes = state.posts[postIndex].likes.filter(
            (id)=>id!==userId
          )
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload
        
        const postIndex = state.posts.findIndex(
          (post)=>post.id===updatedPost.id
        )
        if (postIndex !== -1) {
          state.posts[postIndex]=updatedPost
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const deletedPostId = action.payload
        state.posts=state.posts.filter((post)=>post.id !== deletedPostId)
        

    })
  }
})

export default postsSlice.reducer