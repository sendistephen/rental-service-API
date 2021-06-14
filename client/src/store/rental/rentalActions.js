import axios from 'axios';
import {
  RENTAL_FETCH_RENTAL_BY_ID_PENDING,
  RENTAL_FETCH_RENTAL_BY_ID_SUCCESS,
  RENTAL_FETCH_RENTAL_ERROR,
} from './rentalTypes';

export const fetchRentalById = (rentalId) => async (dispatch) => {
  try {
    dispatch({
      type: RENTAL_FETCH_RENTAL_BY_ID_PENDING,
    });
    // make req to the api
    const res = await axios.get(
      `http://localhost:4000/api/v1/rentals/${rentalId}`
    );
    dispatch({
      type: RENTAL_FETCH_RENTAL_BY_ID_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RENTAL_FETCH_RENTAL_ERROR,
    });
  }
};
