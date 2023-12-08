import React from "react";
import { Grid, Message } from "semantic-ui-react";

const CustomMessage = ({ type, content, width, marginBottom }) => {
  return (
    <Grid centered columns={1} style={{}}>
      <Grid.Column style={{ maxWidth: width || "50%", marginBottom }}>
        <Message positive={type === "success"} negative={type === "error"}>
          <p>{content}</p>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default CustomMessage;
