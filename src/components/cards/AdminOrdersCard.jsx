import React, { useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import { filterFunctionOrders } from "../../utils/filterProducts";
import ControlBar from "../ordersComponent/ControlBar";
import { useNavigate } from "react-router-dom";
import TopPart from "../ordersComponent/TopPart";
import ImageSection from "../ordersComponent/ImageSection";
import Actions from "../ordersComponent/Actions";

const AdminOrdersCard = ({ orders, user }) => {
  const [activeKey, setActiveKey] = useState(null);
  const [displayOrders, setDisplayOrders] = useState([]);
  const [isReviewing, setIsReviewing] = useState(null);
  const { form, handleOnChange } = useForm({
    searchQuery: "",
    status: "all",
    date: "newest",
  });

  const toggleAccordion = (key) => {
    setActiveKey((prev) => (prev === key ? null : key));
  };
  const handleToggleReview = (id) => {
    setIsReviewing((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    const data = orders?.docs || [];
    const response = filterFunctionOrders(form, data);
    setDisplayOrders(response);
  }, [form, orders]);

  return (
    <div className="w-100 d-flex flex-column gap-2">
      {/* controls bar */}
      <ControlBar form={form} handleOnChange={handleOnChange} />
      <hr />
      {displayOrders.length <= 0 && (
        <p className="text-center" style={{ minHeight: "80vh" }}>
          No orders here yet...
        </p>
      )}

      {displayOrders?.map((item, index) => {
        const key = item._id.toString();
        const isOpen = activeKey === key;
        return (
          <div className="position-relative m-2" style={{ cursor: "pointer" }}>
            <div className="d-flex flex-column w-100">
              <div
                className="justify-items-around align-items-center row w-100 orderAccordion"
                style={{ minHeight: "12rem" }}
              >
                <div className="d-flex flex-column gap-2 w-100 border p-2 rounded shadow ms-1">
                  <div className="d-flex flex-column gap-2 align-items-between w-100">
                    {/* status and the creation date  */}
                    <TopPart item={item} user={user} />

                    {/* images in the accordion header*/}
                    <ImageSection
                      item={item}
                      isOpen={isOpen}
                      toggleAccordion={toggleAccordion}
                    />
                    {/* total amounts and action buttons*/}
                    <Actions item={item} user={user} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminOrdersCard;
