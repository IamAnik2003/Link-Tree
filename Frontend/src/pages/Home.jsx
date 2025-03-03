import React from "react";
import Navbar from "../components/Navbar";
import useIsMobile from "../components/useIsMobile";
import styles from "./Home.module.css"; // Import the CSS module
import analytics from "../assets/ana.png";
import img1 from "../assets/div.png";
import img2 from "../assets/div (1).png";
import img4 from "../assets/div (2).png";
import img3 from "../assets/square02.webp.png";
import icon from "../assets/icon.png";
import audiomack from "../assets/Audiomack.png";
import bandsintown from "../assets/Bandsintown.png";
import bonfire from "../assets/Bonfire.png";
import books from "../assets/Books.png";
import bmg from "../assets/bmg.png";
import cameo from "../assets/Cameo.png";
import clubhouse from "../assets/Clubhouse.png";
import community from "../assets/Community.png";
import contactDetails from "../assets/ContactDetails.png";
import autoLayoutHorizontal from "../assets/Auto Layout Horizontal.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const platformsData = [
    {
      src: audiomack,
      title: "Audiomack",
      description: "Add an Audiomack player to your Linktree",
    },
    {
      src: bandsintown,
      title: "Bandsintown",
      description: "Drive ticket sales by listing your events",
    },
    {
      src: bonfire,
      title: "Bonfire",
      description: "Display and sell your custom merch",
    },
    {
      src: books,
      title: "Books",
      description: "Promote books on your Linktree",
    },
    {
      src: bmg,
      title: "Buy Me A Gift",
      description: "Let visitors support you with a small gift",
    },
    {
      src: cameo,
      title: "Cameo",
      description: "Make impossible fan connections possible",
    },
    {
      src: clubhouse,
      title: "Clubhouse",
      description: "Let your community in on the conversation",
    },
    {
      src: community,
      title: "Community",
      description: "Build an SMS subscriber list",
    },
    {
      src: contactDetails,
      title: "Contact Details",
      description: "Easily share downloadable contact details",
    },
  ];


  return (
    <>
      <div className={styles.home}>
        <Navbar />
        <div className={styles.container1}>
          <div className={styles.flex1}>
            <div className={styles.child1}>
              <h1>The easiest place to update and share your Connection</h1>
              <p>
                Help your followers discover everything you’re sharing all over the
                internet, in one simple place. They’ll thank you for it!
              </p>
              <button onClick={() => navigate('/')} className="btn">Get your free spark</button>
            </div>
            <img src={analytics} alt="img" />
          </div>
          <div className={styles.flex2}>
            <div className={styles.child3}>
              <img src={img1} alt="img" />
              <p>
                Sell products and collect payments. It’s monetization made simple.
              </p>
            </div>
            <div className={styles.child4}>
              <h1>
                Analyze your audience and keep your followers engaged
              </h1>
              <p>
                Track your engagement over time, monitor revenue and learn what’s
                converting your audience. Make informed updates on the fly to keep
                them coming back.
              </p>
            </div>
          </div>
          <div className={styles.flex3}>
            <div className={styles.child5}>
              <h2>
                Share limitless content in limitless ways
              </h2>
              <p>
                Connect your content in all its forms and help followers find more
                of what they’re looking for. Your TikToks, Tweets, YouTube videos,
                music, articles, recipes, podcasts and more… It all comes together
                in one powerful place
              </p>
            </div>
            <div className={styles.child6}>
              <img src={img2} alt="" />
              <img src={img3} alt="" />
              <img src={img4} alt="" />
              <h5>
                Share your content in limitless ways on your Spark
              </h5>
            </div>
          </div>
          <div className={styles.child7}>
            <p style={isMobile ? { width: "100%", fontSize: "1.5em" } : {}}>
              Here's what our <span style={{ color: "#1DA35E" }}>customer </span>
              has to says
            </p>
            {!isMobile && (
              <div style={{ width: "26vw", display: "flex", height: "12vh" }}>
                <img
                  style={{ width: "10%", height: "38%", alignSelf: "center" }}
                  src={icon}
                  alt=""
                />
                <p style={{ fontSize: "1.2em", height: "100%", width: "100%" }}>
                  [short description goes in here] lorem ipsum is a placeholder text
                  to demonstrate.
                </p>
              </div>
            )}
            <button
              style={!isMobile ? {
                width: "15%",
                height: "22%",
                borderRadius: "25px",
                marginTop: "-5%",
                fontSize: "0.8em",
                background: "transparent",
                border: "2px solid #349F68",
                color: "#1DA35E",
              } : {
                width: "50%",
                height: "25%",
                borderRadius: "25px",
                marginTop: "-5%",
                fontSize: "0.8em",
                background: "transparent",
                border: "2px solid #349F68",
                color: "#1DA35E",
                marginLeft: "25%"
              }}
            >
              Read customer stories
            </button>
          </div>
          <div className={styles.flex4}>
            <div className={styles.child8}>
              <p>Amazing tool! Saved me months</p>
              <p>
                This is a placeholder for your testimonials and what your client has
                to say, put them here and make sure its 100% true and meaningful.
              </p>
              <div
                style={!isMobile ? {
                  width: "20vw",
                  height: "15vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                } : {
                  width: "65vw",
                  height: "15vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#28A263",
                    width: "26%",
                    height: "75%",
                    borderRadius: "50%",
                  }}
                ></div>
                <p style={{ marginTop: "-10%" }}>John Master</p>
                <p style={{ marginLeft: "29%", marginTop: "-19%" }}>
                  Director, Spark.com
                </p>
              </div>
            </div>
            <div className={styles.child9}>
              <p style={{ fontSize: "1.5em" }}>Amazing tool! Saved me months</p>
              <p>
                This is a placeholder for your testimonials and what your client has
                to say, put them here and make sure its 100% true and meaningful.
              </p>
              <div
                style={!isMobile ? {
                  width: "20vw",
                  height: "15vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                } : {
                  width: "65vw",
                  height: "20vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#28A263",
                    width: "23%",
                    height: "75%",
                    borderRadius: "50%",
                  }}
                ></div>
                <p style={{ marginTop: "-10%" }}>John Master</p>
                <p style={{ marginLeft: "29%", marginTop: "-19%" }}>
                  Director, Spark.com
                </p>
              </div>
            </div>
            <div className={styles.child9}>
              <p style={{ fontSize: "1.5em" }}>Amazing tool! Saved me months</p>
              <p>
                This is a placeholder for your testimonials and what your client has
                to say, put them here and make sure its 100% true and meaningful.
              </p>
              <div
                style={!isMobile ? {
                  width: "20vw",
                  height: "15vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                } : {
                  width: "53vw",
                  height: "18vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#28A263",
                    width: "30%",
                    height: "75%",
                    borderRadius: "50%",
                  }}
                ></div>
                <p style={{ marginTop: "-10%" }}>John Master</p>
                <p style={{ marginLeft: "29%", marginTop: "-19%" }}>
                  Director, Spark.com
                </p>
              </div>
            </div>
            <div className={styles.child8}>
              <p style={{ fontSize: "1.5em" }}>Amazing tool! Saved me months</p>
              <p>
                This is a placeholder for your testimonials and what your client has
                to say, put them here and make sure its 100% true and meaningful.
              </p>
              <div
                style={!isMobile ? {
                  width: "20vw",
                  height: "15vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                } : {
                  width: "65vw",
                  height: "15vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#28A263",
                    width: "23%",
                    height: "75%",
                    borderRadius: "50%",
                  }}
                ></div>
                <p style={{ marginTop: "-10%" }}>John Master</p>
                <p style={{ marginLeft: "29%", marginTop: "-19%" }}>
                  Director, Spark.com
                </p>
              </div>
            </div>
          </div>
          <div>
            <h1 style={isMobile ? { fontSize: "1.6em" } : {}}>All Link Apps and Integrations</h1>
          </div>
          <div className={styles.child10}>
            {platformsData.map((platform, index) => (
              <div className={styles.inchild} key={index}>
                <img
                  style={{ width: "17%", height: "60%", alignSelf: "center" }}
                  src={platform.src}
                  alt={platform.title}
                />
                <h4>{platform.title}</h4>
                <p style={{ marginLeft: "21%", marginTop: "-12%" }}>
                  {platform.description}
                </p>
              </div>
            ))}
          </div>
          <div className={styles.flex5}>
            <div className={styles.child11}>
              <button
                style={!isMobile ? {
                  width: "7%",
                  height: "10%",
                  background: "rgb(220, 211, 211)",
                  border: "none",
                } : {
                  width: "30%",
                  height: "8%",
                  marginTop: "2%",
                  borderRadius: "25px",
                  color: "#28A263",
                  background: "rgb(220, 211, 211)",
                  border: "none",
                  position: "relative",
                  top: "67%"
                }}
                onClick={() => { navigate('/login'); }}
              >
                {!isMobile ? "Log in" : "Admin"}
              </button>
              <button
                className={styles.signupbtn2}
                onClick={() => { navigate('/register'); }}
              >
                Sign up free
              </button>
              <div className={styles.inchild2}>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>About Spark</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Careers</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Terms and Conditions</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Blog</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Getting Started</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Privacy Policy</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Press</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Features and How-Tos</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Cookie Notice</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Social Good</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>FAQs</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Trust Center</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Contact</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Report a Violation</p>
                <p style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>Trust Center</p>
              </div>
              {!isMobile && (
                <p className={styles.inchild3}>
                  We acknowledge the Traditional Custodians of the land on which our
                  office stands, The Wurundjeri people of the Kulin Nation, and pay
                  our respects to Elders past, present and emerging.
                </p>
              )}
              <img style={!isMobile ? { width: "30%", height: "10%" } : { width: "70%", height: "10%", position: "relative", top: "9%" }} src={AutoLayoutHorizontal} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
