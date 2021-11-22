export interface TestState {
    test: string[];
}

const initialState = {
    test: [] as string[],
};

export type Action = { type: "ADD_TEST", payload: string };

export const testReducer = (
    state: TestState = initialState,
    action: Action
) => {
    switch(action.type) {
        case "ADD_TEST": {
            return { ...state, test: [...state.test, action.payload ]};
        }
        default:
            return state;
    }
};