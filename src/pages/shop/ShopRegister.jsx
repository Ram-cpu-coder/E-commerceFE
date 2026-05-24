import React, { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  IoArrowForwardOutline,
  IoBusinessOutline,
  IoCardOutline,
  IoCheckmarkCircleOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { submitShopApplicationApi } from "../../features/shop/shopApi";

const initialForm = {
  shopName: "",
  description: "",
  businessCategory: "",
  businessType: "registered-business",
  contactEmail: "",
  phone: "",
  address: "",
  city: "",
  country: "Australia",
  taxId: "",
  registrationNumber: "",
  paymentProvider: "manual",
  payoutAccountName: "",
  payoutAccountEmail: "",
  payoutAccountId: "",
  bankName: "",
  bankAccountLast4: "",
  payoutCurrency: "AUD",
};

const applicationSteps = [
  {
    icon: <IoStorefrontOutline />,
    title: "Submit shop",
    copy: "Send business, owner, address, and payout details.",
  },
  {
    icon: <IoCheckmarkCircleOutline />,
    title: "Super Admin review",
    copy: "The platform checks payment readiness and business fit.",
  },
  {
    icon: <IoBusinessOutline />,
    title: "Shop goes live",
    copy: "Approval creates the shop and its Shop Admin account.",
  },
];

const currencyOptions = [
  ["AUD", "AUD - Australian Dollar"],
  ["USD", "USD - US Dollar"],
  ["EUR", "EUR - Euro"],
  ["GBP", "GBP - British Pound"],
  ["CAD", "CAD - Canadian Dollar"],
  ["NZD", "NZD - New Zealand Dollar"],
  ["JPY", "JPY - Japanese Yen"],
  ["SGD", "SGD - Singapore Dollar"],
  ["INR", "INR - Indian Rupee"],
  ["NPR", "NPR - Nepalese Rupee"],
  ["AED", "AED - UAE Dirham"],
];

const ShopRegister = () => {
  const { user } = useSelector((state) => state.userInfo);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const completion = useMemo(() => {
    const required = [
      "shopName",
      "address",
      "payoutAccountName",
      "payoutAccountEmail",
    ];
    const filled = required.filter((key) => String(form[key] || "").trim()).length;
    return Math.round((filled / required.length) * 100);
  }, [form]);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: name === "payoutCurrency" ? value.toUpperCase() : value,
    }));
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("Please log in before registering a shop.");
      return;
    }
    if (user.role === "admin" || user.role === "superadmin") {
      toast.error("This account already has elevated access.");
      return;
    }

    setSubmitting(true);
    const payload = {
      ...form,
      contactEmail: form.contactEmail || user.email,
      phone: form.phone || user.phone,
    };

    const result = await submitShopApplicationApi(payload);
    setSubmitting(false);
    toast[result.status || "error"](result.message || "Unable to submit shop registration.");
    if (result.status === "success") {
      setSubmitted(true);
      setForm(initialForm);
    }
  };

  return (
    <section className="shop-register-page">
      <div className="shop-register-hero">
        <div className="shop-register-copy">
          <p className="section-kicker">Marketplace onboarding</p>
          <h1>Register your shop and start selling on the platform</h1>
          <p>
            Create a shop application with owner details, business identity,
            operating address, and payout account information for Super Admin review.
          </p>
          <div className="shop-register-actions">
            <a href="#shop-application" className="shop-register-primary">
              Start application <IoArrowForwardOutline aria-hidden />
            </a>
            <Link to="/login" className="shop-register-secondary">
              Existing seller login
            </Link>
          </div>
        </div>

        <div className="shop-register-orbit" aria-hidden>
          <div className="shop-register-card3d">
            <span className="shop-register-card-icon"><IoStorefrontOutline /></span>
            <strong>{completion}%</strong>
            <small>application readiness</small>
          </div>
          <div className="shop-register-mini one">Payout</div>
          <div className="shop-register-mini two">Review</div>
          <div className="shop-register-mini three">Live</div>
        </div>
      </div>

      <div className="shop-register-flow">
        {applicationSteps.map((step) => (
          <div key={step.title} className="shop-register-step">
            <span>{step.icon}</span>
            <strong>{step.title}</strong>
            <p>{step.copy}</p>
          </div>
        ))}
      </div>

      <Form id="shop-application" className="shop-application-form" onSubmit={submitApplication}>
        <div className="shop-form-header">
          <div>
            <p className="section-kicker">Application form</p>
            <h2>Shop registration</h2>
          </div>
          <span>{completion}% complete</span>
        </div>

        {submitted && (
          <div className="shop-application-success">
            <IoCheckmarkCircleOutline aria-hidden />
            <strong>Application submitted</strong>
            <p>Super Admin will review the request and activate the shop if everything is ready.</p>
          </div>
        )}

        <div className="shop-form-section">
          <div className="shop-form-section-title">
            <IoStorefrontOutline aria-hidden />
            <span>Shop identity</span>
          </div>
          <div className="shop-form-grid">
            <Form.Group>
              <Form.Label>Shop name</Form.Label>
              <Form.Control name="shopName" value={form.shopName} onChange={updateField} placeholder="Example: Urban Home Studio" required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Business category</Form.Label>
              <Form.Control name="businessCategory" value={form.businessCategory} onChange={updateField} placeholder="Home decor, fashion, tech, wellness..." />
            </Form.Group>
            <Form.Group>
              <Form.Label>Business type</Form.Label>
              <Form.Select name="businessType" value={form.businessType} onChange={updateField}>
                <option value="registered-business">Registered business</option>
                <option value="sole-trader">Sole trader</option>
                <option value="creator-brand">Creator brand</option>
                <option value="distributor">Distributor</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Registration number</Form.Label>
              <Form.Control name="registrationNumber" value={form.registrationNumber} onChange={updateField} placeholder="ABN, ACN, or business registration ID" />
            </Form.Group>
            <Form.Group className="full-span">
              <Form.Label>Shop description</Form.Label>
              <Form.Control as="textarea" rows={4} name="description" value={form.description} onChange={updateField} placeholder="Tell us what the shop sells, who it serves, and what makes it reliable." />
            </Form.Group>
          </div>
        </div>

        <div className="shop-form-section">
          <div className="shop-form-section-title">
            <IoPersonOutline aria-hidden />
            <span>Owner account</span>
          </div>
          <div className="shop-owner-account-card">
            <span className="shop-owner-avatar">
              {user?.image ? (
                <img src={user.image} alt={user?.fName || "Owner"} />
              ) : (
                <IoPersonOutline aria-hidden />
              )}
            </span>
            <div className="shop-owner-copy">
              <div className="shop-owner-heading">
                <strong>
                  {[user?.fName, user?.lName].filter(Boolean).join(" ") ||
                    "Logged in account"}
                </strong>
                <small>{user?.email || "Email unavailable"}</small>
              </div>
              <p>
                This account becomes the Shop Admin after Super Admin approval.
              </p>
            </div>
          </div>
        </div>

        <div className="shop-form-section">
          <div className="shop-form-section-title">
            <IoLocationOutline aria-hidden />
            <span>Business location</span>
          </div>
          <div className="shop-form-grid">
            <Form.Group>
              <Form.Label>Contact email</Form.Label>
              <Form.Control type="email" name="contactEmail" value={form.contactEmail} onChange={updateField} placeholder="support@shop.com" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Shop phone</Form.Label>
              <Form.Control name="phone" value={form.phone} onChange={updateField} placeholder="+61 400 000 000" />
            </Form.Group>
            <Form.Group className="full-span">
              <Form.Label>Business address</Form.Label>
              <Form.Control name="address" value={form.address} onChange={updateField} placeholder="Street, building, suite, or warehouse address" required />
            </Form.Group>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control name="city" value={form.city} onChange={updateField} placeholder="Sydney" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Country</Form.Label>
              <Form.Control name="country" value={form.country} onChange={updateField} placeholder="Australia" />
            </Form.Group>
          </div>
        </div>

        <div className="shop-form-section">
          <div className="shop-form-section-title">
            <IoCardOutline aria-hidden />
            <span>Payout account</span>
          </div>
          <div className="shop-form-grid">
            <Form.Group>
              <Form.Label>Payment provider</Form.Label>
              <Form.Select name="paymentProvider" value={form.paymentProvider} onChange={updateField}>
                <option value="manual">Manual payout</option>
                <option value="stripe-connect">Stripe Connect</option>
                <option value="bank-transfer">Bank transfer</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Payout currency</Form.Label>
              <Form.Select name="payoutCurrency" value={form.payoutCurrency} onChange={updateField}>
                {currencyOptions.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Payout account name</Form.Label>
              <Form.Control name="payoutAccountName" value={form.payoutAccountName} onChange={updateField} placeholder="Legal account holder name" required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Payout email</Form.Label>
              <Form.Control type="email" name="payoutAccountEmail" value={form.payoutAccountEmail} onChange={updateField} placeholder="payout@shop.com" required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Payout account ID</Form.Label>
              <Form.Control name="payoutAccountId" value={form.payoutAccountId} onChange={updateField} placeholder="Stripe account ID or payout reference" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Bank name</Form.Label>
              <Form.Control name="bankName" value={form.bankName} onChange={updateField} placeholder="Bank or financial institution" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Bank last 4 digits</Form.Label>
              <Form.Control maxLength={4} name="bankAccountLast4" value={form.bankAccountLast4} onChange={updateField} placeholder="1234" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tax ID</Form.Label>
              <Form.Control name="taxId" value={form.taxId} onChange={updateField} placeholder="Optional tax reference" />
            </Form.Group>
          </div>
        </div>

        <div className="shop-form-submit">
          <span><IoCheckmarkCircleOutline aria-hidden /> Reviewed before activation</span>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit shop registration"}
          </Button>
        </div>
      </Form>
    </section>
  );
};

export default ShopRegister;
