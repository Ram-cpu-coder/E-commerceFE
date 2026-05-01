import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserLayout } from "../../components/layouts/UserLayout";
import { setMenu } from "../../features/user/userSlice.js";
import SmartDashboard from "./SmartDashboard.jsx";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin.jsx";
import { fetchUserAction } from "../../features/user/userAction.js";
import { RiRobot3Line } from "react-icons/ri";
import TopBar from "./TopBar.jsx";
import MidPart from "./MidPart.jsx";
import RecentActivities from "./RecentActivities.jsx";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [smartDashboard, setSmartDashboard] = useState(false);

  const { user } = useSelector((state) => state.userInfo);
  console.log(user, 9999);

  const fetchData = async () => {
    await dispatch(fetchUserAction());
    setLoading(false);
  };

  console.log(user, 3333);
  useEffect(() => {
    dispatch(setMenu("Dashboard"));
    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center" style={{ minHeight: "100vh" }}>
        Loading...
      </div>
    );
  }

  return (
    <UserLayout pageTitle="Smart Dashboard">
      <BreadCrumbsAdmin />

      {/* <SmartDashboard /> */}
      <div className="w-100">
        {/* Top Bar */}
        <TopBar />
        <MidPart />
        <RecentActivities />
      </div>

      {/* smart dashboard */}
      <div
        className="position-fixed border rounded-circle fs-3 px-2 bg-dark text-white"
        style={{ bottom: "10px", right: "10px", cursor: "pointer" }}
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
