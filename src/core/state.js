import { combineReducers, createStore } from 'redux';

export const updateSwarmTarget = (target, data) => {
    return {
        type: 'UPDATE',
        payload: {
            target,
            data
        }
    }
};

export const removeSwarmTarget = (target) => {
    return {
        type: 'REMOVE',
        payload: {
            target
        }
    }
};

export const swarmTargets = (state = {}, action) => {
    switch(action.type) {
        case 'UPDATE':
            state[action.payload.target] = action.payload.data;
            return state;
        case 'REMOVE':
            delete state[action.payload.target];
            return state;
        default:
            return state;
    }
};

export const allReducers = combineReducers({
    swarmTargets
});

export const store = createStore(
    allReducers
);
