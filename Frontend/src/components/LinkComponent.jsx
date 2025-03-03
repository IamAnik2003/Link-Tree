import React, { useState, useEffect } from "react";
import styles from "../components/LinkComponent.module.css"; // Import the CSS module
import phone from "../assets/phone.png";
import avater from "../assets/avater.png";
import axios from "axios";
import toast from "react-hot-toast";
import shop from "../assets/shop.png";
import fire from "../assets/fire.png";
import DiolougeBox from "./DiolougeBox";
import remove from "../assets/delete.png";
import bars from "../assets/bars.png";
import gallaryicon from "../assets/gallaryicon.png";
import preview1 from "../assets/preview.png";
import cross2 from "../assets/cross2.png";
import Phone from "./Phone";
import useIsMobile from "./useIsMobile";

export default function LinkComponent({
  selectedColor,
  setSelectedColor,
  username,
  setUsername,
  bio,
  setBio,
  savedAddLinks,
  setSavedAddLinks,
  savedShopLinks,
  setSavedShopLinks,
  isLink,
  setIsLink,
  profileImage,
  setProfileImage,
  VITE_URL,
}) {
  const email = localStorage.getItem("email");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempColor, setTempColor] = useState("#ffffff");
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const selectedLayout = localStorage.getItem("selectedLayout");
  const selectedButtonStyle = localStorage.getItem("selectedButtonStyle");
  const buttonColor = localStorage.getItem("buttonColor");
  const buttonFontColor = localStorage.getItem("buttonFontColor");
  const selectedTheme = localStorage.getItem("selectedTheme");
  const selectedFont = localStorage.getItem("selectedFont");
  const selectedFontColor = localStorage.getItem("selectedFontColor");
  const [preview, setPreview] = useState(false);
  const isMobile = useIsMobile();
  const [file, setFile] = useState();
  const VITE_BACK_URL = import.meta.env.VITE_BACK_URL;

  const handleSaveButton = async (e) => {
    e.preventDefault();

    try {
      // First API call: Save profile data
      const profileResponse = await axios.post(`${VITE_BACK_URL}/api/profileSave`, {
        bio,
        username,
        email,
        selectedColor,
      });

      if (profileResponse.status === 200) {
        localStorage.setItem("selectedColor", selectedColor);
        localStorage.setItem("bio", bio);
        localStorage.setItem("username", username);
        toast.success("Profile updated successfully!");
      }

      // Handle image upload if file exists
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Link_tree"); // Make sure this matches your Cloudinary preset
        formData.append("cloud_name", "dkfgcsnd1"); // Replace with your actual cloud name

        try {
          const uploadResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/dkfgcsnd1/image/upload", // Replace dkfgcsnd1 with your cloud name
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const imageURL = uploadResponse.data.secure_url; // Get the uploaded image URL

          // Update profile image state and localStorage
          setProfileImage(imageURL);
          localStorage.setItem("profileImage", imageURL);

          // Save the imageURL to the backend
          const updateImageResponse = await axios.patch(`${VITE_BACK_URL}/api/updateProfileImage`, {
            email,
            imageURL,
          });

          if (updateImageResponse.status === 200) {
            toast.success("Profile picture uploaded and saved successfully!");
          }
        } catch (uploadError) {
          console.error("Upload Error:", uploadError.message);
          toast.error("Failed to upload profile picture");
        }
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleAddSaveLink = (newLink) => {
    if (isLink) {
      setSavedAddLinks([...savedAddLinks, newLink]); // Update state
    } else {
      setSavedShopLinks([...savedShopLinks, newLink]); // Update state
    }
  };

  const handleDeleteItem = async (index) => {
    try {
      let updatedAddLinks = [...savedAddLinks];
      let updatedShopLinks = [...savedShopLinks];

      if (isLink) {
        updatedAddLinks.splice(index, 1); // Remove the link at the specified index
      } else {
        updatedShopLinks.splice(index, 1); // Remove the shop at the specified index
      }

      // Update state
      setSavedAddLinks(updatedAddLinks);
      setSavedShopLinks(updatedShopLinks);

      // Save the updated links to the backend
      const response = await axios.patch(`${VITE_BACK_URL}/api/profileSave`, {
        savedAddLinks: updatedAddLinks,
        savedShopLinks: updatedShopLinks,
        email,
      });

      if (response.status === 200) {
        toast.success(`${isLink ? "Link" : "Shop"} removed and saved successfully!`);
        localStorage.setItem("savedAddLinks", JSON.stringify(updatedAddLinks));
        localStorage.setItem("savedShopLinks", JSON.stringify(updatedShopLinks));
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      toast.error(`Failed to remove ${isLink ? "link" : "shop"}`);
    }
  };

  const handleOnchange = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile); // Update state
    }
  };

  const handleRemoveImage = async () => {
    try {
      // Remove the profile image from the backend
      const response = await axios.patch(`${VITE_BACK_URL}/api/removeProfileImage`, { email });

      if (response.status === 200) {
        // Update state and localStorage
        setProfileImage(null);
        localStorage.removeItem("profileImage");
        toast.success("Profile image removed successfully!");
      }
    } catch (error) {
      console.error("Error removing profile image:", error);
      toast.error("Failed to remove profile image");
    }
  };

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleCircleColorSelection = (color) => {
    setTempColor(color);
    setSelectedColor(color);
  };

  const handleInputColorSelection = (e) => {
    setTempColor(e.target.value);
    setSelectedColor(e.target.value);
  };

  const toggleColorPicker = () => setIsColorPickerVisible(!isColorPickerVisible);

  return (
    <>
      <div className={styles["link-container"]}>
        {!isMobile && (
          <Phone
            selectedColor={selectedColor}
            username={username}
            savedAddLinks={savedAddLinks}
            savedShopLinks={savedShopLinks}
            isLink={isLink}
            profileImage={profileImage}
            selectedLayout={selectedLayout}
            selectedButtonStyle={selectedButtonStyle}
            buttonColor={buttonColor}
            buttonFontColor={buttonFontColor}
            selectedTheme={selectedTheme}
            selectedFont={selectedFont}
            selectedFontColor={selectedFontColor}
            VITE_URL={VITE_URL}
          />
        )}
        {preview && isMobile && (
          <Phone
            selectedColor={selectedColor}
            username={username}
            savedAddLinks={savedAddLinks}
            savedShopLinks={savedShopLinks}
            isLink={isLink}
            profileImage={profileImage}
            selectedLayout={selectedLayout}
            selectedButtonStyle={selectedButtonStyle}
            buttonColor={buttonColor}
            buttonFontColor={buttonFontColor}
            selectedTheme={selectedTheme}
            selectedFont={selectedFont}
            selectedFontColor={selectedFontColor}
            VITE_URL={VITE_URL}
          />
        )}

        <div className={styles["link-content"]}>
          {isMobile && (
            <div
              onClick={() => setPreview(true)}
              style={{
                position: "absolute",
                width: "23%",
                height: "6%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                top: "75%",
                left: "40%",
                zIndex: "1000",
              }}
              className={styles["preview"]}
            >
              <img style={{ width: "100%", height: "100%" }} src={preview1} alt="preview" />
            </div>
          )}

          {isMobile && preview && (
            <div
              onClick={() => setPreview(false)}
              style={{
                position: "absolute",
                width: "20%",
                height: "10%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                top: "75%",
                left: "40%",
                zIndex: "1001",
              }}
              className={styles["preview"]}
            >
              <img style={{ width: "100%", height: "100%" }} src={cross2} alt="preview" />
            </div>
          )}

          <h3>Profile</h3>
          <div className={styles["profile-container"]}>
            <label htmlFor="profile-image" className={styles["pick-image"]}>
              Pick an image
            </label>
            <input
              type="file"
              onChange={handleOnchange}
              id="profile-image"
              style={{ display: "none" }}
              accept="image/*"
            />
            <button onClick={handleRemoveImage} className={styles["remove-image"]}>
              Remove
            </button>
            <div className={styles["profile-pic"]}>
              <img src={profileImage || avater} alt="Profile" />
            </div>
            <div className={styles["profile-title"]}>
              <p>Profile title</p>
              <input
                onChange={(e) => {
                  let value = e.target.value.trim();
                  if (!value.startsWith("@")) value = "@" + value;
                  setUsername(value.replace(/^@/, ""));
                }}
                value={`@${username}`}
                type="text"
                className={styles["username-input"]}
                onSelect={(e) => {
                  if (e.target.selectionStart < 1) {
                    e.target.setSelectionRange(1, 1);
                  }
                }}
              />
            </div>
            <div className={styles["bio"]}>
              <p>Bio</p>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
          </div>

          <div className={styles["addlink-container"]}>
            <div className={styles["add-shop-add-link"]}>
              <div
                className={`${isLink ? styles["addlinkbtn"] : styles["addshopbtn"]}`}
                onClick={() => setIsLink(true)}
              >
                <img src={shop} alt="" />
                <p>Add Link</p>
              </div>
              <div
                className={`${!isLink ? styles["addlinkbtn"] : styles["addshopbtn"]}`}
                onClick={() => setIsLink(false)}
              >
                <img src={shop} alt="" />
                <p>Add Shop</p>
              </div>
            </div>
            <div className={styles["addbtn"]} onClick={openDialog}>
              +Add
            </div>
            <div className={styles["link-items-scroll"]}>
              {(isLink ? savedAddLinks : savedShopLinks).map((item, index) => (
                <div key={index} className={styles["link-item"]}>
                  <p>
                    <strong>{item.title}</strong> ✎
                  </p>
                  <p>{item.url}✎</p>
                  <label className={styles["switch1"]}>
                    <input type="checkbox" checked disabled />
                    <span className={styles["slider1"]}></span>
                  </label>
                  <button
                    className={styles["remove-link"]}
                    onClick={() => handleDeleteItem(index)}
                  >
                    <img src={remove} alt="Delete" />
                  </button>
                  <div className={styles["click"]}>
                    {!isLink && (
                      <label className={styles["gallery-icon"]} htmlFor="shop-pic">
                        <img src={gallaryicon} alt="Drag" />
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const imageURL = URL.createObjectURL(file);
                              // Handle shop image upload if needed
                            }
                          }}
                          id="shop-pic"
                          style={{ display: "none" }}
                          accept="image/*"
                        />
                      </label>
                    )}
                    <img src={bars} alt="Drag" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isDialogOpen && (
            <DiolougeBox
              onClose={closeDialog}
              onAddSaveLink={handleAddSaveLink}
              isLink={isLink}
              savedAddLinks={savedAddLinks}
              savedShopLinks={savedShopLinks}
            />
          )}

          <h3>Banner</h3>
          <div className={styles["banner-container"]}>
            <div className={styles["banner"]} style={{ backgroundColor: selectedColor }}>
              <div className={styles["profile-on-banner"]}>
                <img src={profileImage || avater} alt="Profile" />
              </div>
              <h3>@{username}</h3>
              <p>
                <img className={styles["fire-img"]} src={fire} alt="" />/{username}
              </p>
            </div>
            <div className={styles["color-div"]}>
              <p style={{ fontSize: "0.8em" }}>Custom Background Color</p>
              <div className={styles["colors"]}>
                <div
                  className={`${styles["color-circle"]} ${styles["color-pic1"]}`}
                  onClick={() => handleCircleColorSelection("#342B26")}
                ></div>
                <div
                  className={`${styles["color-circle"]} ${styles["color-pic2"]}`}
                  onClick={() => handleCircleColorSelection("#ffffff")}
                ></div>
                <div
                  className={`${styles["color-circle"]} ${styles["color-pic3"]}`}
                  onClick={() => handleCircleColorSelection("#000000")}
                ></div>
              </div>
              <div className={styles["color-picker-container"]}>
                <div
                  className={styles["demo-color-div"]}
                  style={{ backgroundColor: tempColor }}
                ></div>
                <input
                  type="color"
                  id="color-input"
                  onChange={handleInputColorSelection}
                  style={{ display: isColorPickerVisible ? "block" : "none" }}
                />
                <label
                  htmlFor="color-input"
                  className={styles["color-picker"]}
                  onClick={toggleColorPicker}
                >
                  <p>{tempColor}</p>
                </label>
              </div>
            </div>
          </div>

          <button onClick={handleSaveButton} className={styles["save-btn"]}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}
