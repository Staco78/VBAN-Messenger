import React from "react";
import { Outlet } from "react-router-dom";
import LeftMenu from "@@/components/left-menu";
import css from "css/pages/app.module.css";

export default class App extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={css.mainContainer}>
                <LeftMenu />
                <div className={css.container}>
                    <Outlet />
                </div>
            </div>
        );
    }
}
