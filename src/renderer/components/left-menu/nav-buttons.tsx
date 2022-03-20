import React from "react";
import css from "css/components/left-menu/nav-button.module.css";

export default function NavButtons(props: any) {
    return (
        <div className={css.navButtonsContainer}>
            <div
                className={css.recentButton}
                style={{ backgroundColor: props.tab == 0 ? "var(--blue-3)" : "" }}
                onClick={() => {
                    props.setTab(0);
                }}>
                Recent
            </div>
            <div
                className={css.friendsButton}
                style={{ backgroundColor: props.tab == 1 ? "var(--blue-3)" : "" }}
                onClick={() => {
                    props.setTab(1);
                }}>
                Friends
            </div>
        </div>
    );
}
