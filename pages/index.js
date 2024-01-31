import Script from "next/script";
import React, { useEffect, useState } from "react";
import { ApiPost } from "../Api/Api";
import Banner from "../Componets/Home/Banner";
import Browse_By_Catagory from "../Componets/Home/Browse_By_Catagory";
import Limited_Offer from "../Componets/Home/Limited_Offer";
import Popular_Products from "../Componets/Home/Popular_Products";
import Recently_Added_Product from "../Componets/Home/Recently_Added_Product";
import Head from "next/head";

export default function Slider() {
  const [category, setCategory] = useState([]);
  const [about, setAbout] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    ApiPost("get-home-content", {}).then(async (res) => {
      if (res?.data?.result) {
        setData(res?.data?.result?.home);
        setCategory(res?.data?.result?.category_list);
        setAbout(res?.data?.result?.about);
      }
    });
  }
  }, []);
  return (
    <>
      <Head>
    <meta
      name="description"
      content="Visit Artdevotee and Buy unique hand painted wallpapers for your smart phone and laptop at a very affordable price."

    />
    <meta property="og:title" content="Artdevotee"/>
    <meta
      property="og:description"
      content="Visit Artdevotee and Buy unique hand painted wallpapers for your smart phone and laptop at a very affordable price."

    />
    <meta
      property="og:image"
      content="https://artdevotee.com /images/how-bnr.png"

    />
    <link
      rel="canonical"
      href="https://artdevotee.com/"

    />

    <title>Artdevotee</title>
      </Head>
      <Script
        onReady={() => {
          $(window).on("scroll", function () {
            if ($(document).scrollTop() > 0) {
              $("header").addClass("headerfixed");
            } else {
              $("header").removeClass("headerfixed");
            }
          });
        }}
      />
      <Script
        onReady={() => {
          $(".dropdown-toggle").on("click", function () {
            $(".dropdown-menu").slideToggle("slow");
          });
          $(document).on("click", function () {
            var $target = $(event.target);
            if (
              !$target.closest(".dropdown-menu").length &&
              !$target.closest(".dropdown-toggle").length &&
              $(".dropdown-menu").is(":visible")
            ) {
              $(".dropdown-menu").slideUp();
            }
          });
        }}
      />
      <Script
        onLoad={() => {
          $(window).on("scroll", function () {
            if ($(this).scrollTop() >= 50) {
              // If page is scrolled more than 50px

              $("#stop").fadeIn(200); // Fade in the arrow
            } else {
              $("#stop").fadeOut(200); // Else fade out the arrow
            }
          });

          $("#stop").on("click",function () {
            // When arrow is clicked

            $("body,html").animate(
              {
                scrollTop: 0, // Scroll to top of body
              },
              500
            );
          });

          $(window).on("scroll", function () {
            var scroll = $(window).scrollTop();

            if (scroll >= 300) {
              $(".scrollTop").addClass("fixed");
            } else {
              $(".scrollTop").removeClass("fixed");
            }
          });
        }}
      />

      <Banner data={data}/>
      <Recently_Added_Product />
      <Browse_By_Catagory about={about} category={category}/>
      <Popular_Products />
      <Limited_Offer data={data} />
    </>
  );
}
