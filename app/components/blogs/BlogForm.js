"use client"

// BlogForm shows a form for a user to add input
import _ from 'lodash';
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import Link from 'next/link';
import BlogField from './BlogField';
import { formFields } from './formFields';

import { useDispatch } from 'react-redux';
import { setShowFormReview } from '@/app/actions';

const BlogForm = React.memo( function BlogForm(props) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    window.addEventListener('submit', (e) => {
      props.handleSubmit(() => dispatch(setShowFormReview(true)));
      dispatch( setShowFormReview(true) );
      
    })

    // return () => {
    //   window.removeEventListener('submit', (e) => {
    //     console.log(e)
    //   })
    // }
  }, [])

  const renderFields = () => {
    return _.map(formFields, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={BlogField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }

  return (
    <div>
      <form>
        {renderFields()}
        <Link href="/blogs" className="red btn-flat white-text">
          Cancel
        </Link>
        <button type="submit" className="teal btn-flat right white-text">
          Next
          <i className="material-icons right">done</i>
        </button>
      </form>
    </div>
  );
})

function validate(values) {
  const errors = {};

  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}

export default reduxForm({
  validate,
  form: 'blogForm',
  destroyOnUnmount: false
})(BlogForm);
