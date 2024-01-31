import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ApiPost } from "../../Api/Api";
import Loader from "../../Componets/Loader/Loader";
import Head from "next/head";
import Link from "next/link";

const EmailVerification = () => {
  const router=useRouter();
  const [loading, setLoading] = useState(false);
  const v_code = router?.query?.v_code;
  const [type, setType] = useState("");

  const verifyUser = () => {
    setLoading(true);
    const body = {
      params: {
        random: v_code,
      },
    };
    ApiPost("verifyUser", body)
      .then((res) => {
        if (res?.data?.result) {
          setType("S");
        } else if (res?.data?.error) {
          setType("F");
        }
        setLoading(false);
      })
      .catch(async (err) => {
        setType("F");
        setLoading(false);
      });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    verifyUser();
  }, []);
  return (
    <>
    <Head>
        <title>Email-Verification - Artdevotee</title>
        <meta name="description" content="Email-Verification - Artdevotee" />
      </Head>
    <div className="log-page">
      {loading && <Loader />}
      <div className="goto-login">
        <div className="">
          {type === "F" && (
            <div className="">
              <h2>Error</h2>
              <h5>Your verification link has been expired.</h5>
              <Link href="/login">Go to login</Link>
            </div>
          )}
          {type === "S" && (
            <div className="">
              <h2>Success !</h2>
              <h5>
                Your email is verified successfully. Now you can Sign in with
                your email and password.
              </h5>
              <Link href="/login">Go to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default EmailVerification;
