import React, { useState } from "react";
import { toast } from "react-hot-toast";
import useIsMobile from "./useIsMobile";
import styles from "../components/DiolougeBox.module.css"; // Import CSS Module
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
  FaGithub,
  FaLinkedin,
  FaLink,
} from "react-icons/fa";

import copy from "../assets/copy.png";
import remove from "../assets/delete.png";
import axios from "axios";

export default function DiolougeBox({
  onClose,
  onAddSaveLink,
  isLink,
  savedAddLinks,
  savedShopLinks,
}) {
  const email = localStorage.getItem("email");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedApp, setSelectedApp] = useState("");
  const [isToggleOn, setIsToggleOn] = useState(false);
  const isMobile = useIsMobile();
  const VITE_BACK_URL = import.meta.env.VITE_BACK_URL;

  const handleDialogClick = (e) => e.stopPropagation();

  const handleLinkTitleChange = (e) => setLinkTitle(e.target.value);

  const handleLinkUrlChange = (e) => setLinkUrl(e.target.value);

  const handleAppSelection = (app) =>
    setSelectedApp(selectedApp === app ? "" : app);

  const handleToggleChange = () => setIsToggleOn(!isToggleOn);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleOverlayClick = async () => {
    if (!isToggleOn) {
      onClose();
      return;
    }

    if (!linkTitle || !linkUrl) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!isValidUrl(linkUrl)) {
      toast.error("Please enter a valid URL.");
      return;
    }

    // Icon selection is optional for AddLinks (isLink === true)
    if (!isLink && !selectedApp) {
      toast.error("Please select an application.");
      return;
    }

    // Set the default image if no icon is selected
    const appIcon = selectedApp || linkpng;

    const newLink = {
      title: linkTitle,
      url: linkUrl,
      app: appIcon,
      type: isLink ? "link" : "shop",
    };

    // Update the arrays locally before saving to backend
    const updatedAddLinks = isLink
      ? [...savedAddLinks, newLink]
      : savedAddLinks;
    const updatedShopLinks = !isLink
      ? [...savedShopLinks, newLink]
      : savedShopLinks;

    try {
      // Save the updated arrays to the backend
      const response = await axios.patch(`${VITE_BACK_URL}/api/profileSave`, {
        savedAddLinks: updatedAddLinks,
        savedShopLinks: updatedShopLinks,
        email,
      });

      if (response.status === 200) {
        // Pass the new link to the parent to update its state
        onAddSaveLink(newLink);
        toast.success(
          `${isLink ? "Link" : "Shop"} added and saved successfully!`
        );
        localStorage.setItem("savedAddLinks", JSON.stringify(updatedAddLinks));
        localStorage.setItem(
          "savedShopLinks",
          JSON.stringify(updatedShopLinks)
        );
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      toast.error(`Failed to save ${isLink ? "link" : "shop"}`);
      return; // Prevent closing dialog or resetting if save fails
    }

    // Reset form fields
    setLinkTitle("");
    setLinkUrl("");
    setSelectedApp("");
    setIsToggleOn(false);

    // Close the dialog
    onClose();
  };

  const handleCopyUrl = () => {
    if (linkUrl) {
      navigator.clipboard
        .writeText(linkUrl)
        .then(() => toast.success("URL copied to clipboard!"))
        .catch(() => toast.error("Failed to copy URL to clipboard."));
    } else {
      toast.error("No URL to copy.");
    }
  };

  const handleRemoveUrl = () => {
    setLinkUrl("");
    toast.success("URL removed.");
  };

  // Map app names to icons
  const iconMapper = {
    facebook: <FaFacebook color="#1877F2" size={28} />,
    instagram: <FaInstagram color="#E4405F" size={28} />,
    twitter: <FaTwitter color="#1DA1F2" size={28} />,
    youtube: <FaYoutube color="#FF0000" size={28} />,
    whatsapp: <FaWhatsapp color="#25D366" size={28} />,
    github: <FaGithub color="#000000" size={28} />,
    linkedin: <FaLinkedin color="#0A66C2" size={28} />,
  };

  const getAppIcon = (appName) => {
    const key = appName?.toLowerCase();
    return iconMapper[key] || <FaLink size={28} color="#666" />;
  };

  return (
    <div className={styles["dialog-overlay"]} onClick={handleOverlayClick}>
      <div className={styles["diolouge"]} onClick={handleDialogClick}>
        <div className={styles["in-div"]}>
          <h3>Enter URL</h3>
          <div className={styles["input-toggle-container"]}>
            <input
              type="text"
              placeholder={`${isLink ? "Link Title ✎" : "Shop Title ✎"}`}
              value={linkTitle}
              onChange={handleLinkTitleChange}
            />
            <label className={styles["switch"]}>
              <input
                type="checkbox"
                checked={isToggleOn}
                onChange={handleToggleChange}
                aria-label="Toggle save link"
              />
              <span
                className={`${styles["slider"]} ${styles["round"]} ${styles["slider-round"]}`}
              ></span>
            </label>
          </div>
          <div className={styles["link-url-container"]}>
            <input
              type="text"
              placeholder={`${isLink ? "Link URL ✎" : "Shop URL ✎"}`}
              value={linkUrl}
              onChange={handleLinkUrlChange}
            />
          </div>
          <div className={styles["copy-remove"]}>
            <button className={styles["copy"]} onClick={handleCopyUrl}>
              <img src={copy} alt="Copy URL" />
            </button>
            <button className={styles["remove"]} onClick={handleRemoveUrl}>
              <img src={remove} alt="Remove URL" />
            </button>
          </div>
        </div>

        {/* Conditionally render application selection only for links */}
        {isLink && (
          <div className={styles["application"]}>
            <h3>Applications</h3>
            <div className={styles["social-media"]}>
              {["facebook", "instagram", "twitter", "youtube", "whatsapp", "github", "linkedin"].map(
                (app) => (
                  <div
                    key={app}
                    className={`${styles["icons"]} ${
                      selectedApp === app ? styles["selected"] : ""
                    }`}
                    onClick={() => handleAppSelection(app)}
                    aria-label={app}
                  >
                    {getAppIcon(app)}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
