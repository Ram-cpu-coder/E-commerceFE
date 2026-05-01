import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { UserSidebar } from "./UserSidebar.jsx";
import { AuthRoute } from "../../routes/AuthRoutes.jsx";

export const UserLayout = ({ pageTitle = "default", children }) => {
  const { user } = useSelector((state) => state.userInfo);

  return (
    <AuthRoute>
      <div>
        <Container fluid>
          <Row>
            <Col
              md={3}
              xl={2}
              className="bg-dark text-light heightForSmallScreen"
              style={{ minHeight: "100vh" }}
            >
              <div className="p-3">
                <div>Welcome Back</div>
                <h3>{user?.fName + " " + user?.lName}</h3>
              </div>
              <hr />
              <UserSidebar />
            </Col>
            <Col
              md={9}
              xl={10}
              className="bg-light"
              style={{ minHeight: "100vh" }}
            >
              <div className="p-1">
                <h1>
                  <b>{pageTitle}</b>
                </h1>
              </div>
              <hr />
              <main className="main mb-3 position-relative">{children}</main>
            </Col>
          </Row>
        </Container>
      </div>
    </AuthRoute>
  );
};
