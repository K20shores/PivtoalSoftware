import { combineReducers } from 'redux';
import resourceReducer from './resources'
const rootReducer = combineReducers({
    resources: resourceReducer
});

export default rootReducer;