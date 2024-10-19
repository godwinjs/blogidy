"use client"

import React from 'react';
import map from 'lodash/map';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { fetchBlogs } from '../../actions';

const BlogList = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state)

  React.useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch])

  const renderBlogs = () => {
    return map(blogs, blog => {
      return (
        <div className="card darken-1 horizontal" key={blog._id}>
          <div className="card-stacked">
            <div className="card-content">
              <span className="card-title">{blog.title}</span>
              <p>{blog.content}</p>
            </div>
            <div className="card-action">
              <Link href={`/blogs/${blog._id}`}>Read</Link>
            </div>
          </div>
        </div>
      );
    });
  }

  return <div>{renderBlogs()}</div>;
}

export default BlogList;
