import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="app-footer pt-4 pb-3 mt-5">
      <Container className="d-flex align-items-center flex-column">
        <Row className="d-flex justify-content-between col-12 g-4">
          <Col md={3} className="mb-2 mb-md-0">
            <h5 className="fw-bold mb-3">NEPASTORE</h5>

            <p className="text-muted small lh-lg mb-3">
              Welcome to <strong>NEPASTORE</strong> — where style meets
              sustainability. From a small dream to a global movement, we&apos;re
              redefining fashion with a purpose.
            </p>
            <div className="d-flex gap-3 align-items-center">
              <a
                href="https://facebook.com"
                className="text-secondary fs-5"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                className="text-secondary fs-5"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://tiktok.com"
                className="text-secondary fs-5"
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok />
              </a>
            </div>
          </Col>

          <Col md={3}>
            <h6 className="fw-semibold mb-3">Legal</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/terms" className="text-decoration-none">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li className="mb-2">
                <a href="/promo-terms" className="text-decoration-none">
                  Promotion Terms
                </a>
              </li>
              <li className="mb-2">
                <a href="/privacy" className="text-decoration-none">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="/cookies" className="text-decoration-none">
                  Cookie Settings
                </a>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="fw-semibold mb-3">About</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/about" className="text-decoration-none">
                  About Us
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="fw-semibold mb-3">Shop</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="/store-locator" className="text-decoration-none">
                  Store Locator
                </a>
              </li>
              <li className="mb-2">
                <a href="/gift-cards" className="text-decoration-none">
                  Gift Cards &amp; Balance
                </a>
              </li>
              <li className="mb-2">
                <a href="/click-collect" className="text-decoration-none">
                  Click &amp; Collect
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4 w-100 opacity-25" />

        <Row>
          <Col className="text-center text-muted small">
            © {new Date().getFullYear()} NepaStore. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
