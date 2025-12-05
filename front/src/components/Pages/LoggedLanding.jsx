import React from "react";
import { Navbar } from "../Navbar/Navbar.jsx";
import Hero from "../Hero/Hero";
import BestBooks from "../BestBooks/BestBooks";
import Banner from "../Banner/Banner";
import AppStoreBanner from "../AppStorePanner/AppStoreBanner";
import AllBooks from "../AllBooks/AllBooks";
import Testimonial from "../Testimonial/Testimonial";
import Footer from "../Footer/Footer";

const LoggedLandingPage = () => {
  return (
    <>
      <Navbar hideRegister={true} />
      <Hero />
      <BestBooks />
      <Banner />
      <AppStoreBanner />
      <AllBooks />
      <Testimonial />
      <Footer />
    </>
  );
};

export default LoggedLandingPage;

