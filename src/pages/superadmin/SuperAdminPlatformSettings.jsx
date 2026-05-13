import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import { UserLayout } from "../../components/layouts/UserLayout";
import { getPlatformSettingsApi, updatePlatformSettingsApi } from "../../features/platform/platformApi";
import { setMenu } from "../../features/user/userSlice";
import { IoSettingsOutline } from "react-icons/io5";

const defaultSettings = {
  commissionRate: 8,
  payoutHoldDays: 7,
  lowStockThreshold: 30,
  defaultCurrency: "AUD",
  sellerApprovalMode: "manual",
  reviewModerationMode: "manual",
  allowShopSelfRegistration: true,
  requireVerifiedPayoutBeforeSelling: true,
};

const currencies = ["AUD", "USD", "EUR", "GBP", "CAD", "NZD", "JPY", "SGD", "INR", "NPR", "AED"];

const SuperAdminPlatformSettings = () => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(setMenu("Platform Settings"));
    const loadSettings = async () => {
      const result = await getPlatformSettingsApi();
      if (result.status === "success") {
        setSettings({ ...defaultSettings, ...(result.settings || {}) });
      }
    };
    loadSettings();
  }, [dispatch]);

  const updateField = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await updatePlatformSettingsApi(settings);
    setSaving(false);
    toast[result.status || "error"](result.message || "Unable to save settings.");
    if (result.status === "success") {
      setSettings({ ...defaultSettings, ...(result.settings || {}) });
    }
  };

  return (
    <UserLayout pageTitle="Platform Settings">
      <BreadCrumbsAdmin />
      <section className="platform-dashboard-page">
        <div className="platform-hero compact">
          <div>
            <p className="section-kicker">Rules and policy</p>
            <h1>Platform Settings</h1>
            <p>Control marketplace-wide commission, seller approval, payout holds, low stock thresholds, and review moderation policy.</p>
          </div>
          <div className="admin-customers-count">
            <IoSettingsOutline aria-hidden />
            <strong>{settings.commissionRate}%</strong>
            <span>commission</span>
          </div>
        </div>

        <Form className="platform-panel platform-settings-form" onSubmit={saveSettings}>
          <div className="shop-form-grid">
            <Form.Group>
              <Form.Label>Platform commission (%)</Form.Label>
              <Form.Control type="number" name="commissionRate" min="0" max="100" value={settings.commissionRate} onChange={updateField} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Payout hold days</Form.Label>
              <Form.Control type="number" name="payoutHoldDays" min="0" value={settings.payoutHoldDays} onChange={updateField} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Low stock threshold</Form.Label>
              <Form.Control type="number" name="lowStockThreshold" min="0" value={settings.lowStockThreshold} onChange={updateField} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Default currency</Form.Label>
              <Form.Select name="defaultCurrency" value={settings.defaultCurrency} onChange={updateField}>
                {currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Seller approval</Form.Label>
              <Form.Select name="sellerApprovalMode" value={settings.sellerApprovalMode} onChange={updateField}>
                <option value="manual">Manual review</option>
                <option value="auto">Auto approval</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Review moderation</Form.Label>
              <Form.Select name="reviewModerationMode" value={settings.reviewModerationMode} onChange={updateField}>
                <option value="manual">Manual moderation</option>
                <option value="auto">Auto approve</option>
              </Form.Select>
            </Form.Group>
            <div className="admin-form-switch full-span">
              <Form.Check type="switch" id="allowShopSelfRegistration" name="allowShopSelfRegistration" checked={settings.allowShopSelfRegistration} onChange={updateField} label="Allow public shop self-registration" />
            </div>
            <div className="admin-form-switch full-span">
              <Form.Check type="switch" id="requireVerifiedPayoutBeforeSelling" name="requireVerifiedPayoutBeforeSelling" checked={settings.requireVerifiedPayoutBeforeSelling} onChange={updateField} label="Require verified payout account before selling" />
            </div>
          </div>
          <div className="admin-form-actions">
            <Button type="submit" className="admin-form-primary" disabled={saving}>{saving ? "Saving..." : "Save Platform Settings"}</Button>
          </div>
        </Form>
      </section>
    </UserLayout>
  );
};

export default SuperAdminPlatformSettings;
