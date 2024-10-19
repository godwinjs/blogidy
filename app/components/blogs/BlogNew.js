"use client"
// BlogNew shows BlogForm and BlogFormReview
import React from 'react';
import { reduxForm } from 'redux-form';
import BlogForm from './BlogForm';
import BlogFormReview from './BlogFormReview';

const BlogNew = (props) => {
  const [ showFormReview, setShowFormReview ] = React.useState(false);
  console.log("BlogNew", props)

  const renderContent = () => {
    if (showFormReview) {
      return (
        <BlogFormReview
          props={{...props, onCancel: setShowFormReview(false)}}
        />
      );
    }

    return (
      <BlogForm
      props={{...props, onCancel: setShowFormReview(false)}}
      />
    );
  }

  return (
    <div>
      {renderContent()}
    </div>
  );
}

export default reduxForm({ form: 'blogForm'})(BlogNew);
