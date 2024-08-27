import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

const BASE_URL = "https://d4536fab-57d9-4188-a9ff-87fccd2cee3b-00-1viuxdabp1ge9.spock.replit.dev"

export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchByUser",
  async (userId) => {
    const response = await fetch(`${BASE_URL}/posts/user/${userId}`)
    return response.json()
  }
)

export const savePost = createAsyncThunk(
  "posts/savePost",
  async (postContent) => {
    const token = localStorage.getItem("authToken")
    const decode = jwtDecode(token)
    const userId = decode.id
    
    const data = {
      title: "Post Title",
      content: postContent,
      user_id:userId
    }

    const response = await axios.post(`${BASE_URL}/posts`, data)
    return response.data;
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
      state.posts = action.payload
      state.loading=false
      })
      .addCase(savePost.fulfilled, (state, action) => {
      state.posts=[action.payload,...state.posts]
    })
  }
})

export default postsSlice.reducer