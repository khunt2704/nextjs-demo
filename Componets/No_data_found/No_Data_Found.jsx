import React from "react";
import Link from "next/link";
import Image from "next/image";
import no_data_found from "../../public/images/no-data-found.png";
import Assets from "../Assest";

const No_Data_Found = ({ type }) => {
  return (
    <div className="text-center w-100">
      <Assets
        className="no_data_img"
        src={"images/no-data-found.png"}
        alt=""
      />
      {type === "cart" && (
        <ul className="pay-btns no_data_btn">
          <li>
            <Link href="/search-product" className="shop-btn">
              {/* <a className="shop-btn"> */}
              Continue Shopping
              {/* </a> */}
            </Link>
          </li>
        </ul>
      )}
      {type === "gift-cart" && (
        <ul className="pay-btns no_data_btn">
          <li>
            <Link href="/purchase-gift-card" className="shop-btn">
              {/* <a className="shop-btn"> */}
              Continue Buy Gift Card
              {/* </a> */}
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default No_Data_Found;
