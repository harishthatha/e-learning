import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./layout/Layout";
import PrivateRoute from "./pages/login/PrivateRoute";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Logout from "./pages/login/Logout";
import Login from "./pages/login/Login";
import AccessDenied from "./pages/login/AccessDenied";
import AdminLogin from "./admin/AdminLogin";
import InstructorLogin from "./pages/instructor/InstructorLogin";
import NotFound from "./layout/NotFound";
import AdminDashboard from "./admin/AdminDashboard";
import AdminCourseList from "./admin/AdminCourseList";
import CreateCourse from "./admin/CreateCourse";
import UpdateCourse from "./admin/UpdateCourse";
import AdminCourseDetails from "./admin/AdminCourseDetails";
import CreateSection from "./admin/CreateSection";
import UpdateSection from "./admin/UpdateSection";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import CourseEnrollmentList from "./admin/CourseEnrollmentList";
import { RouteProvider } from "./contexts/RouteProvider";
import InstructorCourseList from "./pages/instructor/InstructorCourseList";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourseDetails from "./pages/instructor/InstructorCourseDetails";
import SectionAssignments from "./pages/instructor/SectionAssignments";
import CreateAssignment from "./pages/instructor/CreateAssignment";
import UpdateAssignment from "./pages/instructor/UpdateAssignment";
import EnrolledStudentsList from "./pages/instructor/EnrolledStudentsList";
import AssignmentList from "./pages/instructor/AssignmentList";
import StudentCourseDetails from "./pages/student/StudentCourseDetails";
import StudentAssignmentList from "./pages/student/StudentAssignmentList";
import GradesList from "./pages/student/GradesList";
import InstructorStudentGradesList from "./pages/instructor/InstructorStudentGradesList";
import AdminStudentsList from "./admin/AdminStudentsList";
import InstructorList from "./admin/InstructorList";

