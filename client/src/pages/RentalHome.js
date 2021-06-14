import React, { Component } from 'react';
import { connect } from 'react-redux';
import RentalCard from 'components/Rentals/Rental/RentalCard';
import { getAllRentals } from '../store/rentals/rentalsActions';
class RentalHome extends Component {

  componentDidMount = () => {
    this.props.getAllRentals();
  };

  render() {
    const { rentals } = this.props.rentals;
    return (
      <div>
        <div className="card-list">
          <div className="container">
            <h1 className="page-title">Your Home All Around the World</h1>
            <div className="row">
              {rentals.map((rental) => {
                return (
                  <div key={rental._id} className="col-md-3">
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
const mapStateToProps = (state) => ({
  rentals: state.rentals,
});

const mapDispatchToProps = {
  getAllRentals,
};
export default connect(mapStateToProps, mapDispatchToProps)(RentalHome);
