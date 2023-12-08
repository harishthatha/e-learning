import React, { useState } from "react";
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import { Link as RouterLink } from "react-router-dom";
import CustomMessage from "../layout/CustomMessage";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState(null); // New state for displaying alerts
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors and alerts
    setErrors({ email: "", password: "" });
    setAlert(null);

    // Validation
    let formIsValid = true;
    const updatedErrors = {};

    if (!credentials.email) {
      updatedErrors.email = "Email is required";
      formIsValid = false;
    }

    if (!credentials.password) {
      updatedErrors.password = "Password is required";
      formIsValid = false;
    }

    if (!formIsValid) {
      setErrors(updatedErrors);
      return;
    }

    try {
      const response = await api.post("/admin/login", credentials);
      const { token, adminId, firstName, lastName, role } = response.data;
      if (token) {
        login(token, {
          userId: adminId,
          firstName,
          lastName,
          email: credentials.email,
          role,
        });
        setAlert({ type: "success", content: "Login successful" });

        navigate("/admin/dashboard");
      } else {
        setAlert({ type: "error", content: "Invalid email or password" });
      }
    } catch (err) {
      setAlert({ type: "error", content: "Invalid email or password" });
    }
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="blue" textAlign="center">
          Admin Login
        </Header>

        {alert && <CustomMessage type={alert.type} content={alert.content} />}

        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Admin E-mail address"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              error={errors.email ? true : false}
            />
            {errors.email && (
              <span style={{ color: "red" }}>{errors.email}</span>
            )}

            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Admin Password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              error={errors.password ? true : false}
            />
            {errors.password && (
              <span style={{ color: "red" }}>{errors.password}</span>
            )}

            {/* Customize the color of the button */}
            <Button color="blue" fluid size="large" type="submit">
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          <Container style={{ marginBottom: 8 }}>
            Login as <b>Student?</b>{" "}
            <RouterLink to="/student/login">Click here</RouterLink>
          </Container>
          <Container style={{ marginBottom: 8 }}>
            Login as <b>Instructor?</b>{" "}
            <RouterLink to="/instructor/login">Click here</RouterLink>
          </Container>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default AdminLogin;
