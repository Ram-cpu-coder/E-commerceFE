import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UserLayout } from "../../components/layouts/UserLayout";
import { setMenu } from "../../features/user/userSlice.js";
import SmartDashboard from "./SmartDashboard.jsx";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin.jsx";
import { fetchUserAction } from "../../features/user/userAction.js";
import { RiRobot3Line } from "react-icons/ri";
import TopBar from "./TopBar.jsx";
import MidPart from "./MidPart.jsx";
import RecentActivities from "./RecentActivities.jsx";
import Skeleton from "@mui/material/Skeleton";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [smartDashboard, setSmartDashboard] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserAction());
      setLoading(false);
    };

    dispatch(setMenu("Dashboard"));
    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="dashboard-skeleton">
        <Skeleton variant="rounded" height={150} />
        <div className="dashboard-skeleton-grid">
          <Skeleton variant="rounded" height={160} />
          <Skeleton variant="rounded" height={160} />
          <Skeleton variant="rounded" height={160} />
        </div>
        <Skeleton variant="rounded" height={360} />
      </div>
    );
  }

  return (
    <UserLayout pageTitle="Smart Dashboard">
      <BreadCrumbsAdmin />

      {/* <SmartDashboard /> */}
      <div className="dashboard-grid-shell">
        <section className="dashboard-hero">
          <div>
            <p className="section-kicker">Store command center</p>
            <h2>Sales, customers, and activity at a glance</h2>
            <p>
              Monitor weekly revenue, demand patterns, customer growth, and the
              latest operational updates from one focused workspace.
            </p>
          </div>
        </section>
        {/* Top Bar */}
        <TopBar />
        <MidPart />
        <RecentActivities />
      </div>

      {/* smart dashboard */}
      <div
        className="dashboard-ai-button"
        onClick={() => setSmartDashboard(!smartDashboard)}
        title="AI Powered Chat Assistance"
      >
        <RiRobot3Line />
      </div>

      {smartDashboard && (
        <SmartDashboard
          setSmartDashboard={setSmartDashboard}
          smartDashboard={smartDashboard}
        />
      )}
    </UserLayout>
  );
};

export default Dashboard;
