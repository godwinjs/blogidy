import axios from 'axios';
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG, SET_FORMREVIEW } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  console.log(res)

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, history) => async dispatch => {
  const res = await axios.post('/api/blog', values);
  console.log(values)

  // history.push('/blogs');
  dispatch({ type: FETCH_BLOG, payload: res.data });
};

export const setShowFormReview = (bool) => dispatch => {
  

  // history.push('/blogs');
  dispatch({ type: SET_FORMREVIEW, payload: bool });
};

export const fetchBlogs = () => async dispatch => {

  try {
    const res = await axios.get('/api/blogs');
    dispatch({ type: FETCH_BLOGS, payload: res.data });
  } catch (err) {
    console.log(err)
  }

};

export const fetchBlog = id => async dispatch => {
  const res = await axios.get(`/api/blogs/${id}`);

  dispatch({ type: FETCH_BLOG, payload: res.data });
};
