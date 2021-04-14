import React from "react";
import { Button } from "@material-ui/core";
import { PinDropSharp } from "@material-ui/icons";

export const FlightCardActionButtons = ({
  deleteFlightCard,
  destination,
  postId,
}) => {
  const handleEditButtonClick = () => alert("Edit Clicked!");

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
        onClick={() => deleteFlightCard(destination, postId)}
      >
        Delete
      </Button>
    </div>
  );
};
