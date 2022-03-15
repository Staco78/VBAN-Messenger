import React from "react";
import css from "css/components/left-menu.module.css";
import Profile from "./left-menu/profile"

export default class LeftMenu extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { tab: 0 };
  }
  render() {
    return (
      <div className={css.leftMenuContainer}>
        <Profile />
        <div className={css.friendsNavContainer}>
          <div>{/*Navigation buttons*/}</div>
          <div>{/*Friends*/}</div>
        </div>
      </div>
    );
  }
}
