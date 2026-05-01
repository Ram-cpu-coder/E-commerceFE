import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";

const TermsAndConditions = () => {
  const sections = [
    {
      number: "1",
      title: "General Information",
      content:
        "By accessing or using NEPASTORE, you agree to comply with these terms and all applicable laws. If you do not agree, please do not use our services.",
      icon: "📋",
    },
    {
      number: "2",
      title: "Account & Registration",
      content:
        "Users may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.",
      icon: "👤",
    },
    {
      number: "3",
      title: "Orders & Payment",
      content:
        "All orders are subject to product availability and confirmation of the order price. Payments are processed securely via our approved payment providers.",
      icon: "💳",
    },
    {
      number: "4",
      title: "Shipping & Delivery",
      content:
        "NEPASTORE aims to ship orders promptly. Delivery times are estimates and may vary due to factors outside our control, including courier delays.",
      icon: "🚚",
    },
    {
      number: "5",
      title: "Returns & Refunds",
      content:
        "Returns and refunds are subject to our Return Policy. Products must be returned in original condition within the specified timeframe for a refund or exchange.",
      icon: "↩️",
    },
    {
      number: "6",
      title: "User Responsibilities",
      content:
        "Users agree not to misuse the website, submit fraudulent orders, or engage in activities that could harm NEPASTORE, other users, or our systems.",
      icon: "⚠️",
    },
    {
      number: "7",
      title: "Intellectual Property",
      content:
        "All content, logos, graphics, and product images on NEPASTORE are owned by NEPASTORE or licensed to us. No content may be copied or used without explicit permission.",
      icon: "©️",
    },
    {
      number: "8",
      title: "Limitation of Liability",
      content:
        "NEPASTORE is not liable for any indirect, incidental, or consequential damages arising from the use of our website or products.",
      icon: "🛡️",
    },
    {
      number: "9",
      title: "Changes to Terms",
      content:
        "We may update these Terms & Conditions at any time. Updated terms will be posted on this page, and continued use of NEPASTORE constitutes acceptance of the new terms.",
      icon: "🔄",
    },
    {
      number: "10",
      title: "Contact Us",
      content:
        "For questions regarding these Terms & Conditions, please contact our support team via the Contact Page.",
      icon: "📧",
    },
  ];

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <div className="text-dark py-5">
        <Container className="text-center">
          <h1 className="display-4 fw-bold">Terms & Conditions</h1>
          <p className="lead">
            Welcome to <strong>NEPASTORE</strong>. Please read these terms and
            conditions carefully before using our website or making a purchase.
          </p>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-5">
        {/* Last Updated Badge */}
        <div className="d-flex justify-content-end mb-4">
          <Badge
            bg="light"
            text="dark"
            className="px-3 py-2 border border-secondary"
          >
            Last updated:{" "}
            <span className="fw-bold text-primary">January 2025w</span>
          </Badge>
        </div>

        {/* Terms Grid */}
        <Row xs={1} md={2} className="g-4">
          {sections.map((section, index) => (
            <Col key={index}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-start mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 text-white me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        background: "linear-gradient(45deg, #6610f2, #6f42c1)",
                        fontSize: "2.5rem",
                      }}
                    >
                      {section.icon}
                    </div>
                    <div>
                      <div className="d-flex align-items-center mb-2">
                        <Badge bg="secondary" className="me-2">
                          {section.number}
                        </Badge>
                        <Card.Title className="mb-0">
                          {section.title}
                        </Card.Title>
                      </div>
                      <Card.Text className="text-muted">
                        {section.content}
                      </Card.Text>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Important Notice Section */}
        <Card className="bg-warning bg-opacity-25 border-warning mt-5 shadow-sm">
          <Card.Body className="d-flex align-items-start">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 text-white me-3"
              style={{
                width: "50px",
                height: "50px",
                background: "linear-gradient(45deg, #ffb700, #ff8800)",
                fontSize: "1.5rem",
              }}
            >
              ⚡
            </div>
            <div>
              <Card.Title>Important Notice</Card.Title>
              <Card.Text className="text-dark">
                These Terms & Conditions constitute a legally binding agreement
                between you and NEPASTORE. By using our services, you
                acknowledge that you have read, understood, and agree to be
                bound by these terms. If you have any questions or concerns,
                please contact our support team.
              </Card.Text>
            </div>
          </Card.Body>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-4">
          <Button
            href="/about"
            className="me-2 mb-2"
            style={{
              background: "linear-gradient(45deg, #6610f2, #6f42c1)",
              border: "none",
            }}
          >
            Contact Support
          </Button>
          <Button href="/" variant="outline-primary" className="mb-2">
            Back to Home
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default TermsAndConditions;
