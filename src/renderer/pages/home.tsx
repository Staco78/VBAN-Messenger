import React from "react";
import HomeWelcome from "../components/home/homeWelcome";
import css from "css/pages/home.module.css";

export default class Home extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <div className={css.welcomeContainer}>
                    <HomeWelcome />
                </div>
            </div>
        );
    }
}
