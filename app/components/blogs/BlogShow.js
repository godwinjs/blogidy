"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlog } from '../../actions';

const BlogShow = ({ id }) => {
  const dispatch = useDispatch();
  const blog = useSelector((state) => state);

  React.useEffect(() => {
    dispatch(fetchBlog(id));
  }, [dispatch, id])

  if (!this.props.blog) {
    return '';
  }

  const { title, content } = this.props.blog;

  return (
    <div>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );

}

export default BlogShow;
