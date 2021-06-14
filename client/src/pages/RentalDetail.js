import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchRentalById } from 'store/rental/rentalActions';

class RentalDetail extends Component {
  loadingBar = React.createRef();

  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.props.fetchRentalById(id);
  };
  render() {
    const { rental } = this.props.rental;
    return (
      <>
        {rental && (
          <section id="rentalDetails" className="mt-5">
            <div className="container">
              <div className="upper-section ">
                <div className="row">
                  <div className="col-md-6">
                    {/* <!-- TODO: Display rental image --> */}
                    <img src={rental.image.url} alt={rental.name} />
                  </div>
                  <div className="col-md-6">
                    {/* <!-- TODO: Display rental map image --> */}
                    <img src="#" alt="" />
                  </div>
                </div>
              </div>

              <div className="details-section">
                <div className="row">
                  <div className="col-md-8">
                    <div className="rental">
                      {/* <!-- TODO: Display shared category --> */}
                      <h2 className="rental-type">{rental.category}</h2>
                      {/* <!-- TODO: Display title --> */}
                      <h1 className="rental-title">{rental.name}</h1>
                      {/* <!-- TODO: Display city --> */}
                      <h2 className="rental-city">
                        {rental.city}, {rental.street}
                      </h2>
                      <div className="rental-room-info">
                        {/* <!-- TODO: Display numOfRooms --> */}
                        <span>
                          <i className="fa fa-building"></i>
                          {rental.bedrooms} Bedrooms
                        </span>
                        {/* // <!-- TODO: Display numOfRooms + 4 --> */}
                        <span>
                          <i className="fa fa-user"></i> 8 guests
                        </span>
                        {/* // <!-- TODO: Display numOfRooms + 2 --> */}
                        <span>
                          <i className="fa fa-bed"></i> 6 beds
                        </span>
                      </div>
                      {/* <!-- TODO: Display description --> */}
                      <p className="rental-description">{rental.summary}</p>
                      <hr />
                      <div className="rental-assets">
                        <h3 className="title">Assets</h3>
                        <div className="row">
                          <div className="col-md-6">
                            <span>
                              <i className="fa fa-asterisk"></i> Cooling
                            </span>
                            <span>
                              <i className="fa fa-thermometer"></i> Heating
                            </span>
                            <span>
                              <i className="fa fa-location-arrow"></i> Iron
                            </span>
                          </div>
                          <div className="col-md-6">
                            <span>
                              <i className="fa fa-desktop"></i> Working area
                            </span>
                            <span>
                              <i className="fa fa-cube"></i> Washing machine
                            </span>
                            <span>
                              <i className="fa fa-cube"></i> Dishwasher
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4"> BOOKING</div>
                </div>
              </div>
            </div>
          </section>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  rental: state.rental,
});
const mapDispatchToProps = {
  fetchRentalById,
};
export default connect(mapStateToProps, mapDispatchToProps)(RentalDetail);
