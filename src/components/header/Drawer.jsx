import { Drawer } from "antd";
import { useState } from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import styles from "./header.module.css";
import { useRouter } from "next/router";
import footer2 from "../../assets/landing/responsive/footer2.png";
import footer3 from "../../assets/landing/responsive/footer3.png";
import Image from "next/image";
import linkeding from "../../assets/landing/linkedin.png";

const NavDrawer = ({ auth, signOut }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState("small");
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <HiOutlineMenuAlt3 size="30" onClick={open ? onClose : showDrawer} />

      <Drawer
        placement="left"
        closable={false}
        onClose={onClose}
        open={open}
        width="70%"
        style={{
          background: "#F8CD46",
          padding: "10% 3%",
          boxShadow: "none",
        }}
        maskStyle={{
          opacity: 0,
          backgroundColor: "transparent",
        }}
      >
        {auth && auth == "NO_USER" ? (
          <>
            <p
              className={styles.drawerP}
              onClick={() => {
                router.push("/aboutus");
                onClose();
              }}
            >
              Our Story
            </p>
            <p
              className={styles.drawerP}
              onClick={() => {
                router.push("/blog");
                onClose();
              }}
            >
              Blog
            </p>
            <p
              className={styles.drawerP}
              onClick={() => {
                router.push("/login");
                onClose();
              }}
            >
              Login
            </p>
            <p
              className={styles.drawerP}
              onClick={() => {
                router.push("/signup");
                onClose();
              }}
            >
              Signup
            </p>
          </>
        ) : (
          <div>
            <div className={styles.drawerHeight}>
              <h3
                className={styles.drawerh3}
                onClick={() => {
                  router.push("/settings");
                  onClose();
                }}
              >
                My Account
              </h3>
              <p
                className={styles.drawerP}
                onClick={() => {
                  router.push("/privacy");
                  onClose();
                }}
              >
                Privacy and terms
              </p>
              <p
                className={styles.drawerP}
                onClick={() => {
                  router.push("/pricing");
                  onClose();
                }}
              >
                Pricing
              </p>
              <p
                className={styles.drawerP}
                onClick={() => {
                  router.push("/blog");
                  onClose();
                }}
              >
                Blog
              </p>
              <p
                className={styles.drawerP}
                onClick={() => {
                  router.push("/contact");
                  onClose();
                }}
              >
                Contact Us
              </p>
              <p
                className={styles.drawerP}
                onClick={() => {
                  router.push("/aboutus");
                  onClose();
                }}
              >
                About Us
              </p>
              <div className={styles.imgContainer}>
                <Image
                  src={linkeding}
                  alt=""
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/company/2homeshare",
                      "_blank"
                    )
                  }
                  style={{
                    backgroundColor: "black",
                    borderRadius: "50%",
                    height: "40px",
                    width: "40px",
                  }}
                />
                <Image
                  src={footer3}
                  onClick={() =>
                    window.open("https://www.facebook.com/2HomeShare", "_blank")
                  }
                  alt=""
                  style={{
                    backgroundColor: "black",
                    borderRadius: "50%",
                    height: "40px",
                    width: "40px",
                    padding: "10px",
                  }}
                />
              </div>
            </div>

            <h4 className={styles.drawerh4} onClick={signOut}>
              Logout
            </h4>
          </div>
        )}
      </Drawer>
    </>
  );
};
export default NavDrawer;
