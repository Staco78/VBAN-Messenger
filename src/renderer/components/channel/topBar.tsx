import React from "react";
import css from "css/components/channel/topBar.module.css";
import Status from "../status";
import User from "@/renderer/data/user";
import RightIcons from "./topBar/rightIcons";

export default class TopBar extends React.Component {
    declare readonly props: {
        user: User;
    };
    constructor(props: { user: User }) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className={css.topBarContainer}>
                <div className={css.userContainer}>
                    <div className={css.userInfosContainer}>
                        <div className={css.usernameContainer}>
                            <span className={css.usernameAt}>@</span>
                            {this.props.user.name}
                        </div>
                        <Status status={this.props.user.status} />
                    </div>
                    <div className={css.userNoteContainer}>This is a note. (And not a not because a note is not a not, it is a note)</div>
                </div>
                <div className={css.rightIconsContainer}>
                    <RightIcons user={this.props.user}/>
                </div>
            </div>
        );
    }
}
