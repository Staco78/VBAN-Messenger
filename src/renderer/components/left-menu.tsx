import React from "react";
import css from "css/components/left-menu.module.css";
import Profile from "./left-menu/profile"
import NavButtons from "./left-menu/nav-buttons";

export default class LeftMenu extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { tab: 0 };
  }
  render() {
    return (
      <div className={css.leftMenuContainer}>
        <Profile />
        <div className={css.friendsContainer}>
          <NavButtons tab={(this.state as any).tab} setTab={(tab:number) => (this.setTab(tab))}/>
          <div>{/*Friends*/}</div>
        </div>
      </div>
    );
  }
  setTab(tab:number) {
    this.setState({tab:tab});
  }
}
