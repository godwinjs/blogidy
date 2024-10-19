"use client"

// BlogFormReview shows users their form inputs for review
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { formFields } from './formFields';
import * as actions from '../../actions';

const BlogFormReview = (props) => {
  const state = useSelector((state) => state)
  console.log("BlogFormReview>props",props)
  console.log("BlogFormReview>state", state)


  const renderFields = () => {

    return _.map(formFields, ({ name, label }) => {
      return (
        <div key={name}>
          <label>{label}</label>
          <div>{state.formValues[name]}</div>
        </div>
      );
    });
  }

  renderButtons = () => {
    const { onCancel } = props;

    return (
      <div>
        <button
          className="yellow darken-3 white-text btn-flat"
          onClick={onCancel}
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

    const { submitBlog, history, formValues } = state; //&&|| props

    dispatch(submitBlog(formValues, history));
  }

  return (
    <form onSubmit={() => onSubmit()}>
      <h5>Please confirm your entries</h5>
      {renderFields()}

      {this.renderButtons()}
    </form>
  );
}

export default BlogFormReview;
