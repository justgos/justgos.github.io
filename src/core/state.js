import { combineReducers, createStore } from 'redux';

export const updateSwarmTarget = (target, data) => {
    return {
        type: 'UPDATE_TARGET',
        payload: {
            target,
            data
        }
    }
};

export const removeSwarmTarget = (target) => {
    return {
        type: 'REMOVE_TARGET',
        payload: {
            target
        }
    }
};

export const swarmTargets = (state = {}, action) => {
    switch(action.type) {
        case 'UPDATE_TARGET':
            state[action.payload.target] = action.payload.data;
            return state;
        case 'REMOVE_TARGET':
            delete state[action.payload.target];
            return state;
        default:
            return state;
    }
};


export const updateSwarmState = ({ positionTex }) => {
    return {
        type: 'UPDATE_STATE',
        payload: {
            positionTex
        }
    }
};

export const swarmState = (state = {}, action) => {
    switch(action.type) {
        case 'UPDATE_STATE':
            state = {
                ...state,
                ...action.payload
            };
            return state;
        default:
            return state;
    }
};

export const allReducers = combineReducers({
    swarmTargets,
    swarmState,
});

export const store = createStore(
    allReducers
);
