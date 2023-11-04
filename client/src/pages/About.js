import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title = {"About us - Online Pharmacy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/aboutus.jpg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
    
            @Online Solution To Provide The Quality Medical Service To Every individual.All In One Platform, For Purchasing The Various Medical Appratus And Medicine Of Different Compositions.
            Save Time And Provide Home Dlivery Service Of Medicine.
            Interactive and Better Interface To Meet The Goal of Customer Satisfaction.

          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;