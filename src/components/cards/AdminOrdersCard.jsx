import React, { useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import { filterFunctionOrders } from "../../utils/filterProducts";
import ControlBar from "../ordersComponent/ControlBar";
import TopPart from "../ordersComponent/TopPart";
import ImageSection from "../ordersComponent/ImageSection";
import Actions from "../ordersComponent/Actions";

const AdminOrdersCard = ({ orders, user }) => {
  const [activeKey, setActiveKey] = useState(null);
  const [displayOrders, setDisplayOrders] = useState([]);
  const { form, handleOnChange } = useForm({
    searchQuery: "",
    status: "all",
    date: "newest",
  });

  const toggleAccordion = (key) => {
    setActiveKey((prev) => (prev === key ? null : key));
  };
  useEffect(() => {
    const data = orders?.docs || [];
    const response = filterFunctionOrders(form, data);
    setDisplayOrders(response);
  }, [form, orders]);

  return (
    <div className="orders-list-shell">
      {/* controls bar */}
      <ControlBar form={form} handleOnChange={handleOnChange} />
      {displayOrders.length <= 0 && (
        <div className="orders-empty-state">
          <strong>No orders here yet</strong>
          <span>Orders will appear here once purchases are placed.</span>
        </div>
      )}

      <div className="orders-list">
      {displayOrders?.map((item) => {
        const key = item._id.toString();
        const isOpen = activeKey === key;
        return (
          <article className="order-card" key={item._id}>
            <TopPart item={item} user={user} />
            <ImageSection
              item={item}
              isOpen={isOpen}
              toggleAccordion={toggleAccordion}
            />
            <Actions item={item} user={user} />
          </article>
        );
      })}
      </div>
    </div>
  );
};

export default AdminOrdersCard;
