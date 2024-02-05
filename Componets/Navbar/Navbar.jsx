import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
// import Image from "next/future/image";
import { useRouter } from "next/router";
import { ApiPost} from "../../Api/Api";
import { getPosts } from "../../Redux/Apidemo/apiDemoSlice";
import { FiChevronDown } from "react-icons/fi";
import logo_image from "../../public/images/bnr-logo.png";
import heart from "../../public/images/heart.png";
import de1 from "../../public/images/de1.png";
import user from "../../public/images/user.png";
import Rectangle688 from "../../public/images/Rectangle688.png";
import { getMaintenance } from "../../Redux/Apidemo/maintananceDemoSlice";
import Assets from "../Assest";

const Navbar = () => {
  const router = useRouter();
  let getUserData=null;
  if (typeof window !== 'undefined') {
  getUserData = JSON.parse(localStorage.getItem("userinfo"));
  }
  const [userData, setUserData] = useState({});
  const [count, setCount] = useState({});
  const count2 = useSelector((state) => state.apiDemo.lists?.data);
  const maintenance = useSelector((state) => state.maintananceDemo.maintenance?.data?.maintenance_details);
  const currency = useSelector((state) => state?.currency?.currency);
  const dispatch = useDispatch();
  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const logout = () => {
    setCount({});
    if (typeof window !== 'undefined') {
    localStorage.removeItem("userinfo");
    localStorage.removeItem("access_tocken");
    }
    router.push("/login");
  };
  useEffect(() => {
    {
      setCategoryId("");
      ApiPost("category-list", {}).then((res) => {
        if (res?.data?.result) {
          setCategory(res?.data?.result?.category_list);
        }
      });
    }
  }, []);
  useEffect(() => {
    {
      getUserData && dispatch(getPosts());
    }
  }, [router?.pathname]);
  useEffect(() => {
    dispatch(getMaintenance());
  }, []);
  useEffect(() => {
    setSearch(router?.query?.search);
  }, [router]);
  useEffect(() => {
    if (getUserData) {
      setCount(count2)
      setUserData(getUserData)
    } else {
      setCount({})
      setUserData({})
    }
  }, [count2])
  useEffect(() => {
    if (router?.pathname === "/login") {
      setCount({})
    }
  }, [getUserData])

  const dummy = category.filter((e) => {
    return e?.id === router?.query?.categoryId && e?.name;
  });

const serachPage = (e) => {
  e.preventDefault()
  router.push({
    pathname: "/search-product",
    query: {
      categoryId: categoryId?.id,
      search: search,
    }
  })
}
  return (
    <header className="after_login header">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link href="/" className="navbar-brand">
            {/* <a className="navbar-brand"> */}
            <Assets src={"images/bnr-logo.png"} alt=""/>
            {/* </a> */}
          </Link>
          <div className="navbar-right">
            <div className="nav-r8-tp">
              <form action="" role="form" className="nav-frm" onSubmit={serachPage}>
                <div className="dropdown show">
                  <a
                    className="btn dropdown-toggle"
                    role="button"
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {categoryId?.name
                      ? categoryId?.name
                      : dummy?.length !== 0
                        ? dummy[0]?.name
                        : "Catagory"}
                  </a>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    {category?.map((e) => {
                      return (
                        <>
                          <a
                            className="dropdown-item category_option"
                            onClick={() => setCategoryId(e)}
                          >
                            {e?.name}
                          </a>
                          {e?.child_category !== 0 &&
                            e?.child_category?.map((e,i) => (
                              <a
                              key={i}
                                className="dropdown-item sub_category_option"
                                onClick={() => setCategoryId(e)}
                              >
                                &nbsp;&nbsp;&nbsp;&nbsp;{e?.name}
                              </a>
                            ))}
                        </>
                      );
                    })}
                  </div>
                </div>
                <input
                  type="text"
                  className="form-control nav-src"
                  id="inlineFormInputName2"
                  placeholder="Search for illustrations, textures, patterns and more"
                  value={search}
                  onChange={(e) => setSearch(e?.target?.value)}
                />
                <button
                  type="submit"
                  className="gls-btn">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </button>
              </form>
              <div className="cart-num">
                <Link href="/my-wishlist" className="wish">
                  {/* <a > */}
                  <Assets
                    src={"images/heart.png"}
                    alt=""
                  />
                  <h5>Wishlist</h5>
                  <span>{count?.product_count ? count?.product_count : 0}</span>
                  {/* </a> */}
                </Link>
                <Link href="/shopping-cart" className="cart" >
                  {/* <a > */}
                  <div className="cart-img">
                    <Assets src={"images/de1.png"} alt=""/>
                    <span>{count?.cart_count ? count?.cart_count : 0}</span>
                  </div>
                  <h5>
                    <strong>Add to cart :</strong>{" "}
                    {currency &&
                      currency + (count?.cart_price ? count?.cart_price : 0)}
                  </h5>
                  {/* </a> */}
                </Link>
                <button className="navbar-toggler" type="button" id="openMenu">
                  <span className="navbar-toggler-icon">
                    <i className="fa fa-bars" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
            </div>
            <div className="nav-r8-btm">
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item active">
                    <Link href="/" className="nav-link">
                      {/* <a > */}
                      Home
                      {/* </a> */}
                    </Link>
                  </li>
                  <li className="nav-item active">
                    <Link href="/search-product" className="nav-link">
                    {/* <a > */}
                      Our Product
                      {/* </a> */}
                    </Link>
                  </li>
                  <li className="nav-item active">
                    <Link href="/about-us" className="nav-link">
                    {/* <a > */}
                      About Us
                    {/* </a> */}
                    </Link>
                  </li>
                  <li className="nav-item active">
                    <Link href="/contact-us" className="nav-link">
                    {/* <a > */}
                      Contact Us
                    {/* </a> */}
                    </Link>
                  </li>
                  <li className="nav-item active">
                    <Link href="/how-it-works" className="nav-link">
                    {/* <a > */}
                      How It Works
                    {/* </a> */}
                    </Link>
                  </li>
                  <li className="nav-item active">
                    <Link href="/faq" className="nav-link">
                    {/* <a > */}
                      FAQ
                    {/* </a> */}
                    </Link>
                  </li>
                </ul>

                {!getUserData && (
                  <ul className="log-btns">
                    <li className="nav-item active">
                      <Link href="/login" className="log1">
                        {/* <a > */}
                        <Assets
                          src={"images/user.png"}
                          alt=""
                        />
                        Login
                        {/* </a> */}
                      </Link>
                    </li>
                    <li className="nav-item active">
                      <Link href="/sign-up" className="sign2">
                        {/* <a > */}
                        Sign Up
                        {/* </a> */}
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
              {getUserData && (
                <div className="af_log_dv">
                  <a id="profidrop">
                    {getUserData?.profile_image
                          ?
                    <img
                      src={
                         "https://artdevotee.com/preview/storage/app/public/profile_picture/" +
                          getUserData?.profile_image
                      }
                      alt=""
                    />
                    :
                    <Assets alt=""
                    src={"images/Rectangle688.png"}/>
                    }
                    <div className="header_log">
                      <h6>
                        {" "}
                        Hi, {getUserData?.first_name}{" "}
                        <span>
                          <FiChevronDown />
                        </span>
                      </h6>
                    </div>
                  </a>
                  <div
                    className="profidropdid"
                    id="profidropdid"
                    style={{ display: "none" }}
                  >
                    <ul>
                      <li>
                        <Link
                          href="/dashboard"  
                          className={router.pathname === "/dashboard" && "actve"}                      
                          >
                          {/* <a > */}
                          <span>Dashboard </span>
                          {/* </a> */}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/edit-profile"       
                          className={
                            router.pathname === "/edit-profile" && "actve"}                   
                        >
                          {/* <a > */}
                          <span>Edit Profile</span>
                          {/* </a> */}
                        </Link>
                      </li>
                      {userData?.signup_by !== "G" && (
                        <li>
                          <Link
                            href="/change-password"
                            className={
                              router.pathname === "/change-password" &&
                              "actve"
                            }
                          >
                            {/* <a > */}
                            <span>Change Password</span>
                            {/* </a> */}
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          href="/my-wishlist"
                          className={
                            router.pathname === "/my-wishlist" && "actve"
                          }
                        >
                          {/* <a > */}
                          <span>My Wishlist</span>
                          {/* </a> */}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/my-order"
                          className={router.pathname === "/my-order" && "actve"}                        
                          >
                          {/* <a > */}
                          <span>My Order</span>
                          {/* </a> */}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shopping-cart"   
                          className={
                            router.pathname === "/shopping-cart" && "actve"
                          }                     
                          >
                          {/* <a > */}
                          <span>My Cart</span>
                          {/* </a> */}
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/gift-card"
                          className={router.pathname === "/gift-card" && "actve"}
                        >
                          {/* <a > */}
                          <span>Gift Card</span>
                          {/* </a> */}
                        </Link>
                      </li>
                      <li onClick={logout}>
                        {/* <a > */}
                          <span>Log Out</span>
                        {/* </a> */}
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
