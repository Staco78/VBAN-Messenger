import React, { Children } from "react";
import { Outlet, Link } from "react-router-dom";
import Home from "./home";

export default class App extends React.Component {
  declare readonly props: { children?: React.Component };

  constructor(props: any) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Link to="channel/user/46">Home</Link>
        <div>
            <Outlet/>
        </div>
      </div>
    );
  }
}
