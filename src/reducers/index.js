import { combineReducers } from 'redux';
import counter from './counter';
import timer from './timer';


const rootReducer = combineReducers({
  counter,
  timer
});


export default rootReducer;
