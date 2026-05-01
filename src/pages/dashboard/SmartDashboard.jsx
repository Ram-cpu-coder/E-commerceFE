import React, { useEffect, useRef, useState } from "react";
import { chatApi } from "./chatapi";
import MyChart from "../../Charts/MyChart";
import { Modal } from "react-bootstrap";

const SmartDashboard = ({ smartDashboard, setSmartDashboard }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const chatBoxRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("smartMessages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            from: "bot",
            type: "text",
            text: "Hi Admin 👋, ask me anything about your store!",
          },
        ];
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("smartMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "admin", type: "text", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await chatApi(input);

      let botMessage;

      if (res.type === "chart") {
        botMessage = {
          from: "bot",
          type: "chart",
          chartType: res.chartType,
          labels: res.labels,
          values: res.values,
          explanation: res.explanation,
        };
      } else {
        botMessage = {
          from: "bot",
          type: "text",
          text: res.data || res.text || "No response received.",
        };
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          type: "text",
          text: "Something went wrong while fetching the response.",
        },
      ]);
    }
  };

  return (
    <Modal show={smartDashboard} onHide={() => setSmartDashboard(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Chat Bot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div ref={chatBoxRef} style={styles.chatBox}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                alignSelf: msg.from === "admin" ? "flex-end" : "flex-start",
                background: msg.from === "admin" ? "#dcf8c6" : "#f1f0f0",
              }}
            >
              {msg.type === "text" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                  style={{ fontSize: "14px" }}
                />
              ) : msg.type === "chart" ? (
                <div style={{ maxWidth: "100%" }}>
                  <div
                    dangerouslySetInnerHTML={{ __html: msg.explanation }}
                    style={{ fontSize: "14px", marginBottom: "10px" }}
                  />
                  <MyChart
                    type={msg.chartType}
                    labels={msg.labels}
                    values={msg.values}
                  />
                </div>
              ) : (
                <span>{msg.text}</span>
              )}
            </div>
          ))}
        </div>
        <div style={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.button}>
            Send
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const styles = {
  chatBox: {
    flex: 1, // takes all remaining height above input
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  inputArea: {
    height: "70px",
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
    backgroundColor: "#fff",
    position: "sticky", // or "absolute" if preferred
    bottom: 0,
    width: "100%",
    zIndex: 10,
  },

  message: {
    padding: "10px 15px",
    borderRadius: "20px",
    maxWidth: "75%",
    fontSize: "14px",
    wordWrap: "break-word",
    whiteSpace: "pre-wrap",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    marginRight: "10px",
    fontSize: "14px",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default SmartDashboard;
