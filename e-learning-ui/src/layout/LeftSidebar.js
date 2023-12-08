import React from "react";
import { Icon, Menu, Sidebar } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LeftSidebar = () => {
  const { isAdmin, isStudent, isInstructor, user } = useAuth();
  return (
    <div style={{ top: "50px" }}>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible={true}
        width="thin"
        style={{
          position: "fixed",
          bottom: 0,
          top: "60px",
          height: "calc(100vh - 60px)",
        }}
      >
        {isStudent() && (
          <>
            <Menu.Item
              as={Link}
              to="/student/courses"
              style={{ marginRight: 20 }}
            >
              <Icon name="book" />
              Courses
            </Menu.Item>
            <Menu.Item
              as={Link}
              to={`/student/${user?.userId}/courses/enroll`}
              style={{ marginRight: 20 }}
            >
              <Icon name="book" />
              Enroll Courses
            </Menu.Item>
          </>
        )}
        {isAdmin() && (
          <>
            <Menu.Item
              as={Link}
              to="/admin/courses"
              style={{ marginRight: 20 }}
            >
              <Icon name="book" />
              Courses
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/admin/students"
              style={{ marginRight: 20 }}
            >
              <Icon name="users" />
              Students
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/admin/instructors"
              style={{ marginRight: 20 }}
            >
              <Icon name="users" />
              Instructors
            </Menu.Item>
          </>
        )}
        {isInstructor() && (
          <>
            <Menu.Item
              as={Link}
              to="/instructor/courses"
              style={{ marginRight: 20 }}
            >
              <Icon name="book" />
              Courses
            </Menu.Item>
            {/* <Menu.Item
              as={Link}
              to="/instructor/profile"
              style={{ marginRight: 20 }}
            >
              <Icon name="users" />
              Account
            </Menu.Item> */}
            {/* <Menu.Item
              as={Link}
              to="/admin/instructors"
              style={{ marginRight: 20 }}
            >
              <Icon name="users" />
              Instructors
            </Menu.Item> */}
          </>
        )}
      </Sidebar>
    </div>
  );
};

export default LeftSidebar;
