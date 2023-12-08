import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Header, Icon, Segment } from "semantic-ui-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container textAlign="center" style={{ marginTop: "5em" }}>
      <Header as="h2" icon>
        <Icon name="warning circle" color="red" />
        404 - Not Found
        <Header.Subheader>
          The page or resource you are looking for does not exist.
        </Header.Subheader>
      </Header>
      <Segment>
        <Button secondary onClick={() => navigate(-1)}>
          <Icon name="arrow left" />
          Go back
        </Button>
      </Segment>
    </Container>
  );
};

export default NotFound;
