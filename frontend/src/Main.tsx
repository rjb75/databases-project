import * as React from 'react';
import { App } from './App';
import './styles/Main.scss'

export interface IMainProps
{
    app: App; // Reference to our App.ts class
}

export class Main extends React.Component<IMainProps, {}>
{
    constructor(props: IMainProps)
    {
        super(props);
    }

    public render(): JSX.Element
    {
        return (
            <>
                <h1>Databases Project</h1>
                <p>Welcome to our codebase</p>
            </>
        );
    }
}