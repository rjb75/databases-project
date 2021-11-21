import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { TestState } from "../reducers/testReducer";

function TestComponent() {
    const test = useSelector<TestState, TestState["test"]>(
        (state) => state.test
    );

    const [text, setText] = useState("");

    const dispatch = useDispatch();

    const onAddTest = (test: string) => {
        dispatch({type: "ADD_TEST", payload: test});
    }
    return (
        <>
            <input onChange={(e) => setText(e.target.value)} value={text} />
            <button onClick={() => {onAddTest(text) 
                setText("")}}>Add</button>
            <p>This is a test component</p>
            <ul>
                {test.map((test) => {
                    return <li key={test}>{test}</li>
                })}
            </ul>
        </>
    )
}

export default TestComponent;