import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import { PinDropSharp } from "@material-ui/icons";
import { connect } from "react-redux";
import { withFirebase } from "../../firebase";
import { green, purple } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  cardButtons: {
    width: "100%",
    paddingTop: "19px",
    justifyContent: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: { backgroundColor: green },
};

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
}))(Button);

const FlightCardActionButtons = ({
  deleteFlightCard,
  destination,
  postId,
  userId,
  clickEditFlightCard,
  setLoginUserId,
  detailsCurrent,
  voteFlight,
  voteExisted,
  posterId,
}) => {
  useEffect(() => {
    setLoginUserId(userId);
    // console.log("flightcaradaction buttons user id ", userId);
  });

  return (
    <div style={styles.cardButtons}>
      {voteExisted ? (
        <Button variant="contained" size="small" disabled>
          VOTED
        </Button>
      ) : (
        <ColorButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => voteFlight(postId, detailsCurrent)}
          // className={classes.margin}
        >
          VOTE
        </ColorButton>
      )}
      {/* <ColorButton
        variant="contained"
        color="primary"
        size="small"
        onClick={() => voteFlight(postId, detailsCurrent)}
        // className={classes.margin}
      >
        {voteExisted ? "VOTED" : "VOTE"}
      </ColorButton> */}
      &nbsp;&nbsp;
      {userId === posterId ? (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => clickEditFlightCard(postId)}
        >
          EDIT
        </Button>
      ) : (
        <Button variant="contained" color="primary" size="small" disabled>
          EDIT
        </Button>
      )}
      &nbsp;&nbsp;
      {userId === posterId ? (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => deleteFlightCard(destination, postId, userId)}
        >
          DELETE
        </Button>
      ) : (
        <Button variant="contained" color="secondary" size="small" disabled>
          DELETE
        </Button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  userId: state.auth.user.uid,
});

export default connect(mapStateToProps)(withFirebase(FlightCardActionButtons));
