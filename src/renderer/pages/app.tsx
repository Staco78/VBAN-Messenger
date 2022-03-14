import React, { Children } from "react";
import { Outlet, Link } from "react-router-dom";
import LeftMenu from "@@/components/left-menu";
import css from './app.module.css';

export default class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <div>
          <LeftMenu/>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    );
  }
}
