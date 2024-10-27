"use client"
// BlogNew shows BlogForm and BlogFormReview
import React from 'react';
import { reduxForm } from 'redux-form';
import BlogForm from './BlogForm';
import BlogFormReview from './BlogFormReview';
import { useSelector } from 'react-redux';


const BlogNew = React.memo(function BlogNew(props) {
  const { showFormReview } = useSelector((state) => state.appState)
  const { formReview } = useSelector((state) => state.form)

  // React.useEffect(() => {
  //   let d = renderContent(showFormReview)
  // }, [props])
  
  React.useMemo(() => {props, formReview}, [props, formReview])

  const renderContent = (show) => {
    if ( show ) {
      return (
        <BlogFormReview formReview={formReview}
        />
      );
    }

    return (
      <BlogForm
      />
    );
  }

  return (
    <div>
      {renderContent(showFormReview)}
    </div>
  );
})

export default reduxForm({ form: 'blogForm'})(BlogNew);
// export default BlogNew;
