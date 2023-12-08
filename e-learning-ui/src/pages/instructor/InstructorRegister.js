import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  Form,
  Grid,
  Header,
  Message,
} from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import CustomMessage from "../../layout/CustomMessage";

const InstructorRegister = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showValidations, setShowValidations] = useState(false);
  const [message, setMessage] = useState({
    content: "",
    type: "",
  });
  const [departmentsList, setDepartmentsList] = useState([]);
  const [openMessage, setOpenMessage] = useState(false);
  const [department, setDepartment] = useState("");

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/categories");
      setDepartmentsList(response.data);
    } catch (err) {
      console.log("Error fetching departments: " + err.message);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleRegister = async () => {
    setShowValidations(true);

    // Check if all required fields are filled
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      phone === "" ||
      password === "" ||
      confirmPassword === "" ||
      department === ""
    ) {
      setMessage({
        content: "All fields are required.",
        type: "error",
      });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage({
        content: "Passwords do not match.",
        type: "error",
      });
      return;
    }

    try {
      // Send registration data to the server
      await api.post("/instructors", {
        firstName,
        lastName,
        email,
        phone,
        password,
        departmentId: department,
      });

      setMessage({
        content: "Registration successful. Please log in.",
        type: "success",
      });
      setOpenMessage(true);
      setTimeout(() => {
        navigate("/instructor/login");
      }, 1500);
    } catch (error) {
      setMessage({
        content: error?.response?.data || "Registration failed.",
        type: "error",
      });
      console.error(error);
    }
  };

  return (
    <div>
      <Grid textAlign="center" verticalAlign="middle" style={{ marginTop: 40 }}>
        <Grid.Column style={{ maxWidth: 450 }}>
          {openMessage && (
            <CustomMessage
              type={message.type}
              content={message.content}
              width="100%"
              marginBottom={12}
            />
          )}
          <Header as={"h1"}>Instructor Sign up</Header>
          <Form
            error={message !== ""}
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <Form.Field>
              <Form.Input
                fluid
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={showValidations && firstName === ""}
              />
            </Form.Field>
            {showValidations && firstName === "" && (
              <p style={{ color: "red" }}>First Name is required</p>
            )}
            <Form.Field>
              <Form.Input
                fluid
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={showValidations && lastName === ""}
              />
            </Form.Field>
            {showValidations && lastName === "" && (
              <p style={{ color: "red" }}>Last Name is required</p>
            )}
            <Form.Field>
              <Form.Input
                fluid
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={showValidations && email === ""}
              />
            </Form.Field>
            {showValidations && email === "" && (
              <p style={{ color: "red" }}>Email is required</p>
            )}
            <Form.Field>
              <Form.Input
                fluid
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={showValidations && phone === ""}
              />
            </Form.Field>
            {showValidations && phone === "" && (
              <p style={{ color: "red" }}>Phone is required</p>
            )}
            <Form.Field>
              <Dropdown
                fluid
                placeholder="Select Department"
                selection
                options={departmentsList.map((department) => ({
                  key: department.categoryId,
                  text: department.name,
                  value: department.categoryId,
                }))}
                value={department}
                onChange={(_, { value }) => setDepartment(value)}
                error={showValidations && department === ""}
              />
            </Form.Field>
            {showValidations && department === "" && (
              <p style={{ color: "red" }}>Department is required</p>
            )}
            <Form.Field>
              <Form.Input
                fluid
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={showValidations && password === ""}
              />
            </Form.Field>
            {showValidations && password === "" && (
              <p style={{ color: "red" }}>Password is required</p>
            )}
            <Form.Field>
              <Form.Input
                fluid
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={
                  showValidations &&
                  (confirmPassword === "" || password !== confirmPassword)
                }
              />
            </Form.Field>
            {showValidations &&
              (confirmPassword === "" || password !== confirmPassword) && (
                <p style={{ color: "red" }}>Passwords do not match</p>
              )}
            <Button
              fluid
              type="submit"
              size="large"
              color="teal"
              style={{ borderRadius: "3", textTransform: "none" }}
            >
              Register
            </Button>
            <p>
              Already have an account?{" "}
              <Link to="/instructor/login">Login here</Link>
            </p>
            <p>
              <Link to="/student/register">Register as a student here</Link>
            </p>
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default InstructorRegister;
