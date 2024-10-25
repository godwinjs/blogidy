
import { SET_FORMREVIEW } from '../actions/types';

export default function blogsReducer(state = { showFormReview: false}, action) {
  switch (action.type) {
    case SET_FORMREVIEW:
      console.log("setting appState SET_FORMREVIEW: ", action.payload)
      return { ...state, showFormReview: action.payload}
    default:
      return state;
  }
}
