import React, { useEffect, useRef, useState } from "react";
import { FiShare2 } from "react-icons/fi";
import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const ShareProduct = () => {
  const shareRef = useRef();
  const [isSharing, setIsSharing] = useState(false);
  const currentUrl = window.location.href;

  useEffect(() => {
    if (isSharing) return;
    const handleClickOutside = (e) => {
      if (shareRef && !shareRef.current.contains(e.target)) {
        setIsSharing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shareRef, setIsSharing]);

  return (
    <>
      <div
        className="position-absolute fs-3 p-3 shareButton"
        style={{ top: "2%", right: "5%", cursor: "pointer" }}
        onClick={() => setIsSharing(!isSharing)}
        ref={shareRef}
      >
        <FiShare2 />
        <div className="position-relative">
          {isSharing && (
            <div
              className="position-absolute border d-flex flex-column"
              style={{ top: "3%", right: "-50%" }}
            >
              <FacebookShareButton url={currentUrl} title="Facebook">
                <FacebookIcon size={32} round className="social-icon" />
              </FacebookShareButton>
              <FacebookMessengerShareButton url={currentUrl} title="">
                <FacebookMessengerIcon
                  size={32}
                  round
                  className="social-icon"
                />
              </FacebookMessengerShareButton>
              <WhatsappShareButton url={currentUrl} title="">
                <WhatsappIcon size={32} round className="social-icon" />
              </WhatsappShareButton>
              <TelegramShareButton url={currentUrl} title="">
                <TelegramIcon size={32} round className="social-icon" />
              </TelegramShareButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShareProduct;
