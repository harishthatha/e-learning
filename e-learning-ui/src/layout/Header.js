import React from "react";
import { Link } from "react-router-dom";
import { Menu, Segment } from "semantic-ui-react";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, isAdmin, isStudent, isInstructor } = useAuth();
  const homeUrl = isAdmin()
    ? "/admin/dashboard"
    : isStudent()
    ? "/student/dashboard"
    : isInstructor()
    ? "/instructor/dashboard"
    : "/student/login";
  return (
    <Segment inverted secondary>
      <Menu fixed="top" inverted>
        <Menu.Item
          as={Link}
          to={homeUrl}
          header
          style={{
            border: "none",
            height: 60,
            fontSize: 25,
          }}
        >
          E-learning
        </Menu.Item>
        <Menu.Menu position="right">
          {isAuthenticated() ? (
            <>
              <Menu.Item as={Link} to="/logout" style={{ marginRight: 20 }}>
                Logout
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item
                as={Link}
                to="/student/register"
                style={{ marginRight: 20 }}
              >
                Register
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/student/login"
                style={{ marginRight: 20 }}
              >
                Login
              </Menu.Item>
            </>
          )}
        </Menu.Menu>
      </Menu>
    </Segment>
  );
};

export default Header;
