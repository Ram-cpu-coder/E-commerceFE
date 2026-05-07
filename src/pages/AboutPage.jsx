import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { toast } from "react-toastify";

const team = [
  {
    name: "Jane Doe",
    title: "Founder & CEO",
    img: "./profile/1.jpg",
    delay: 100,
  },
  {
    name: "John Smith",
    title: "Head of Development",
    img: "./profile/2.jpg",
    delay: 200,
  },
  {
    name: "Sarah Lee",
    title: "Creative Director",
    img: "./profile/3.jpg",
    delay: 300,
  },
];

const AboutPage = () => {
  const inquiryURL = import.meta.env.VITE_BACKEND_BASE_URL + "/inquiry";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target; // get the field name and value
    setFormData((prev) => ({
      ...prev,
      [name]: value, // update only the changed field
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation before hitting backend
    if (formData.message.trim().length < 10) {
      toast.error("Message should be at least 10 characters long.");
      setLoading(false);
      return;
    }

    try {
      const obj = {
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim(),
        customer_message: formData.message.trim(),
      };

      const response = await axios.post(inquiryURL, obj, {
        headers: { "Content-Type": "application/json" },
      });

      // Check for valid response
      if (
        (response.status !== 200 && response.status !== 201) ||
        response.data?.status === "error"
      ) {
        toast.error(
          response.data?.message || "Form could not be submitted. Try again later."
        );
        return;
      }

      toast.success(response.data?.message || "Message sent successfully.");
    } catch (error) {
      console.error(
        "❌ Submission error:",
        error.response?.data || error.message
      );

      // More user-friendly feedback
      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Invalid form data.");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setFormData({ name: "", email: "", message: "" });
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section className="about-section about-page">
      <Container className="about-container">
        {/* Hero Section */}
        <Row className="align-items-center about-hero">
          <Col lg={6} data-aos="fade-right" className="my-2">
            <p className="section-kicker">Built for better shopping</p>
            <h1 className="display-3 fw-bold">NEPASTORE</h1>
            <p className="lead text-muted">
              Welcome to <strong>NEPASTORE</strong> — your go-to destination for
              curated fashion, home essentials, and lifestyle products. We bring
              quality, affordability, and style together under one roof.
            </p>
            <Button className="btn-luxe rounded-pill px-4 py-3" href="/shop" size="lg">
              Browse Our Collections
            </Button>
          </Col>
          <Col lg={6} data-aos="zoom-in">
            <div className="about-hero-image">
              <Image src="./Logo.png" alt="NEPASTORE Story" fluid />
            </div>
          </Col>
        </Row>

        {/* Mission & Vision */}
        <Row className="text-center mb-5 g-4">
          <Col
            md={6}
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-center"
          >
            <div className="about-feature-card">
              <h3 className="mb-3">Our Mission</h3>
              <p className="text-muted">
                To make online shopping seamless, enjoyable, and accessible,
                offering products that delight every customer.
              </p>
            </div>
          </Col>
          <Col
            md={6}
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-center"
          >
            <div className="about-feature-card">
              <h3 className="mb-3">Our Vision</h3>
              <p className="text-muted">
                To become the most trusted e-commerce platform in our community,
                where quality, service, and variety are unmatched.
              </p>
            </div>
          </Col>
        </Row>

        {/* Values */}
        <Row className="mb-5">
          <Col>
            <h2 className="text-center mb-4 app-section-title" data-aos="fade-up">
              Our Values
            </h2>
            <Row className="text-center g-4">
              {[
                { title: "Quality", text: "Premium products at great value" },
                {
                  title: "Customer First",
                  text: "Your satisfaction is our priority",
                },
                { title: "Variety", text: "Wide selection across categories" },
                {
                  title: "Reliability",
                  text: "Fast, secure, and hassle-free delivery",
                },
              ].map((value, idx) => (
                <Col
                  md={3}
                  xs={6}
                  className="mb-4"
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className="value-card h-100">
                    <h5>{value.title}</h5>
                    <p className="text-muted small">{value.text}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="mb-5">
          <h2 className="text-center mb-4 app-section-title" data-aos="fade-up">
            Meet the Team
          </h2>
          {team.map((member, idx) => (
            <Col
              md={4}
              className="text-center mb-4 about-team-card"
              key={idx}
              data-aos="fade-up"
              data-aos-delay={member.delay}
            >
              <Image
                src={member.img}
                alt={`${member.name} - ${member.title}`}
                roundedCircle
                className="mb-3 shadow"
              />
              <h5>{member.name}</h5>
              <p className="text-muted small">{member.title}</p>
            </Col>
          ))}
        </Row>

        {/* Testimonials */}
        <Row className="mb-5">
          <h2 className="text-center mb-4 app-section-title" data-aos="fade-up">
            What Our Customers Say
          </h2>
          <Col md={6} data-aos="fade-right">
            <blockquote className="blockquote text-center about-quote">
              <p className="mb-0">
                "NEPASTORE makes shopping online so easy! I love the product
                variety and fast delivery."
              </p>
              <footer className="blockquote-footer mt-2">
                A Satisfied Customer
              </footer>
            </blockquote>
          </Col>
          <Col md={6} data-aos="fade-left">
            <blockquote className="blockquote text-center about-quote">
              <p className="mb-0">
                "The quality of the items I ordered exceeded my expectations.
                Highly recommend NEPASTORE!"
              </p>
              <footer className="blockquote-footer mt-2">Happy Shopper</footer>
            </blockquote>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row className="text-center mb-5">
          <Col data-aos="zoom-in">
            <h3 className="mb-3">Ready to find your next favorite item?</h3>
            <Button className="btn-luxe rounded-pill px-5 py-3" size="lg" href="/shop">
              Shop Now
            </Button>
          </Col>
        </Row>

        {/* Contact Form */}
        <Row className="justify-content-center mb-5">
          <Col md={8} lg={6} data-aos="zoom-in">
            <div className="about-contact-card">
              <h3 className="text-center mb-4">Get in Touch</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMessage">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="text-center">
                  <Button
                    className="btn-luxe rounded-pill px-5"
                    type="submit"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Submitting" : "Send Message"}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutPage;
