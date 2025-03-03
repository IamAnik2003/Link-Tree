import React, { useState } from "react";
import styles from "../components/Appearence.module.css";
import Phone from "./Phone";
import useIsMobile from "../components/useIsMobile"
import stack from "../assets/stack.png";
import grid from "../assets/grid.png";
import carousel from "../assets/carousel.png";
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
  VITE_URL
}) {
  const [selectedLayout, setSelectedLayout] = useState(localStorage.getItem("selectedLayout"));
  const [selectedButtonStyle, setSelectedButtonStyle] = useState(localStorage.getItem("selectedButtonStyle"));
  const [buttonColor, setButtonColor] = useState(localStorage.getItem("buttonColor")||"#C9C9C9");
  const [buttonFontColor, setButtonFontColor] = useState(localStorage.getItem("buttonFontColor"));
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem("selectedTheme"));
  const [selectedFont, setSelectedFont] = useState(localStorage.getItem("selectedFont"));
  const [selectedFontColor, setSelectedFontColor] = useState(localStorage.getItem("selectedFontColor"));
  const [isFontDialogOpen, setIsFontDialogOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const isMobile= useIsMobile();
  const email =localStorage.getItem("email");
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
    e.preventDefault()
    try {
      const response = await axios.post(`${VITE_BACK_URL}/api/saveappsettings`, {
        email,
        selectedLayout,
        selectedButtonStyle,
        buttonColor,
        buttonFontColor,
        selectedTheme,
        selectedFont,
        selectedFontColor,
      });
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

  const FontDialog = ({ isOpen, onClose, onSelectFont }) => {
    const fonts = ["Poppins", "Roboto", "Open Sans", "Lato", "Montserrat"];

    if (!isOpen) return null;

    return (
      <div className={styles["font-dialog"]} onClick={onClose}>
        <div
          className={styles["font-dialog-content"]}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside the dialog from closing it
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
        {!isMobile&&(<Phone
          selectedColor={selectedColor}
          username={username}
          savedAddLinks={savedAddLinks}
          savedShopLinks={savedShopLinks}
          isLink={isLink}
          selectedLayout={selectedLayout}
          selectedButtonStyle={selectedButtonStyle}
          buttonColor={buttonColor}
          buttonFontColor={buttonFontColor}
          selectedTheme={selectedTheme}
          profileImage={profileImage}
          selectedFont={selectedFont}
          VITE_URL={VITE_URL}
        />)}
         {preview&&isMobile&&(<Phone
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
                />)}
                
         
        <div className={styles["appearence-content"]}>
           {isMobile&&(<div onClick={()=>{setPreview(true)}} style={{position:"absolute",width:"23%",height:"6%",display:"flex",alignItems:"center",justifyContent:"center",top:"75%",left:"40%",zIndex:"1000"}} className="preview">
                      <img style={{width:"100%",height:"100%"}} src={preview1} alt="preview" />
                    </div>)}
                  
                    {isMobile&&preview&&(<div onClick={()=>{setPreview(false)}} style={{position:"absolute",width:"20%",height:"10%",display:"flex",alignItems:"center",justifyContent:"center",top:"75%",left:"40%",zIndex:"1001"}} className="preview">
                      <img style={{width:"100%",height:"100%"}} src={cross2} alt="preview" />
                    </div>)}
          <h3>Layout</h3>
          <div className={styles["layout-container"]}>
            <div
              className={`${styles["stack"]} ${styles["layout"]} ${
                selectedLayout === "stack" ? styles["selected-layout"] : ""
              }`}
              onClick={() => handleLayoutSelection("stack")}
            >
              <img src={stack} alt="Stack Layout" />
            </div>
            <div
              className={`${styles["grid"]} ${styles["layout"]} ${
                selectedLayout === "grid" ? styles["selected-layout"] : ""
              }`}
              onClick={() => handleLayoutSelection("grid")}
            >
              <img src={grid} alt="Grid Layout" />
            </div>
            <div
              className={`${styles["carousel"]} ${styles["layout"]} ${
                selectedLayout === "carousel" ? styles["selected-layout"] : ""
              }`}
              onClick={() => handleLayoutSelection("carousel")}
            >
              <img src={carousel} alt="Carousel Layout" />
            </div>
            <div className={styles["names"]}>
              <p className={styles["layout-names"]}>Stack</p>
              <p className={styles["layout-names"]}>Grid</p>
              <p className={styles["layout-names"]}>Carousel</p>
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
                <p>Button color</p>
                <p style={{ color: "black" }}>{buttonColor}</p>
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
                  className={styles["color-input"]}
                />
                <p>Button font color</p>
                <p style={{ color: "black", marginRight: "8%" }}>
                  {buttonFontColor}
                </p>
              </label>
            </div>
          </div>

          {/* Fonts Section */}
          <h3 className={styles["h2-set"]}>Fonts</h3>
          <div className={styles["fonts-container"]}>
            <p>Fonts</p>
            <div className={styles["fonts-flex"]}>
              <div className={styles["font-demo"]}>
                <p style={{ fontFamily: selectedFont }}>Aa</p>
              </div>
              <label
                htmlFor="pickfont"
                className={styles["pickfont-div"]}
                onClick={() => setIsFontDialogOpen(true)}
              >
                <p>{selectedFont}</p>
              </label>
            </div>
            <p>Font color</p>
            <div className={styles["font-color-flex"]}>
              <div
                className={styles["font-color-demo"]}
                style={{ backgroundColor: selectedFontColor }}
              ></div>
              <label
                className={styles["font-color-picker"]}
                htmlFor="pickfontcolor"
              >
                <input
                  type="color"
                  id="pickfontcolor"
                  name="pickfontcolor"
                  value={selectedFontColor}
                  onChange={handleFontColorChange}
                  style={{ display: "none" }}
                />
                <p>Color</p>
                <p style={{ color: selectedFontColor }}>{selectedFontColor}</p>
              </label>
            </div>
          </div>

          {/* Font Dialog */}
          <FontDialog
            isOpen={isFontDialogOpen}
            onClose={() => setIsFontDialogOpen(false)}
            onSelectFont={handleFontSelection}
          />

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
