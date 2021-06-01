/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from 'react';
import RentalCard from '../components/Rentals/Rental/RentalCard';

class RentalHome extends Component {
  state = {
    rentals: [
      {
        title: 'Nice view on ocean',
        city: 'San Francisco',
        category: 'condo',
        image: 'http://via.placeholder.com/350x250',
        numOfRooms: 4,
        shared: true,
        description: 'Very nice apartment in center of the city.',
        dailyPrice: 43,
      },
      {
        title: 'Modern apartment in center',
        city: 'New York',
        category: 'apartment',
        image: 'http://via.placeholder.com/350x250',
        numOfRooms: 1,
        shared: false,
        description: 'Very nice apartment in center of the city.',
        dailyPrice: 11,
      },
      {
        title: 'Old house in nature',
        city: 'Bratislava',
        category: 'house',
        image: 'http://via.placeholder.com/350x250',
        numOfRooms: 5,
        shared: true,
        description: 'Very nice apartment in center of the city.',
        dailyPrice: 23,
      },
    ],
  };
  render() {
    const { rentals } = this.state;
    return (
      <div>
        <div className="card-list">
          <div className="container">
            <h1 className="page-title">Your Home All Around the World</h1>
            <div className="row">
              {rentals.map((rental) => {
                return (
                  <div className="col-md-3">
                    <RentalCard rental={rental} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default RentalHome;
