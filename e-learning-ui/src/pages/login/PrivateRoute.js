import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const adminUrls = [
  "/admin/dashboard",
  "/admin/students",
  "/admin/students/:id",
  "/admin/instructors",
  "/admin/instructors/:id",
  "/admin/courses",
  "/admin/courses/create-course",
  "/admin/courses/:id/update-course",
  "/admin/courses/:id/details",
  "/admin/courses/:id/sections/create-section",
  "/admin/courses/:id/sections/:sectionId/update-section",
  "/admin/courses/:studentId/enroll-courses",
];

const studentUrls = [
  "/student/dashboard",
  "/student/profile",
  "/student/courses",
  "/student/courses/:courseId",
  "/student/:studentId/courses/enroll",
  "/student/courses/:courseId/details",
  "/student/courses/:sectionId/assignments",
  "/student/courses/:sectionId/grades",
];

const instructorUrls = [
  "/instructor/dashboard",
  "/instructor/courses",
  "/instructor/profile",
  "/instructor/courses/:sectionId",
  "/instructor/courses/:sectionId/assignments",
  "/instructor/courses/:sectionId/students",
  "/instructor/courses/:sectionId/students/:studentId/assignments",
  "/instructor/courses/:sectionId/assignments/new",
  "/instructor/courses/:sectionId/assignments/:assignmentId/update",
];

function PrivateRoute({ path, element: Component }) {
  const { isAuthenticated, isAdmin, isStudent, isInstructor } = useAuth();

  let hasAccess = false;
  if (adminUrls.includes(path)) {
    hasAccess = isAuthenticated() && isAdmin();
  } else if (studentUrls.includes(path)) {
    hasAccess = isAuthenticated() && isStudent();
  } else if (instructorUrls.includes(path)) {
    hasAccess = isAuthenticated() && isInstructor();
  }
  return <>{hasAccess ? <Component /> : <Navigate to="/access-denied" />}</>;
}

export default PrivateRoute;
