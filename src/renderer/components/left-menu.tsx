import React from "react";
import { Link } from "react-router-dom";

export default class LeftMenu extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { tab: 0 };
  }
  render() {
    return (
      <div>
        <div>{/*Profile*/}</div>
        <div>
          <div>{/*Navigation buttons*/}</div>
          <div>{/*Friends*/}</div>
        </div>
      </div>
    );
  }
}
