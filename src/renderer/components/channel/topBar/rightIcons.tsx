import React from "react";
import css from "css/components/channel/topBar/rightIcons.module.css";
import User from "@/renderer/data/user";

export default class RightIcons extends React.Component {
    declare readonly props: {
        user: User;
    };
    constructor(props: { user: User }) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className={css.rightIconsContainer}>
            </div>
        );
    }
}
