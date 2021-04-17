import React from "react";
import { Button } from "@material-ui/core";
import { PinDropSharp } from "@material-ui/icons";
import { connect } from "react-redux";
import { withFirebase } from "../../firebase";

export const FlightCardActionButtons = ({
  deleteFlightCard,
  destination,
  postId,
  userId,
}) => {
  const handleEditButtonClick = () => alert("Edit Clicked!!!" + userId);

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleEditButtonClick}
      >
        Edits
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => deleteFlightCard(destination, postId, userId)}
      >
        Delete
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userId: state.auth.user.uid,
});

export default connect(mapStateToProps)(withFirebase(FlightCardActionButtons));