function App() {
  return (
    <AuthProvider>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgb(242, 242, 242)", // Transparent light gray color
        }}
      >
        <Router>
          <Layout>
            <Routes>
              <Route exact path="/student/login" element={<Login />} />
              <Route exact path="/logout" element={<Logout />} />
              <Route exact path="/student/register" element={<Register />} />

              <Route
                exact
                path="/student/dashboard"
                element={
                  <PrivateRoute
                    path="/student/dashboard"
                    element={StudentDashboard}
                  />
                }
              />

              <Route
                exact
                path="/student/courses"
                element={
                  <PrivateRoute
                    path="/student/courses"
                    element={StudentCourses}
                  />
                }
              />
              <Route
                exact
                path="/student/courses/:courseId"
                element={
                  <PrivateRoute
                    path="/student/courses/:courseId"
                    element={StudentDashboard}
                  />
                }
              />
              <Route
                exact
                path="/student/courses/:courseId/details"
                element={
                  <PrivateRoute
                    path="/student/courses/:courseId/details"
                    element={StudentCourseDetails}
                  />
                }
              />

              <Route
                exact
                path="/student/courses/:sectionId/assignments"
                element={
                  <PrivateRoute
                    path="/student/courses/:sectionId/assignments"
                    element={StudentAssignmentList}
                  />
                }
              />
              <Route
                exact
                path="/student/courses/:sectionId/grades"
                element={
                  <PrivateRoute
                    path="/student/courses/:sectionId/grades"
                    element={GradesList}
                  />
                }
              />
              <Route
                exact
                path="/student/:studentId/courses/enroll"
                element={
                  <PrivateRoute
                    path="/student/:studentId/courses/enroll"
                    element={CourseEnrollmentList}
                  />
                }
              />

              <Route
                exact
                path="/student/profile"
                element={
                  <PrivateRoute
                    path="/student/profile"
                    element={StudentDashboard}
                  />
                }
              />

              <Route exact path="/admin/login" element={<AdminLogin />} />
              <Route
                exact
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />

              <Route
                exact
                path="/admin/courses"
                element={
                  <PrivateRoute
                    path="/admin/courses"
                    element={AdminCourseList}
                  />
                }
              />
              <Route
                exact
                path="/admin/students"
                element={
                  <PrivateRoute
                    path="/admin/students"
                    element={AdminStudentsList}
                  />
                }
              />
              <Route
                exact
                path="/admin/courses/:studentId/enroll-courses"
                element={
                  <PrivateRoute
                    path="/admin/courses/:studentId/enroll-courses"
                    element={CourseEnrollmentList}
                  />
                }
              />
              <Route
                exact
                path="/admin/instructors"
                element={
                  <PrivateRoute
                    path="/admin/instructors"
                    element={InstructorList}
                  />
                }
              />
              <Route
                exact
                path="/admin/courses/create-course"
                element={
                  <PrivateRoute
                    path="/admin/courses/create-course"
                    element={CreateCourse}
                  />
                }
              />

              <Route
                exact
                path="/admin/courses/:id/update-course"
                element={
                  <PrivateRoute
                    path="/admin/courses/:id/update-course"
                    element={UpdateCourse}
                  />
                }
              />

              <Route
                exact
                path="/admin/courses/:id/details"
                element={
                  <PrivateRoute
                    path="/admin/courses/:id/details"
                    element={AdminCourseDetails}
                  />
                }
              />
              <Route
                exact
                path="/admin/courses/:id/sections/create-section"
                element={
                  <PrivateRoute
                    path="/admin/courses/:id/sections/create-section"
                    element={CreateSection}
                  />
                }
              />
              <Route
                exact
                path="/admin/courses/:id/sections/:sectionId/update-section"
                element={
                  <PrivateRoute
                    path="/admin/courses/:id/sections/:sectionId/update-section"
                    element={UpdateSection}
                  />
                }
              />
              <Route
                exact
                path="/instructor/login"
                element={<InstructorLogin />}
              />

              <Route
                exact
                path="/instructor/dashboard"
                element={
                  <PrivateRoute
                    path="/instructor/dashboard"
                    element={InstructorDashboard}
                  />
                }
              />
              <Route
                exact
                path="/instructor/courses"
                element={
                  <PrivateRoute
                    path="/instructor/courses"
                    element={InstructorCourseList}
                  />
                }
              />

              <Route
                exact
                path="/instructor/courses/:sectionId"
                element={
                  <PrivateRoute
                    path="/instructor/courses/:sectionId"
                    element={InstructorCourseDetails}
                  />
                }
              />
              <Route
                exact
                path="/instructor/courses/:sectionId/assignments"
                element={
                  <PrivateRoute
                    path="/instructor/courses/:sectionId/assignments"
                    element={SectionAssignments}
                  />
                }
              />
              <Route
                exact
                path="/instructor/courses/:sectionId/students"
                element={
                  <PrivateRoute
                    path="/instructor/courses/:sectionId/students"
                    element={EnrolledStudentsList}
                  />
                }
              />

              <Route
                exact
                path="/instructor/courses/:sectionId/students/:studentId/assignments"
                element={
                  <PrivateRoute
                    path="/instructor/courses/:sectionId/students/:studentId/assignments"
                    element={InstructorStudentGradesList}
                  />
                }
              />

              <Route
                exact
                path="/instructor/courses/:sectionId/assignments/new"
                element={
                  <PrivateRoute
                    path="/instructor/courses/:sectionId/assignments/new"
                    element={CreateAssignment}
                  />
                }
              />
              <Route
                exact
                path="/instructor/courses/:sectionId/assignments/:assignmentId/update"
                element={
                  <PrivateRoute
                    path="/instructor/courses/:sectionId/assignments/:assignmentId/update"
                    element={UpdateAssignment}
                  />
                }
              />
              <Route
                exact
                path="/instructor/profile"
                element={
                  <PrivateRoute path="/instructor/profile" element={Profile} />
                }
              />

              <Route exact path="/access-denied" element={<AccessDenied />} />
              <Route exact path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
