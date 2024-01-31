import React, { useEffect, useState } from "react";
// import OtpInput from "react-otp-input";
// import Image from "next/future/image";
import Head from "next/head";
import { useRouter } from "next/router";
import swal from "sweetalert";
import { ApiPost } from "../Api/Api";
import Loader from "../Componets/Loader/Loader";
import resend from "../assets/images/resend.png"

const Otp = () => {
  const router = useRouter();
  const [data, setData] = useState({ otp: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState({});
  const [errorMsg, seterrorMsg] = useState("");
  const validateForm = () => {
    let errors = {};
    let formIsValid = true;
    if (data?.otp === "") {
      formIsValid = false;
      errors["otp"] = "Please enter otp";
    } else if (data?.otp?.length < 5) {
      formIsValid = false;
      errors["otps"] = "Please enter otp";
    }
    setError(errors);

    return formIsValid;
  };
  const resetPassword = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setLoading(true);
      const body = {
        params: {
          email: router?.query?.state,
          otp: data?.otp,
        },
      };
      ApiPost("verify-otp", body)
        .then((res) => {
          if (res?.data?.error) {
            seterrorMsg(res?.data?.error?.meaning);
          } else if (res?.data?.result) {
            swal({
              title: "Success",
              text: res?.data?.result?.status?.meaning,
              icon: "success",
            }).then(function() {
              if(data){
              router.push({
                pathname: "/update-password",
                query: { otp: data?.otp}
              })
          }})
          }
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
        });
    }
  };
  const resetOtp = () => {
    setLoading(true);
    const body = {
      params: {
        email: router.query.state,
      },
    };
    ApiPost("reset-password", body)
      .then((res) => {
        if (res?.data?.error) {
          seterrorMsg(res?.data?.error?.meaning);
        } else if (res?.data?.result) {
          swal({
            title: "Success",
            text: res?.data?.result?.status?.meaning,
            icon: "success",
          });
        }
        setLoading(false);
      })
      .catch(async (err) => {
        setLoading(false);
      });
  };
  const handleChange = (otp) => {
    setData({ otp });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
    <Head>
        <title>Otp vaerification - Artdevotee</title>
        <meta name="description" content="Otp Verification - Artdevotee" />
        <meta property="og:title" content="Otp vaerification - Artdevotee" />
        <meta property="og:description" content="Otp vaerification - Artdevotee" />
        <meta
          property="og:image"
          content="https://artdevotee.com /images/how-bnr.png"
        />
        <link rel="canonical" href="https://artdevotee.com/otp" />
      </Head>
    <div className="log-page">
      {loading && <Loader />}
      <div className="container">
        <div className="log-page-inr">
          <div className="login-box">
            <div className="log-box-top">
              {errorMsg && <h6 className="errorMsg">{errorMsg}</h6>}
              <div className="loger-top for-got otp-got">
                <h2>OTP Verifiction</h2>
                <h3>Please enter the OTP sent to your registered email.</h3>
              </div>
              <div className="loger-inr">
                <form action="" role="form" onSubmit={resetPassword}>
                  <h3>Enter your OTP here</h3>
                  <div className="otp">
                  
                  <span className="errorInput">
                      {data?.otp?.length > 0 ? "" : errors["otp"]}
                    </span>
                    <span className="errorInput">
                      {data?.otp?.length > 5 ? "" : errors["otps"]}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="log-sbmt mt-4"
                  >
                    {" "}
                    Submit
                  </button>

                  <h4>Did not recieve verification code yet?</h4>
                  <button type="button" className="otp-reset" onClick={resetOtp}>
                    <img src={resend} alt=""/>
                    Resend OTP
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Otp;
