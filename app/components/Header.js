"use client";

import React from 'react';
import Link from 'next/link';

import { useSelector, useDispatch } from 'react-redux';

const Header = () => {
  const auth = useSelector((state) => state.auth) //state: { auth: null, form: {}, blogs: {}}
  console.log("Header>auth", auth)

  const renderContent = () => {
    switch (auth) {
      case null:
        return;
      case false:
        return (
          <li>
            <a href={'/auth/google'}>Login With Google</a>
          </li>
        );
      default:
        return [
          <li key="3" style={{ margin: '0 10px' }}>
            <Link href="/blogs">My Blogs</Link>
          </li>,
          <li key="2">
            <a href={'/auth/logout'}>Logout</a>
          </li>
        ];
    }
  }

  return (
    <nav className="indigo">
      <div className="nav-wrapper">
        <Link
          href={auth ? '/blogs' : '/'}
          className="left brand-logo"
          style={{ marginLeft: '10px' }}
        >
          Blogidy
        </Link>
        <ul className="right">{renderContent()}</ul>
      </div>
    </nav>
  );
}

export default Header;
