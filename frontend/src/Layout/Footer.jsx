import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaPinterest,
  FaSnapchat,
} from "react-icons/fa";

const Footer = () => {
  const newDate = new Date();
  let year = newDate.getFullYear();

  return (
    <>
      <div className="footer">
        <div className="newsletter-sub">
          <h2 className="footer-titles">Subscribe to our newsletter</h2>
          <input type="email" name="" id="" placeholder="Email" />
          <button>Subscribe</button>
        </div>

        <div className="footer-content">
          <div className="enquiries">
            <h2 className="footer-titles">Customer Care</h2>
            <p>Contact Us</p>
            <p>Customer Service</p>

            <p>Gift Card & Store Credit</p>
            <p>Payment</p>
            <p>Returns & Exchanges</p>
          </div>
          <div className="shop-info">
            <h2 className="footer-titles">Our Company</h2>
            <p>About Us</p>
            <p>Affiliates</p>
            <p>Sustainability</p>
            <p>Careers</p>
            <p>Investor relations</p>
          </div>
          <div className="socials">
            <h2 className="footer-titles">Follow Us</h2>
            <p>
              Instagram <FaInstagram />{" "}
            </p>
            <p>
              Twitter <FaTwitter />
            </p>
            <p>
              Facebook <FaFacebook />
            </p>
            <p>
              Pinterest <FaPinterest />
            </p>
            <p>
              Snapchat <FaSnapchat />
            </p>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <p>Copyright &copy; 2002 - {year}</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
