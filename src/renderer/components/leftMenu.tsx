import React from "react";
import css from "css/components/leftMenu.module.css";
import Profile from "./leftMenu/profile";
import NavButtons from "./leftMenu/navButtons";
import FriendsList from "./leftMenu/friendsList";

export default class LeftMenu extends React.Component {
    declare readonly state: {
        tab: number;
    };
    constructor(props: any) {
        super(props);
        this.state = { tab: 0 };
    }
    render() {
        return (
            <div className={css.leftMenuContainer}>
                <Profile />
                <div className={css.friendsContainer}>
                    <NavButtons tab={this.state.tab} setTab={(tab: number) => this.setTab(tab)} />
                    <div>{this.state.tab == 0 ? <div /> : <FriendsList />}</div>
                </div>
            </div>
        );
    }
    setTab(tab: number) {
        this.setState({ tab: tab });
    }
}
