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
import { BorderAll, CompareSharp } from "@material-ui/icons";
import airport from "airport-codes";
import EditFlight from "./EditFlight";

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
    originalFlightsValue: null,
    openFlight: false,
    openFlightEdit: false,
    filterValue: null,
    editFlightdDetails: null,
    postIdValue: null,
    loginUserId: null,
    postCurrent: null,
  };

  componentDidMount() {
    this.setState({ loading: true });
    const flightsRef = this.props.firebase.flights();
    flightsRef.onSnapshot((snapshot) => {
      this.setState({
        flights: snapshot.docs,
        originalFlightsValue: snapshot.docs,
        loading: false,
      });
      // console.log(snapshot.docs);
    });
  }

  render() {
    const { flights, openFlight, openFlightEdit } = this.state;
    // console.log(flights);

    return (
      <Main
        actions={this.actions}
        searchHandler={this.search}
        filterHandler={this.filter}
      >
        {this.renderFlightCards(flights)}
        <AddFlight
          open={openFlight}
          onClose={() => this.setState({ openFlight: false })}
        />
        {openFlightEdit && (
          <EditFlight
            open={openFlightEdit}
            editFlightDetails={this.state.editFlightdDetails}
            postIdValue={this.state.postIdValue}
            onClose={() => this.setState({ openFlightEdit: false })}
          />
        )}
      </Main>
    );
  }

  voteFlight = async (postId, postCurrent) => {
    this.props.firebase.votePost(postId, this.state.loginUserId, postCurrent);
    // console.log("vote clicked!!", postId);
    // console.log(this.state.originalFlightsValue);
    // const postDetails = this.state.originalFlightsValue.find((flight) => {
    //   return flight.id == postId;
    // });
    // console.log(postDetails.data());
    // const voteExist = postDetails.data().votes.find((vote) => {
    //   console.log("vote exist", vote);
    //   return vote == this.state.loginUserId;
    // });
    // console.log("voteexits", voteExist);

    // if (!voteExist) {
    //   this.props.firebase.votePost(postId, this.state.loginUserId, postCurrent);
    // } else {
    //   alert("You have already voted on this flight!");
    // }
  };

  clickEditFlightCard = (postId) => {
    this.setState({
      openFlightEdit: true,
      editFlightdDetails: this.state.flights.find((flight) => {
        console.log("console flight", flight);
        return flight.id == postId;
      }),
      postIdValue: postId,
    });
  };

  deleteFlightCard = (selectedFlightCard, postId, uid) => {
    console.log("deleteD");

    console.log(`uid -> `, this.props.test);

    this.deleteFlight(postId, uid);

    this.setState({
      flights: this.state.flights.filter((flight) => {
        return (
          flight.data().destination.toLowerCase() !==
          selectedFlightCard.toLowerCase()
        );
      }),
    });
  };

  search = (event) => {
    if (event.target.value) {
      this.setState({
        flights: this.state.originalFlightsValue.filter((flight) => {
          //searchby destination
          return (
            flight
              .data()
              .destination.toLowerCase()
              .includes(event.target.value.toLowerCase()) ||
            airport
              .findWhere({ iata: flight.data().destination })
              .get("name")
              .toLowerCase()
              .includes(event.target.value.toLowerCase()) ||
            flight
              .data()
              .origin.toLowerCase()
              .includes(event.target.value.toLowerCase()) ||
            airport
              .findWhere({ iata: flight.data().origin })
              .get("name")
              .toLowerCase()
              .includes(event.target.value.toLowerCase())
          );
        }),
      });
    } else {
      this.setState({
        flights: this.state.originalFlightsValue,
      });
    }
  };

  setLoginUserId = (userId) => {
    if (!this.state.loginUserId) {
      this.setState({
        loginUserId: userId,
      });
    }
  };

  filter = (event) => {
    this.setState({ filterValue: event.target.value });
  };

  async deleteFlight(postId, uid) {
    await this.props.firebase.removePost(uid, postId);
  }

  renderFlightCards(flights) {
    let filteredFlights;

    if (flights) {
      switch (this.state.filterValue) {
        case 1:
          filteredFlights = flights.filter((flight) => {
            return flight.data().current <= 9;
          });
          break;
        case 10:
          filteredFlights = flights.filter((flight) => {
            return flight.data().current > 9 && flight.data().current < 100;
          });
          break;
        case 100:
          filteredFlights = flights.filter((flight) => {
            return flight.data().current >= 99 && flight.data().current < 1000;
          });
          break;
        case 1000:
          filteredFlights = flights.filter((flight) => {
            return flight.data().current > 1000;
          });
          break;
        default:
          filteredFlights = flights;
          break;
      }

      //Task 3: Arrange the posting from highest number of votes to lowest (You can mess with the dummy data in firebase if you did not skip steps 5-7 in the setup)
      filteredFlights.sort((a, b) => {
        return b.data().current - a.data().current;
      });

      return filteredFlights.map((flight, i) => {
        return (
          <FlightCard
            key={i}
            postId={flight.id}
            details={flight.data()}
            deleteFlightCard={this.deleteFlightCard}
            clickEditFlightCard={this.clickEditFlightCard}
            voteFlight={this.voteFlight}
            setLoginUserId={this.setLoginUserId}
            voteExisted={flight.data().votes.find((vote) => {
              return vote == this.state.loginUserId;
            })}
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
