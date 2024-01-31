import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ApiPost } from "../../Api/Api";
import Loader from "../../Componets/Loader/Loader";

const Old_Email_Change = () => {
  const [loading, setLoading] = useState(false);
  const { v_code } = useParams();
  const [type, setType] = useState("");

  const verifyUser = () => {
    setLoading(true);
    const body = {
      params: {
        random: v_code,
      },
    };
    ApiPost("email-change-verify", body)
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
    document.title = "Artdevotee | Email-Verification";
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="log-page">
      {loading && <Loader />}
      <div className="goto-login">
        <div className="">
          {type === "F" && (
            <div className="">
              <h2>Error</h2>
              <h5>Your verification link has been expired.</h5>
              <Link to="/login">Go to login</Link>
            </div>
          )}
          {type === "" && (
            <div className="">
              <h5>Are You Sure to email change?</h5>
              <Link to="" onClick={verifyUser}>
                Confrim
              </Link>
            </div>
          )}
          {type === "S" && (
            <div className="">
              <h2>Success !</h2>
              <h5>
                Your email is Change successfully. Please verify your email to
                activate your account. A verification link has been sent to your
                email. If not found, check your spam folder too.
              </h5>
              <Link to="/login">Go to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Old_Email_Change;
