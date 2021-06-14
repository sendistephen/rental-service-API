const {
  RENTAL_FETCH_RENTAL_BY_ID_PENDING,
  RENTAL_FETCH_RENTAL_BY_ID_SUCCESS,
} = require('./rentalTypes');

const initalState = {
  rental: null,
  isLoading: false,
  error: false,
};

function rentalReducer(state = initalState, action) {
  switch (action.type) {
    case RENTAL_FETCH_RENTAL_BY_ID_PENDING:
      return {
        ...state,
        isLoading: false,
        error: false,
      };

    case RENTAL_FETCH_RENTAL_BY_ID_SUCCESS:
      return {
        ...state,
        rental: action.payload,
        isLoading: false,
        error: false,
      };
    default:
      return state;
  }
}
export default rentalReducer;
