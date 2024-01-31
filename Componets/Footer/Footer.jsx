import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
// import Image from "next/future/image";
import { useRouter } from "next/router";
import {
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from "react-share";
import { ApiPost } from "../../Api/Api";
import foot_loc from "../../public/images/foot-loc.png"
import fot_call from "../../public/images/fot-call.png"
import fot_mail from "../../public/images/fot-mail.png"
import visa from "../../public/images/visa.png"
import master from "../../public/images/master.png"
import discover from "../../public/images/discover.png"
import american from "../../public/images/american.png"
import go_to_top from "../../public/images/go-to-top.png"
import Assets from "../Assest";

const Footer = () => {
  const router = useRouter();
  const [about, setAbout] = useState([]);
  useEffect(() => {
    ApiPost("get-home-content", {}).then((res) => {
      if (res?.data?.result) {
        setAbout(res?.data?.result?.about);
      }
    });
  }, []);
  return (
    <>
      <section className="footer">
        <div className="footer-top">
          <div className="container">
            <div className="foot-top-inr">
              <Link href="/" className="foot-logo">
                {/* <a > */}
                <Assets
                  src={"images/foot-logo.png"}
                  alt=""
                />
                {/* </a> */}
              </Link>
              <ul className="sos-icns">
                <li>
                  <PinterestShareButton
                    media={
                      "https://artdevotee.com " + router?.pathname
                    }
                    description={
                      "https://artdevotee.com " + router?.pathname
                    }
                    url={
                      "https://artdevotee.com " + router?.pathname
                    }
                  >
                    {/* <Link>
                      <i className="fa fa-pinterest" aria-hidden="true"></i>
                    </Link> */}
                  </PinterestShareButton>
                </li>
                <li>
                  <FacebookShareButton
                    url={
                      "https://artdevotee.com " + router?.pathname
                    }
                  >
                    <a>
                      <i className="fa fa-facebook" aria-hidden="true"></i>
                    </a>
                  </FacebookShareButton>
                </li>
                <li>
                  <TwitterShareButton
                    url={
                      "https://artdevotee.com " + router?.pathname
                    }
                  >
                    <a>
                      <i className="fa fa-twitter" aria-hidden="true"></i>
                    </a>
                  </TwitterShareButton>
                </li>
                <li>
                  <LinkedinShareButton
                    url={
                      "https://artdevotee.com " + router?.pathname
                    }
                  >
                    <a>
                      <i className="fa fa-linkedin" aria-hidden="true"></i>
                    </a>
                  </LinkedinShareButton>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-mid">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                <div className="fot-fst">
                  <p dangerouslySetInnerHTML={{ __html: about }} />
                  <Link href="/about-us">Read More +</Link>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                <div className="fot-scnd">
                  <h4>Quick Links</h4>
                  <div className="fot-scnd-inr">
                    <ul>
                      <li>
                        <Link href="/">Home</Link>
                      </li>
                      <li>
                       <Link href="/about-us">About Us</Link>
                      </li>
                      <li>
                       <Link href="/">Our Products</Link>
                      </li>
                      <li>
                       <Link href="/sign-up">Sign Up</Link>
                      </li>
                      <li>
                       <Link href="/login">Login</Link>
                      </li>
                    </ul>
                    <ul>
                      <li>
                       <Link href="/contact-us">Contact Us</Link>
                      </li>
                      <li>
                       <Link href="/how-it-works">How It Works</Link>
                      </li>
                      <li>
                       <Link href="/faq">FAQ</Link>
                      </li>
                      <li>
                       <Link href="/terms-condition">Terms and Conditions</Link>
                      </li>
                      <li>
                       <Link href="/privacy-policy">Privacy Policy</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-12">
                <div className="fot-lst">
                  <h4>Get In Touch</h4>
                  <ul>
                    <li>
                      <Assets
                        src={"images/foot-loc.png"}
                        alt=""
                      />
                      Lorem Ipsum is simply dummy caption dummy address info
                      here.
                    </li>
                    <li className="fot-call">
                      <Assets
                        src={"images/fot-call.png"}
                        alt=""
                      />
                      <a className="a_hover" href={`tel:+1 0123456789`}>
                        +1 0123456789
                      </a>
                      /
                      <a className="a_hover" href={`tel:+1 9876543210`}>
                        +1 9876543210
                      </a>{" "}
                    </li>
                    <li>
                      <Assets
                        src={"images/fot-mail.png"}
                        alt=""
                      />
                      <a
                        className="a_hover"
                        href={`mailto:info@artdevotee.com`}
                      >
                        info@artdevotee.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-btm">
          <div className="container">
            <div className="foot-btm-inr">
              <p>
                Copyright &copy; 2022{" "}
               <Link href="/" passHref>
               {/* <a target="_blank" rel="noopener noreferrer"> */}
                  artdevotee.com
                {/* </a> */}
                </Link>{" "}
                | All Rights Reserved.
              </p>
              <ul className="pay-opt">
                <li>
                  <p>Secure Payment Options</p>
                </li>
                <li>
                  <Assets src={"images/visa.png"} alt=""/>
                </li>
                <li>
                  <Assets src={"images/master.png"} alt=""/>
                </li>
                <li>
                  <Assets src={"images/discover.png"} alt=""/>
                </li>
                <li>
                  <Assets src={"images/american.png"}alt="" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div id="stop" className="scrollTop">
        <span>
          <a>
            <Assets src={"images/go-to-top.png"} alt=""/>
          </a>
        </span>
      </div>
    </>
  );
};

export default Footer;
