import React from "react";
import css from "css/components/status.module.css";


export default function Status(props: {status: number}) {


    return <div data-status={props.status} className={css.status}>
    </div>;
}