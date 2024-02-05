import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Rectangle688 from "../../assets/images/Rectangle688.png";
import Dash1 from "../../assets/images/das_icon1.png";
import Dash2 from "../../assets/images/das_icon2.png";
import Dash3 from "../../assets/images/das_icon6.png";
import Dash4 from "../../assets/images/das_icon5.png";
import Dash5 from "../../assets/images/das_icon3.png";
import Dash6 from "../../assets/images/gft-crd.png";
import Dash7 from "../../assets/images/das_icon4.png";
import Assets from "../Assest";
// import { useLocation, useNavigate } from "react-router-dom";

const Sidemenu = () => {
  let userData = null;
  if (typeof window !== 'undefined') {
    userData = JSON.parse(localStorage.getItem("userinfo"));
  }
  const router = useRouter()
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("userinfo");
      localStorage.removeItem("access_tocken");
    }
    // navigate("/login");
    router.push("/login")
  };
  // console.log("userData",userData);
  return (
    <div className="dashbord_left sticky_new">
      <div className="dashbord_left_ir" id="mobile_menu_dv">
        <div className="dashbord_left_top">
          <div className="media">
            <em>
              {/* <img
                src={
                  userData?.profile_image
                    ? "https://artdevotee.com/preview/storage/app/public/profile_picture/" +
                      userData?.profile_image
                    : process.env.PUBLIC_URL + "/images/Rectangle688.png"
                }
                alt=""
              /> */}
              {userData?.profile_image
                ?
                <img
                  src={
                    "https://artdevotee.com/preview/storage/app/public/profile_picture/" +
                    userData?.profile_image
                  }
                  alt=""
                />
                :
                <span className="mr-2">
                  <Assets alt=""
                    src={"images/Rectangle688.png"} />
                </span>
              }
            </em>
            <div className="media-body">
              <h4>
                {userData?.first_name} {userData?.last_name}
              </h4>
              <p>{userData?.email}</p>
            </div>
          </div>
        </div>
        <div className="dash_pro_link">
          <ul>
            <li>
              <Link
                href="/dashboard"
                className={router.pathname === "/dashboard" && "actv"}
              >
                {/* <a > */}
                <Assets alt=""
                  src={"images/das_icon1.png"} />
                <span>Dashboard </span>
                {/* </a> */}
              </Link>
            </li>
            <li>
              <Link
                href="/edit-profile"
                className={router.pathname === "/edit-profile" && "actv"}
              >
                {/* <a > */}
                <Assets alt=""
                  src={"images/das_icon1.png"} />
                <span>Edit Profile</span>
                {/* </a> */}
              </Link>
            </li>
            {userData?.signup_by !== "G" && (
              <li>
                <Link
                  href="/change-password"
                  className={router.pathname === "/change-password" && "actv"}
                >
                  {/* <a> */}
                  <Assets alt=""
                    src={"images/das_icon2.png"} />
                  <span>Change Password</span>
                  {/* </a> */}
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/my-wishlist"
                className={router.pathname === "/my-wishlist" && "actv"}
              >
                {/* <a> */}
                <Assets alt=""
                  src={"images/das_icon3.png"} />
                <span>My Wishlist</span>
                {/* </a> */}
              </Link>
            </li>
            <li>
              <Link
                href="/my-order"
                className={
                  (router.pathname === "/my-order" ||
                    router.pathname === "/order-details") &&
                  "actv"
                }
              >
                {/* <a > */}
                <Assets alt=""
                  src={"images/das_icon4.png"} />
                <span>My Order</span>
                {/* </a> */}
              </Link>
            </li>
            <li>
              <Link
                href="/shopping-cart"
                className={router.pathname === "/shopping-cart" && "actve"}
              >
                {/* <a   > */}
                <Assets alt=""
                  src={"images/das_icon5.png"} />
                <span>My Cart</span>
                {/* </a> */}
              </Link>
            </li>
            <li>
              <Link
                href="/gift-card"
                className={
                  (router.pathname === "/gift-card" ||
                    router.pathname === "/gift-details" ||
                    router.pathname === "/purchase-gift-card") &&
                  "actv"
                }
              >
                {/* <a > */}
                <Assets alt=""
                  src={"images/gft-crd.png"} />
                <span>Gift Card</span>
                {/* </a> */}
              </Link>
            </li>
            <li>
              <a onClick={logout}>
                <Assets alt=""
                  src={"images/das_icon6.png"} />
                <span>Log Out</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidemenu;
