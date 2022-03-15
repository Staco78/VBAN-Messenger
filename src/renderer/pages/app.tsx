import React from "react";
import { Outlet } from "react-router-dom";
import LeftMenu from "@@/components/left-menu";

export default class App extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <div>
                    <LeftMenu />
                </div>
                <div>
                    <Outlet />
                </div>
            </div>
        );
    }
}
