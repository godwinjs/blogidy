"use client"

import App from "./components/App";
import Header from "./components/Header";

export default function Home(props) {
  console.log("Home>App", props)
  return (<>
            <Header />
            <App />
          </>);
}
