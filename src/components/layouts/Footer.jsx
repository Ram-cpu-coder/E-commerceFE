import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="pt-2 pb-2">
      <Container className="d-flex align-items-center flex-column">
        <Row className="d-flex justify-content-between col-12">
          <Col md={3} className="mb-3">
            <h5 className="fw-bold">NEPASTORE</h5>

            <p className="text-muted" style={{ fontSize: "14px" }}>
              Welcome to <strong>NEPASTORE</strong> — where style meets
              sustainability. From a small dream to a global movement, we're
              redefining fashion with a purpose.
            </p>
            <div className="d-flex gap-3 align-items-center">
              <a href="https://facebook.com" className="text-dark fs-5">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" className="text-dark fs-5">
                <FaInstagram />
              </a>
              <a href="https://tiktok.com" className="text-dark fs-5">
                <FaTiktok />
              </a>
            </div>
          </Col>

          <Col md={3}>
            <h6 className="fw-semibold mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/terms" className="text-decoration-none text-dark">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/promo-terms"
                  className="text-decoration-none text-dark"
                >
                  Promotion Terms
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-decoration-none text-dark">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-decoration-none text-dark">
                  Cookie Settings
                </a>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="fw-semibold mb-3">About</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-decoration-none text-dark">
                  About Us
                </a>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="fw-semibold mb-3">Shop</h6>
            <ul className="list-unstyled">
              <li>
                <a
                  href="/store-locator"
                  className="text-decoration-none text-dark"
                >
                  Store Locator
                </a>
              </li>
              <li>
                <a
                  href="/gift-cards"
                  className="text-decoration-none text-dark"
                >
                  Gift Cards & Balance
                </a>
              </li>
              <li>
                <a
                  href="/click-collect"
                  className="text-decoration-none text-dark"
                >
                  Click & Collect
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4 w-100" />

        <Row>
          <Col className="text-center text-muted">
            © {new Date().getFullYear()} NepaStore. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
