import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import { PinDropSharp } from "@material-ui/icons";
import { connect } from "react-redux";
import { withFirebase } from "../../firebase";

const styles = {
  cardButtons: {
    width: "100%",
    paddingTop: "17px",
    justifyContent: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const FlightCardActionButtons = ({
  deleteFlightCard,
  destination,
  postId,
  userId,
  clickEditFlightCard,
  setLoginUserId,
}) => {
  useEffect(() => {
    setLoginUserId(userId);
    console.log("flightcaradaction buttons user id ", userId);
  });

  return (
    <div style={styles.cardButtons}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => clickEditFlightCard(postId)}
      >
        EDIT
      </Button>
      &nbsp;&nbsp;
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => deleteFlightCard(destination, postId, userId)}
      >
        DELETE
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userId: state.auth.user.uid,
});

export default connect(mapStateToProps)(withFirebase(FlightCardActionButtons));
