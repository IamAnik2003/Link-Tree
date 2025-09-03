import React, { useState } from "react";
import styles from "../components/Appearence.module.css";
import Phone from "./Phone";
import useIsMobile from "../components/useIsMobile";
import { FaLayerGroup, FaTh, FaScroll, FaEye, FaTimes } from "react-icons/fa";
import special1 from "../assets/special1.png";
import special2 from "../assets/special2.png";
import preview1 from "../assets/preview.png";
import cross2 from "../assets/cross2.png";
import toast from "react-hot-toast";
import axios from "axios";

export default function AppearanceComponent({
  selectedColor,
  username,
  savedAddLinks,
  savedShopLinks,
  isLink,
  profileImage,
  VITE_URL,
}) {
  const [selectedLayout, setSelectedLayout] = useState(
    localStorage.getItem("selectedLayout")
  );
  const [selectedButtonStyle, setSelectedButtonStyle] = useState(
    localStorage.getItem("selectedButtonStyle")
  );
  const [buttonColor, setButtonColor] = useState(
    localStorage.getItem("buttonColor") || "#C9C9C9"
  );
  const [buttonFontColor, setButtonFontColor] = useState(
    localStorage.getItem("buttonFontColor") || "#000000"
  );
  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem("selectedTheme")
  );
  const [selectedFont, setSelectedFont] = useState(
    localStorage.getItem("selectedFont") || "Poppins"
  );
  const [selectedFontColor, setSelectedFontColor] = useState(
    localStorage.getItem("selectedFontColor") || "#000000"
  );
  const [isFontDialogOpen, setIsFontDialogOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [desktopPreview, setDesktopPreview] = useState(false);
  const [hoveredLayout, setHoveredLayout] = useState(null);
  const isMobile = useIsMobile();
  const email = localStorage.getItem("email");
  const VITE_BACK_URL = import.meta.env.VITE_BACK_URL;

  const handleLayoutSelection = (layout) => {
    setSelectedLayout(layout);
  };

  const handleButtonStyleSelection = (style) => {
    setSelectedButtonStyle(style);
  };

  const handleButtonColorChange = (e) => {
    setButtonColor(e.target.value);
  };

  const handleButtonFontColorChange = (e) => {
    setButtonFontColor(e.target.value);
  };

  const handleThemeSelection = (theme) => {
    setSelectedTheme(theme);
  };

  const handleFontSelection = (font) => {
    setSelectedFont(font);
    setIsFontDialogOpen(false);
  };

  const handleFontColorChange = (e) => {
    setSelectedFontColor(e.target.value);
  };

  const handleSaveButton = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${VITE_BACK_URL}/api/saveappsettings`,
        {
          email,
          selectedLayout,
          selectedButtonStyle,
          buttonColor,
          buttonFontColor,
          selectedTheme,
          selectedFont,
          selectedFontColor,
        }
      );
      if (response.status === 200) {
        toast.success("Settings saved successfully!");
        localStorage.setItem("selectedLayout", selectedLayout);
        localStorage.setItem("selectedButtonStyle", selectedButtonStyle);
        localStorage.setItem("buttonColor", buttonColor);
        localStorage.setItem("buttonFontColor", buttonFontColor);
        localStorage.setItem("selectedTheme", selectedTheme);
        localStorage.setItem("selectedFont", selectedFont);
        localStorage.setItem("selectedFontColor", selectedFontColor);
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      toast.error(error.response?.data?.message || "Failed to save settings");
    }
  };

  const toggleDesktopPreview = () => {
    setDesktopPreview(!desktopPreview);
  };

  const FontDialog = ({ isOpen, onClose, onSelectFont }) => {
    const fonts = ["Poppins", "Roboto", "Open Sans", "Lato", "Montserrat"];

    if (!isOpen) return null;

    return (
      <div className={styles["font-dialog"]} onClick={onClose}>
        <div
          className={styles["font-dialog-content"]}
          onClick={(e) => e.stopPropagation()}
        >
          <h3>Select a Font</h3>
          {fonts.map((font, index) => (
            <div
              key={index}
              className={styles["font-option"]}
              onClick={() => onSelectFont(font)}
            >
              <p style={{ fontFamily: font }}>{font}</p>
            </div>
          ))}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles["appearence-container"]}>
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

        {/* Desktop Preview Overlay */}
        {desktopPreview && !isMobile && (
          <div className={styles["desktop-preview-overlay"]}>
            <div className={styles["desktop-preview-content"]}>
              <div className={styles["desktop-preview-header"]}>
                <h3>Preview</h3>
                <button
                  className={styles["close-preview-btn"]}
                  onClick={toggleDesktopPreview}
                >
                  <FaTimes />
                </button>
              </div>
              <div className={styles["desktop-preview-phone"]}>
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
              </div>
            </div>
          </div>
        )}

        <div className={styles["appearence-content"]}>
          {isMobile && (
            <div
              onClick={() => setPreview(true)}
              style={{
                position: "absolute",
                width: "120px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                top: "75dvh",
                left: "35dvw",
                zIndex: "1001",
              }}
              className="preview"
            >
              <img
                style={{ width: "100%", height: "100%" }}
                src={preview1}
                alt="preview"
              />
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
              onClick={() => setPreview(false)}
              style={{
                position: "absolute",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                top: "75dvh",
                left: "40dvw",
                zIndex: "3000",
              }}
              className="preview"
            >
              <img
                style={{ width: "100%", height: "100%" }}
                src={cross2}
                alt="preview"
              />
            </div>
          )}

          <h3 style={{ width: "100%", minHeight: "5%" }}>Layout</h3>
          <div className={styles["layout-container"]}>
            <div
              className={`${styles["stack"]} ${styles["layout"]} ${
                selectedLayout === "stack" ? styles["selected-layout"] : ""
              }`}
              onClick={() => handleLayoutSelection("stack")}
              onMouseEnter={() => setHoveredLayout("stack")}
              onMouseLeave={() => setHoveredLayout(null)}
            >
              <FaLayerGroup size={24} />
              {hoveredLayout === "stack" && (
                <div className={styles["layout-tooltip"]}>Stack</div>
              )}
            </div>
            <div
              className={`${styles["grid"]} ${styles["layout"]} ${
                selectedLayout === "grid" ? styles["selected-layout"] : ""
              }`}
              onClick={() => handleLayoutSelection("grid")}
              onMouseEnter={() => setHoveredLayout("grid")}
              onMouseLeave={() => setHoveredLayout(null)}
            >
              <FaTh size={24} />
              {hoveredLayout === "grid" && (
                <div className={styles["layout-tooltip"]}>Grid</div>
              )}
            </div>
            <div
              className={`${styles["carousel"]} ${styles["layout"]} ${
                selectedLayout === "carousel" ? styles["selected-layout"] : ""
              }`}
              onClick={() => handleLayoutSelection("carousel")}
              onMouseEnter={() => setHoveredLayout("carousel")}
              onMouseLeave={() => setHoveredLayout(null)}
            >
              <FaScroll size={24} />
              {hoveredLayout === "carousel" && (
                <div className={styles["layout-tooltip"]}>Carousel</div>
              )}
            </div>
          </div>

          {/* Buttons Section */}
          <h2 className={styles["h2-set"]}>Buttons</h2>
          <div className={styles["buttons-container"]}>
            <p>Fill</p>
            <div className={styles["button-flex"]}>
              <div
                className={`${styles["button1"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "fill1"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("fill1")}
              ></div>
              <div
                className={`${styles["button2"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "fill2"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("fill2")}
              ></div>
              <div
                className={`${styles["button3"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "fill3"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("fill3")}
              >
                <div className={styles["button-inner"]}></div>
              </div>
            </div>
            <p>Outline</p>
            <div className={styles["button-flex"]}>
              <div
                className={`${styles["button4"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "outline1"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("outline1")}
              ></div>
              <div
                className={`${styles["button5"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "outline2"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("outline2")}
              ></div>
              <div
                className={`${styles["button6"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "outline3"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("outline3")}
              ></div>
            </div>
            <p>Hard shadow</p>
            <div className={styles["button-flex"]}>
              <div
                className={`${styles["button7"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "hardShadow1"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("hardShadow1")}
              ></div>
              <div
                className={`${styles["button8"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "hardShadow2"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("hardShadow2")}
              ></div>
              <div
                className={`${styles["button9"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "hardShadow3"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("hardShadow3")}
              ></div>
            </div>
            <p>Soft shadow</p>
            <div className={styles["button-flex"]}>
              <div
                className={`${styles["button10"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "softShadow1"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("softShadow1")}
              ></div>
              <div
                className={`${styles["button11"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "softShadow2"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("softShadow2")}
              ></div>
              <div
                className={`${styles["button12"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "softShadow3"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("softShadow3")}
              ></div>
            </div>
            <p>Special</p>
            <div className={styles["button-flex"]}>
              <div
                className={`${styles["button13"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "special1"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("special1")}
                style={{
                  backgroundImage: `url(${special1})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                }}
              ></div>
              <div
                className={`${styles["button14"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "special2"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("special2")}
                style={{
                  backgroundImage: `url(${special2})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                }}
              ></div>
              <div
                className={`${styles["button15"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "special3"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("special3")}
              >
                <div className={styles["inner-special"]}></div>
              </div>
            </div>
            <br />
            <div className={styles["button-flex"]}>
              <div
                className={`${styles["button16"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "special4"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("special4")}
              ></div>
              <div
                className={`${styles["button17"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "special5"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("special5")}
              ></div>
              <div
                className={`${styles["button18"]} ${styles["buttons"]} ${
                  selectedButtonStyle === "special6"
                    ? styles["selected-button"]
                    : ""
                }`}
                onClick={() => handleButtonStyleSelection("special6")}
              ></div>
            </div>

            {/* Button Color Settings - Only one section */}
            <p>Button color</p>
            <div className={styles["button-color-flex"]}>
              <div
                className={styles["demo-button-color"]}
                style={{ backgroundColor: buttonColor }}
              ></div>
              <label className={styles["colorpicker"]} htmlFor="pickcolor">
                <input
                  type="color"
                  id="pickcolor"
                  name="pickcolor"
                  value={buttonColor}
                  onChange={handleButtonColorChange}
                  style={{ display: "none" }}
                />
                <p style={{ color: "black", width: "100%" }}>{buttonColor}</p>
              </label>
            </div>

            <p>Button font color</p>
            <div className={styles["button-color-flex"]}>
              <div
                className={styles["demo-button-color"]}
                style={{ backgroundColor: buttonFontColor }}
              ></div>
              <label
                className={styles["colorpicker"]}
                htmlFor="pickbuttonfontcolor"
              >
                <input
                  type="color"
                  id="pickbuttonfontcolor"
                  name="pickbuttonfontcolor"
                  value={buttonFontColor}
                  onChange={handleButtonFontColorChange}
                  style={{ display: "none" }}
                />

                <p style={{ color: "black" }}>{buttonFontColor}</p>
              </label>
            </div>
          </div>
          {/* Themes Section */}
          <h3>Themes</h3>
          <div className={styles["themes-container"]}>
            <div
              className={`${styles["themes"]} ${styles["air-snow"]} ${
                styles["common-theme-style"]
              } ${
                selectedTheme === "air-snow" ? styles["selected-theme"] : ""
              }`}
              onClick={() => handleThemeSelection("air-snow")}
            >
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div
              className={`${styles["themes"]} ${styles["air-grey"]} ${
                styles["common-theme-style"]
              } ${
                selectedTheme === "air-grey" ? styles["selected-theme"] : ""
              }`}
              onClick={() => handleThemeSelection("air-grey")}
            >
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div
              className={`${styles["themes"]} ${styles["air-smoke"]} ${
                styles["common-theme-style"]
              } ${
                selectedTheme === "air-smoke" ? styles["selected-theme"] : ""
              }`}
              onClick={() => handleThemeSelection("air-smoke")}
            >
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div
              className={`${styles["themes"]} ${styles["air-black"]} ${
                styles["common-theme-style"]
              } ${
                selectedTheme === "air-black" ? styles["selected-theme"] : ""
              }`}
              onClick={() => handleThemeSelection("air-black")}
            >
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p>Air Snow</p>
            <p>Air Grey</p>
            <p>Air Smoke</p>
            <p>Air Black</p>
            <div
              className={`${styles["themes"]} ${styles["mineral-blue"]} ${
                styles["common-theme-style"]
              } ${
                selectedTheme === "mineral-blue" ? styles["selected-theme"] : ""
              }`}
              onClick={() => handleThemeSelection("mineral-blue")}
            >
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div
              className={`${styles["themes"]} ${styles["mineral-green"]} ${
                styles["common-theme-style"]
              } ${
                selectedTheme === "mineral-green"
                  ? styles["selected-theme"]
                  : ""
              }`}
              onClick={() => handleThemeSelection("mineral-green")}
            >
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div
              className={`${styles["themes"]} ${styles["mineral-orange"]} ${
                styles["common-theme-style"]
              } ${
                selectedTheme === "mineral-orange"
                  ? styles["selected-theme"]
                  : ""
              }`}
              onClick={() => handleThemeSelection("mineral-orange")}
            >
              <div></div>
              <div></div>
              <div></div>
            </div>
            <br />
            <p>Mineral Blue</p>
            <p>Mineral Green</p>
            <p>Mineral Orange</p>
          </div>

          {/* Save Button */}
          <button className={styles["save-btn"]} onClick={handleSaveButton}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}