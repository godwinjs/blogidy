"use client"

import React from 'react';
import { useDispatch } from 'react-redux';

import { fetchUser } from '../actions';

import Landing from './Landing';

const App = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch])

  return (
    <div className="container">
      <Landing />
    </div>
  );
}

export default App;
