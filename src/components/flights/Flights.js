import React, { Component } from "react";
import { connect } from "react-redux";
import { withAuthorization } from "../../session";
import { withFirebase } from "../../firebase";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { Icon } from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { Main } from "../";
import { FlightCard, AddFlight } from ".";
import { CompareSharp } from "@material-ui/icons";
import { createPalette } from "@material-ui/core/styles";

class Flights extends Component {
  actions = [
    {
      icon: <Icon path={mdiPlus} size={1} />,
      onClick: () => this.setState({ openFlight: true }),
    },
  ];

  state = {
    loading: false,
    flights: null,
    openFlight: false,
  };

  componentDidMount() {
    this.setState({ loading: true });
    const flightsRef = this.props.firebase.flights();
    flightsRef.onSnapshot((snapshot) => {
      this.setState({ flights: snapshot.docs, loading: false });
      // console.log(snapshot.docs);
    });
  }

  render() {
    const { flights, openFlight } = this.state;
    // console.log(flights);

    return (
      <Main actions={this.actions}>
        {this.renderFlightCards(flights)}
        <AddFlight
          open={openFlight}
          onClose={() => this.setState({ openFlight: false })}
        />
      </Main>
    );
  }

  deleteFlightCard = (selectedFlightCard, postId) => {
    console.log("deleteD");
    this.deleteFlight(postId);

    this.setState({
      flights: this.state.flights.filter((flight) => {
        return (
          flight.data().destination.toLowerCase() !==
          selectedFlightCard.toLowerCase()
        );
      }),
    });
  };

  async deleteFlight(postId) {
    console.log("async delete!" + postId);
    await this.props.firebase.removePost("YV78jlCywpWx0ajR21rkgAotmla2", "8");
  }

  renderFlightCards(flights) {
    if (flights) {
      return flights.map((flight, i) => {
        // console.log(flight.id);
        return (
          <FlightCard
            key={i}
            postId={flight.id}
            details={flight.data()}
            deleteFlightCard={this.deleteFlightCard}
          />
        );
      });
    }
  }
}

const condition = (authUser) => !!authUser;

export default connect()(
  compose(withRouter, withFirebase, withAuthorization(condition))(Flights)
);
