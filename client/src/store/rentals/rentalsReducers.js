import {
  RENTALS_FETCH_ALL_RENTALS_PENDING,
  RENTALS_FETCH_ALL_RENTALS_SUCCESS,
} from './rentalTypes';

const initialState = {
  rentals: [],
  isLoading: false,
};

function rentalsReducer(state = initialState, action) {
  switch (action.type) {
    case RENTALS_FETCH_ALL_RENTALS_PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case RENTALS_FETCH_ALL_RENTALS_SUCCESS:
      return {
        ...state,
        rentals: [...state.rentals, ...action.payload],
        isLoading: false,
      };
    default:
      return state;
  }
}

export default rentalsReducer;
