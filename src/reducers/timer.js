import { ADD_TIMER, REMOVE_TIMER } from '../actions/timer';


export default function counter(state = [], action) {
  switch (action.type) {
  case ADD_TIMER:
    return state.filter((timer) => {
      return timer.id !== action.id;
    }).concat([{
      id: action.id,
      description: action.description,
      date: action.date
    }]);
  case REMOVE_TIMER:
    return state.filter((timer) => {
      return timer.id !== action.id;
    });
  default:
    return state;
  }
}
