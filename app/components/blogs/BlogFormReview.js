"use client"

// BlogFormReview shows users their form inputs for review
import _ from 'lodash';
import React from 'react';
import { reduxForm } from 'redux-form';
import { useSelector } from 'react-redux';
import { formFields } from './formFields';
import { submitBlog } from '../../actions';
import { useRouter } from 'next/navigation';

import { useDispatch } from 'react-redux';
import { setShowFormReview } from '@/app/actions';

const BlogFormReview = (props) => {
  const formValues = useSelector((state) => state.form)
  const router = useRouter();
  const dispatch = useDispatch();
  
  console.log(formValues.blogForm.values, formFields)

  const renderFields = () => {

    return _.map(formFields, ({ name, label }) => {
      return (
        <div key={name}>
          <label>{label}</label>
          <div>{formValues.blogForm.values[name]}</div>
        </div>
      );
    });
  }

  const renderButtons = () => {

    return (
      <div>
        <button
          className="yellow darken-3 white-text btn-flat"
          onClick={() => dispatch(setShowFormReview(false))}
        >
          Back
        </button>
        <button className="green btn-flat right white-text">
          Save Blog
          <i className="material-icons right">email</i>
        </button>
      </div>
    );
  }

  const onSubmit = (event) =>  {
    event.preventDefault();
    const history = router;

    dispatch(submitBlog(formValues.blogForm.values, history));
    history.push("/blogs")
  }

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <h5>Please confirm your entries</h5>
      {renderFields()}

      {renderButtons()}
    </form>
  );
}

export default BlogFormReview;
// export default reduxForm({ form: 'blogForm'})(BlogFormReview);
