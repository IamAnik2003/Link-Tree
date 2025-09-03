import React, { useState, useEffect, useRef } from "react";
import styles from "../components/LinkComponent.module.css";
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
  // Initialize tempColor with the saved color from localStorage
  const [tempColor, setTempColor] = useState(
    localStorage.getItem("selectedColor") || "#ffffff"
  );
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const selectedLayout = localStorage.getItem("selectedLayout");
  const selectedButtonStyle = localStorage.getItem("selectedButtonStyle");
  const buttonColor = localStorage.getItem("buttonColor");
  const buttonFontColor = localStorage.getItem("buttonFontColor");
  const selectedTheme = localStorage.getItem("selectedTheme");
  const selectedFont = localStorage.getItem("selectedFont");
  const selectedFontColor = localStorage.getItem("selectedFontColor");
  const [preview, setPreview] = useState(false);
  const [desktopPreview, setDesktopPreview] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useIsMobile();
  const [file, setFile] = useState();
  const VITE_BACK_URL = import.meta.env.VITE_BACK_URL;

  // Sync tempColor with selectedColor when component mounts
  useEffect(() => {
    if (selectedColor) {
      setTempColor(selectedColor);
    }
  }, [selectedColor]);

  // Image cropping functionality
  const handleImageSelect = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      setOriginalImage(imageUrl);
      setIsImageEditorOpen(true);
      setFile(selectedFile);
    }
  };

  const cropImage = () => {
    if (!originalImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = function () {
      // Set canvas size to 80x80 (target size)
      canvas.width = 80;
      canvas.height = 80;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate aspect ratios
      const imgAspect = img.width / img.height;
      const canvasAspect = canvas.width / canvas.height;

      let renderableWidth, renderableHeight, xStart, yStart;

      // If image is wider than canvas
      if (imgAspect > canvasAspect) {
        renderableHeight = img.height;
        renderableWidth = img.height * canvasAspect;
        xStart = (img.width - renderableWidth) / 2;
        yStart = 0;
      }
      // If image is taller than canvas
      else {
        renderableWidth = img.width;
        renderableHeight = img.width / canvasAspect;
        xStart = 0;
        yStart = (img.height - renderableHeight) / 2;
      }

      // Draw image on canvas (centered and cropped)
      ctx.drawImage(
        img,
        xStart,
        yStart,
        renderableWidth,
        renderableHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Get the cropped image as data URL
      const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCroppedImage(croppedDataUrl);
      setTempProfileImage(croppedDataUrl);
    };

    img.src = originalImage;
  };

  const saveCroppedImage = () => {
    if (croppedImage) {
      setTempProfileImage(croppedImage);
      setIsImageEditorOpen(false);
      setOriginalImage(null);
      setCroppedImage(null);
    }
  };

  const cancelCrop = () => {
    setIsImageEditorOpen(false);
    setOriginalImage(null);
    setCroppedImage(null);
    setFile(null);
  };

  const handleSaveButton = async (e) => {
    e.preventDefault();

    try {
      // First API call: Save profile data
      const profileResponse = await axios.post(
        `${VITE_BACK_URL}/api/profileSave`,
        {
          bio,
          username,
          email,
          selectedColor,
        }
      );

      if (profileResponse.status === 200) {
        localStorage.setItem("selectedColor", selectedColor);
        localStorage.setItem("bio", bio);
        localStorage.setItem("username", username);
        toast.success("Profile updated successfully!");
      }

      // Handle image upload if file exists
      if (file && croppedImage) {
        // Convert data URL to blob
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        const croppedFile = new File([blob], "profile.jpg", {
          type: "image/jpeg",
        });

        const formData = new FormData();
        formData.append("file", croppedFile);
        formData.append("upload_preset", "Link_tree");
        formData.append("cloud_name", "dkfgcsnd1");

        try {
          const uploadResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/dkfgcsnd1/image/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const imageURL = uploadResponse.data.secure_url;

          // Update profile image state and localStorage
          setProfileImage(imageURL);
          localStorage.setItem("profileImage", imageURL);

          // Save the imageURL to the backend
          const updateImageResponse = await axios.patch(
            `${VITE_BACK_URL}/api/updateProfileImage`,
            {
              email,
              imageURL,
            }
          );

          if (updateImageResponse.status === 200) {
            toast.success("Profile picture uploaded and saved successfully!");
          }
        } catch (uploadError) {
          console.error("Upload Error:", uploadError.message);
          toast.error("Failed to upload profile picture");
        }
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleAddSaveLink = (newLink) => {
    if (isLink) {
      setSavedAddLinks([...savedAddLinks, newLink]);
    } else {
      setSavedShopLinks([...savedShopLinks, newLink]);
    }
  };

  const handleDeleteItem = async (index) => {
    try {
      let updatedAddLinks = [...savedAddLinks];
      let updatedShopLinks = [...savedShopLinks];

      if (isLink) {
        updatedAddLinks.splice(index, 1);
      } else {
        updatedShopLinks.splice(index, 1);
      }

      setSavedAddLinks(updatedAddLinks);
      setSavedShopLinks(updatedShopLinks);

      const response = await axios.patch(`${VITE_BACK_URL}/api/profileSave`, {
        savedAddLinks: updatedAddLinks,
        savedShopLinks: updatedShopLinks,
        email,
      });

      if (response.status === 200) {
        toast.success(
          `${isLink ? "Link" : "Shop"} removed and saved successfully!`
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
      const response = await axios.patch(
        `${VITE_BACK_URL}/api/removeProfileImage`,
        { email }
      );

      if (response.status === 200) {
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
    setIsColorPickerVisible(false); // Close color picker after selection
  };

  const handleInputColorSelection = (e) => {
    const color = e.target.value;
    setTempColor(color);
    setSelectedColor(color);
    setIsColorPickerVisible(false); // Close color picker after selection
  };

  const toggleColorPicker = () =>
    setIsColorPickerVisible(!isColorPickerVisible);

  const toggleDesktopPreview = () => {
    setDesktopPreview(!desktopPreview);
  };

  const toggleMobilePreview = () => {
    if (preview) {
      // Closing animation
      setIsAnimating(true);
      setTimeout(() => {
        setPreview(false);
        setIsAnimating(false);
      }, 300);
    } else {
      // Opening
      setPreview(true);
    }
  };

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
              onClick={toggleMobilePreview}
              className={styles["mobile-preview-btn"]}
            >
              <img src={preview1} alt="preview" />
            </div>
          )}

          {!isMobile && (
            <button
              className={styles["desktop-preview-btn"]}
              onClick={toggleDesktopPreview}
            >
              <FaEye /> Preview
            </button>
          )}

          {isMobile && preview && (
            <div
              onClick={toggleMobilePreview}
              className={styles["mobile-close-preview-btn"]}
            >
              <img src={cross2} alt="close preview" />
            </div>
          )}

          <h3 style={{ alignSelf: "flex-start" }}>Profile</h3>
          <div className={styles["profile-container"]}>
            <div
              style={{
                width: "60%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              
              }}
            >
              <div className={styles["profile-pic"]}>
                <img
                  src={tempProfileImage || profileImage || avater}
                  alt="Profile"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>

            <label htmlFor="profile-image" className={styles["pick-image"]}>
              Pick an image
              <input
                type="file"
                onChange={handleImageSelect}
                id="profile-image"
                style={{ display: "none" }}
                accept="image/*"
              />
            </label>
            <button
              onClick={handleRemoveImage}
              className={styles["remove-image"]}
            >
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

          {/* Image Editor Modal */}
          {isImageEditorOpen && (
            <div className={styles["image-editor-modal"]}>
              <div className={styles["image-editor-content"]}>
                <h3>Crop Your Profile Image</h3>
                <p>Image will be cropped to 80x80 pixels</p>

                <div className={styles["image-preview"]}>
                  {originalImage && (
                    <img
                      src={originalImage}
                      alt="Original"
                      style={{ maxWidth: "100%", maxHeight: "300px" }}
                    />
                  )}
                </div>

                <canvas ref={canvasRef} style={{ display: "none" }} />

                <div className={styles["editor-buttons"]}>
                  <button onClick={cropImage} className={styles["crop-btn"]}>
                    Crop Image
                  </button>
                  <button
                    onClick={saveCroppedImage}
                    className={styles["save-crop-btn"]}
                  >
                    Save Cropped Image
                  </button>
                  <button onClick={cancelCrop} className={styles["cancel-btn"]}>
                    Cancel
                  </button>
                </div>

                {croppedImage && (
                  <div className={styles["cropped-preview"]}>
                    <h4>Cropped Preview (80x80px):</h4>
                    <img
                      src={croppedImage}
                      alt="Cropped"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles["addlink-container"]}>
            <div className={styles["add-shop-add-link"]}>
              <div
                className={`${
                  isLink ? styles["addlinkbtn"] : styles["addshopbtn"]
                }`}
                onClick={() => setIsLink(true)}
              >
                <img src={shop} alt="" />
                <p>Add Link</p>
              </div>
              <div
                className={`${
                  !isLink ? styles["addlinkbtn"] : styles["addshopbtn"]
                }`}
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
                      <label
                        className={styles["gallery-icon"]}
                        htmlFor="shop-pic"
                      >
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

          <h3 style={{ alignSelf: "flex-start" }}>Banner</h3>
          <div className={styles["banner-container"]}>
            <div
              className={styles["banner"]}
              style={{ backgroundColor: selectedColor }}
            >
              <div className={styles["profile-on-banner"]}>
                <img src={profileImage || avater} alt="Profile" />
              </div>
              <h3>@{username}</h3>
              <p>
                <img className={styles["fire-img"]} src={fire} alt="" />/
                {username}
              </p>
            </div>

            <p style={{ fontSize: "1em", width: "100%", height: "7%" }}>
              Custom Background Color
            </p>

            <div className={styles["color-div"]}>
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
                  value={tempColor}
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
