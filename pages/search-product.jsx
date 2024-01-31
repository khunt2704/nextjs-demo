import { Slider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ApiGet, ApiPost, getFileImage } from "../Api/Api";
import { Pagination, Stack } from "@mui/material";
import Loader from "../Componets/Loader/Loader";
// import Image from "next/future/image";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { getPosts } from "../Redux/Apidemo/apiDemoSlice";
import swal from "sweetalert";
import No_Data_Found from "../Componets/No_data_found/No_Data_Found";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Head from "next/head";
import srch from "../assets/images/search.png";
import heart_white from "../assets/images/heart-white.png";
import bag_3 from "../assets/images/bag-3.png";
import def from "../assets/images/default.png";

const Search_Product = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  let userData=null;
  if (typeof window !== 'undefined') {
  userData = JSON.parse(localStorage.getItem("userinfo"));
  }
  const currency = useSelector((state) => state?.currency?.currency);
  const calling_code = useSelector((state) => state?.currency?.calling_code);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);
  const [sliderValue, setSliderValue] = useState([0, 0]);
  const [min_price, setMin_price] = useState(0);
  const [max_price, setMax_price] = useState(10000000);
  const [search, setSearch] = useState(
    router?.query?.search ? router?.query?.search : ""
  );
  const [categoryId, setCategoryId] = useState(
    router?.query?.categoryId ? router?.query?.categoryId : ""
  );
  const [sortBy, setSortBy] = useState("Select sort type");
  const [totalpage, settotalpage] = useState(10);
  const [currentpage, setcurrentpage] = useState(1);
  const [total_product, setTotal_product] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [cartlist, setCartlist] = useState([]);
  const [cartID, setCartID] = useState([]);
  const [removeCartID, setRemoveCartID] = useState([]);
  const [globle, setGloble] = useState("");
  const [deleteProduct, setDeleteProduct] = useState({});
  const [show, setShow] = useState(false);
  const openModal = (e) => {
    setShow(true);
    setDeleteProduct(e);
  };
  const closeModal = () => {
    setShow(false);
    setDeleteProduct({});
  };
  const handlePageChange = (e, i) => {
    searchData(i, sortBy);
  };
  const sortByClick = (e) => {
    setSortBy(e);
    searchData(currentpage, e);
  };
  const handleSliderChange = (event, value) => {
    setSliderValue(value);
  };
  const searchData = async (p, sort, s, c, e) => {
    {
      e && e.preventDefault();
    }
    window.scrollTo(0, 0);
    setLoading(true);
    if (calling_code) {
      const body = {
        params: {
          keywords: s ? s : search ? search : router?.query?.search,
          category: c
            ? c
            : categoryId
            ? categoryId === "1"
              ? ""
              : categoryId
            : router?.query?.categoryId,
          max_price: sliderValue[1],
          min_price: sliderValue[0],
          page_no: p,
          sort_by:
            sort === "Price Low to High"
              ? "lth"
              : sort === "Price High to Low"
              ? "htl"
              : sort === "Most Recent to Old"
              ? "n"
              : sort === "Most Popular"
              ? "p"
              : "",
          page_type: userData && "L",
          currency_code: calling_code && calling_code,
        },
      };

      await ApiPost("get-search-product-result", body)
        .then((res) => {
          if (res?.data?.details) {
            setData(res?.data?.details);
            setGloble(res?.data?.global_offer);
            settotalpage(res?.data?.page_count);
            setcurrentpage(res?.data?.page_no);
            setTotal_product(res?.data?.product_count);
            setTotal_product(res?.data?.product_count);
            setWishlist(res?.data?.wishlist);
            setCartlist(res?.data?.cartlist);
            // setSearch("")
            // setCategoryId("")
          }
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
        });
    }
  };
  const searchData2 = async (p) => {
    window.scrollTo(0, 0);
    setLoading(true);
    if (calling_code) {
      const body = {
        params: {
          page_type: userData && "L",
          currency_code: calling_code && calling_code,
        },
      };

      await ApiPost("get-search-product-result", body)
        .then((res) => {
          if (res?.data?.details) {
            sliderValue[0] = res?.data?.min_price;
            sliderValue[1] = res?.data?.max_price;
            setMin_price(res?.data?.min_price);
            setMax_price(res?.data?.max_price);
          }
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
        });
    }
  };
  const addWishlist = (e) => {
    if (userData) {
      setLoading(true);
      const body = {
        params: {
          product_id: e,
        },
      };
      ApiPost("wishlists", body)
        .then((res) => {
          setLoading(false);
          if (res?.data?.result) {
            swal({
              title: "Success",
              text: res?.data?.result?.status?.meaning,
              icon: "success",
            });
            dispatch(getPosts());
            setWishlist(res?.data?.result?.wishlist);
          }
        })
        .catch(async (err) => {
          setLoading(false);
        });
    } else {
      router.push("/login");
    }
  };
  const getData = () => {
    if (userData) {
      setLoading(true);
      ApiGet("get-cart-list", {})
        .then((res) => {
          if (res?.data?.cartList) {
            setCartID(res?.data?.cartList[0]);
          }
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    setRemoveCartID(
      cartID?.get_cart_details?.filter(
        (e) => e?.get_product_details?.id === deleteProduct?.id
      )
    );
  }, [deleteProduct]);

  const removeCart = (e) => {
    if (userData) {
      const body = {
        params: {
          cart_details_id: removeCartID[0]?.id,
        },
      };
      ApiPost("remove-from-cart", body).then((res) => {
        if (res?.data?.result) {
          swal({
            title: "Success",
            text: res?.data?.result?.status?.meaning,
            icon: "success",
          });
          dispatch(getPosts());
          closeModal();
          getData();
          searchData(
            currentpage,
            sortBy,
            router?.query?.search,
            router?.query?.categoryId
          );
        } else if (res?.data?.error) {
          swal({
            title: "Warning",
            text: res?.data?.error?.meaning,
            icon: "warning",
          });
        }
      });
    } else {
      router.push("/login");
    }
  };
  const addCart = (e) => {
    if (userData) {
      setLoading(true);
      const body = {
        params: {
          product_id: e?.id,
          currency_code: calling_code,
        },
      };
      ApiPost("add-to-cart", body)
        .then((res) => {
          setLoading(false);
          if (res?.data?.result) {
            swal({
              title: "Success",
              text: res?.data?.result?.status?.meaning,
              icon: "success",
            });
            getData();
            dispatch(getPosts());
            setCartlist(res?.data?.result?.cart_list);
          } else if (res?.data?.error) {
            if (res?.data?.error?.meaning === "Product is already added") {
              openModal(e);
            }
          }
        })
        .catch(async (err) => {
          setLoading(false);
        });
    } else {
      router.push("/login");
    }
  };
  useEffect(() => {
    searchData(
      currentpage,
      sortBy,
      router?.query?.search,
      router?.query?.categoryId
    );
    setCategoryId(router?.query?.categoryId);
    setSearch(router?.query?.search);
    getData();
  }, [router.pathname, calling_code]);

  useEffect(() => {
    searchData2();
    // document.title = "Artdevotee | Search Result";
    window.scrollTo(0, 0);
    ApiPost("category-list", {})
      .then((res) => {
        if (res?.data?.result) {
          setCategory(res?.data?.result?.category_list);
        }
      })
      .catch(async (err) => {});
  }, []);
  const openDetailsPage = (e) => {
    router.push({
      pathname: `/product-detail/${e?.slug}`,
      query: {
        image: e?.get_product_display_images,
      },
    });
  };
  return (
    <div>
      <Head>
        <title>Our Product - Artdevotee</title>
        <meta name="description" content="Our Product - Artdevotee" />
        <meta property="og:title" content="Our Product - Artdevotee" />
        <meta property="og:description" content="Our Product - Artdevotee" />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/search-product" />
      </Head>
      {loading && <Loader />}
      <div className="filter left-bar">
        <div className="container">
          <h3>Filter Your Search</h3>
          <div className="browse-form">
            <form
              action=""
              role="form"
              onSubmit={(e) => searchData(currentpage, sortBy, "", "", e)}
            >
              <div className="form-group filter-form key-form">
                <input
                  type="text"
                  id=""
                  className="form-control"
                  placeholder="Keyword"
                  value={search}
                  onChange={(e) => setSearch(e?.target?.value)}
                />
              </div>
              <div className="form-group filter-form key-form">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e?.target?.value)}
                >
                  <option value="1">Select category</option>
                  {category.map((e, i) => {
                    return (
                      <>
                        <option className="category_option" value={e?.id}>
                          {e?.name}
                        </option>
                        {e?.child_category !== 0 &&
                          e?.child_category?.map((e, i) => (
                            <option
                              key={i}
                              className="sub_category_option"
                              value={e?.id}
                            >
                              &nbsp;&nbsp;&nbsp;{e?.name}
                            </option>
                          ))}
                      </>
                    );
                  })}
                </select>
              </div>
              <div className="browse-range">
                <h2 className="mb-0">Price Range</h2>
                <div className="renge_area">
                  <div className="renge_area">
                    <div id="slider-range" />
                    <Slider
                      min={parseFloat(min_price)}
                      max={parseFloat(max_price)}
                      value={sliderValue}
                      step={1}
                      onChange={handleSliderChange}
                    />
                    <p>
                      <input
                        type="text"
                        id="amount"
                        value={
                          (currency && currency) +
                          +sliderValue[0] +
                          " - " +
                          (currency && currency) +
                          +sliderValue[1]
                        }
                        className="range-amount-sp"
                      />
                    </p>
                  </div>
                </div>
              </div>
              <button type="submit" className="srch-sbmt">
                <img src={srch} alt="" />
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="srch-result-pg-header">
        <div className="container">
          <div className="rslt-hd-inr">
            <a className="filter-btn click_filter">
              <i className="fa fa-filter" aria-hidden="true"></i>Filter
            </a>
            <h2>
              {total_product} Results found for - <span>Digitally Art</span>
            </h2>
            <div className="form-group sort-frm">
              <label for="">Sort by :</label>
              <a className="sort_open">{sortBy}</a>
              <div className="sort_lst">
                <ul>
                  <li>
                    <a onClick={() => sortByClick("Price Low to High")}>
                      Price Low to High
                    </a>
                  </li>
                  <li>
                    <a onClick={() => sortByClick("Price High to Low")}>
                      Price High to Low
                    </a>
                  </li>
                  <li>
                    <a onClick={() => sortByClick("Most Recent to Old")}>
                      Most Recent to Old
                    </a>
                  </li>
                  <li>
                    <a onClick={() => sortByClick("Most Popular")}>
                      Most Popular
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <p>
              Looking for high quality and colourful Mobile/Laptop wallpapers
              for yourself or unique gift options for your near and dear one?
              Art Devotee is the right place for you.
            </p>
          </div>
        </div>
      </div>

      {data?.length !== 0 && (
        <div className="srch-result-pg-inner serach_product_thumbs">
          <div className="container">
            <div className="row">
              {data?.map((e, i) => {
                return (
                  <div
                    className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6 pr-0 pl-0 border_last_box"
                    key={i}
                  >
                    <div
                      className={`recent-box srch-rcnt-box ${
                        i === 0 || i === 4 || i === 8
                          ? "srch-rcnt-1"
                          : i === 1 || i === 5 || i === 9
                          ? ""
                          : "srch-rcnt-2"
                      }`}
                    >
                      <div className="recent-img">
                        <span>
                          {e?.get_product_display_images[0]?.thumbnail_image ? (
                            <LazyLoadImage
                              onClick={() => openDetailsPage(e)}
                              src={getFileImage(
                                e?.get_product_display_images
                                  ?.filter((e) => e?.is_default_display === "1")
                                  ?.shift()?.thumbnail_image
                              )}
                              className="main-im pointer"
                              loading="lazy"
                              alt="Image Alt"
                            />
                          ) : (
                            <img src={def} alt="" />
                          )}
                        </span>
                        <a
                          className={`heart heart-2 ${
                            wishlist?.includes(JSON.stringify(e?.id)) &&
                            "add_wishlist"
                          }`}
                          onClick={() => addWishlist(e?.id)}
                        >
                          <img src={heart_white} alt="" />
                        </a>
                        <a
                          className={`new_bag_hover d-flex ${
                            cartlist?.includes(JSON.stringify(e?.id)) &&
                            "add_cartList"
                          }`}
                          onClick={() => addCart(e)}
                        >
                          <img src={bag_3} alt="" />
                        </a>
                      </div>
                      <div className="recent-box-txt">
                        <a onClick={() => openDetailsPage(e)}>{e?.title}</a>
                        <h5>
                          Product&nbsp;Code:&nbsp;
                          {e?.product_id ? e?.product_id : "null"}
                        </h5>
                        <div className="price">
                          <span className="prc-1">
                            {e?.get_product_price?.filter(
                              (e) => e?.get_currency?.symbol === currency
                            )[0]?.global_offer_applied === "Y"
                              ? currency &&
                                currency +
                                  e?.get_product_price?.filter(
                                    (e) => e?.get_currency?.symbol === currency
                                  )[0]?.price
                              : e?.get_product_price?.filter(
                                  (e) => e?.get_currency?.symbol === currency
                                )[0]?.discount &&
                                currency &&
                                currency +
                                  e?.get_product_price?.filter(
                                    (e) => e?.get_currency?.symbol === currency
                                  )[0]?.price}
                          </span>
                          <span className="prc-2">
                            {currency &&
                              currency +
                                (e?.get_product_price?.filter(
                                  (e) => e?.get_currency?.symbol === currency
                                )[0]?.global_offer_applied === "Y"
                                  ? e?.get_product_price?.filter(
                                      (e) =>
                                        e?.get_currency?.symbol === currency
                                    )[0]?.after_discount_price?.length === 1
                                    ? "0" +
                                      e?.get_product_price?.filter(
                                        (e) =>
                                          e?.get_currency?.symbol === currency
                                      )[0]?.after_discount_price
                                    : e?.get_product_price?.filter(
                                        (e) =>
                                          e?.get_currency?.symbol === currency
                                      )[0]?.after_discount_price
                                  : e?.get_product_price?.filter(
                                      (e) =>
                                        e?.get_currency?.symbol === currency
                                    )[0]?.discount
                                  ? e?.get_product_price?.filter(
                                      (e) =>
                                        e?.get_currency?.symbol === currency
                                    )[0]?.after_discount_price
                                  : e?.get_product_price?.filter(
                                      (e) =>
                                        e?.get_currency?.symbol === currency
                                    )[0]?.price
                                  ? e?.get_product_price?.filter(
                                      (e) =>
                                        e?.get_currency?.symbol === currency
                                    )[0]?.price
                                  : 0)}
                          </span>
                          {e?.get_product_price?.filter(
                            (e) => e?.get_currency?.symbol === currency
                          )[0]?.discount && (
                            <span className="prc-3">
                              (
                              {e?.get_product_price?.filter(
                                (e) => e?.get_currency?.symbol === currency
                              )[0]?.discount
                                ? e?.get_product_price?.filter(
                                    (e) => e?.get_currency?.symbol === currency
                                  )[0]?.discount
                                : 0}
                              % off)
                            </span>
                          )}
                          {e?.get_product_price?.filter(
                            (e) => e?.get_currency?.symbol === currency
                          )[0]?.global_offer_applied === "Y" && (
                            <span className="prc-3">
                              ({globle ? globle?.offer_percentage : 0}% off)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {!loading && data?.length === 0 && <No_Data_Found />}

      <div className="srch-result-pg">
        <div className="container">
          {totalpage > 1 && (
            <Stack spacing={2}>
              <Pagination
                count={totalpage}
                page={currentpage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                className="pagination_"
              />
            </Stack>
          )}
        </div>
      </div>
      <div
        className={`modal fade ${show && "show"}`}
        style={{ display: show ? "block" : "none" }}
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="log-page">
                <div className="container">
                  <button type="button" className="close" onClick={closeModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <div className="log-page-inr">
                    <div className="login-box">
                      <div className="log-box-top">
                        <div className="loger-top for-got">
                          <h2>Remove from Cart</h2>
                        </div>
                        <div className="loger-inr">
                          <form action="" role="form">
                            <h3>
                              Are you sure you want to remove this item from the
                              cart?
                            </h3>
                            <div className="d-flex">
                              <button
                                type="button"
                                className="log-sbmt bg-white text-dark border mt-4 mr-3"
                                onClick={closeModal}
                              >
                                {" "}
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="log-sbmt mt-4"
                                onClick={removeCart}
                              >
                                {" "}
                                Remove
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search_Product;
