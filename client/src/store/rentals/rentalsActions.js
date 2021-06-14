import axios from 'axios';
import {
  RENTALS_FETCH_ALL_RENTALS_ERROR,
  RENTALS_FETCH_ALL_RENTALS_PENDING,
  RENTALS_FETCH_ALL_RENTALS_SUCCESS,
} from './rentalTypes';

export const getAllRentals = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: RENTALS_FETCH_ALL_RENTALS_PENDING,
    });

    const res = await axios.get('http://localhost:4000/api/v1/rentals');
    dispatch({
      type: RENTALS_FETCH_ALL_RENTALS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RENTALS_FETCH_ALL_RENTALS_ERROR,
    });
  }
};
