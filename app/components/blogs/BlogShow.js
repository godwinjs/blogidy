"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlog } from '../../actions';

const BlogShow = ({ id }) => {
  const dispatch = useDispatch();
  const blog = useSelector((state) => state.blogs[id]);

  console.log(id, blog)

  React.useEffect(() => {
    // if(!blog.id) dispatch(fetchBlog(id));
  }, [dispatch, id])

  if (!blog) {
    return '';
  }

  const { title, content } = blog;

  return (
    <div>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );

}

export default BlogShow;
