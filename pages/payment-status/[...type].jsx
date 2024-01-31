import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getPosts } from "../../Redux/Apidemo/apiDemoSlice";
import Link from "next/link";
// import Image from "next/future/image";
import { useRouter } from "next/router";
import failure from "../../public/images/failure.png"
import success from "../../public/images/success.png"

function PaymentStatus() {
  const router = useRouter();
  const dispatch = useDispatch()
  let getUserData = null;
  if (typeof window !== "undefined") {
  getUserData = JSON.parse(localStorage.getItem("userinfo"));
  }

  useEffect(() => {
    document.title = "Artdevotee | Payment Status";
    window.scrollTo(0, 0);
  }, [router.isReady]);

  return (
    <div className="log-page">
      <div className="goto-login">
        <div className="">
          {router?.query?.type?.[0] === "F" ? (
            <div className="paystat">
              <img
                src={failure}
                alt=""
              />
              <h2>Error</h2>
              <h5>Your Payment is failed. Please try again later.</h5>
              <Link href={router?.query?.type?.[1]==="O"?"/my-order":"/gift-card"}>{router?.query?.type?.[1]==="O"?"View your Orders":"View your gift cards"}</Link>
            </div>
          ) : (
            <div className="paystat">
              <img
                src={success}
                alt=""
              />
              <h2>Success !</h2>
              <h5>Your Payment is Successfull.</h5>
              <Link href={router?.query?.type?.[1]==="O"?"/my-order":"/gift-card"}>{router?.query?.type?.[1]==="O"?"View your Orders":"View your gift cards"}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentStatus;
