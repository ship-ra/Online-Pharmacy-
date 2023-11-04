import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import validator from "validator";
const Profile = () => {
  //context
  const [auth, setAuth] = useAuth();

  //state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  //get user data
  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress1(address1);
    setAddress2(address2);
    setAddress3(address3);
    setCity(city);
    setPincode(pincode);
    setState(state);

  }, [auth?.user]);

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    validateForm()
    if(validateForm()){
    try {
      const {data} = await axios.put("/api/v1/auth/update-profile", {
        name,
        email,
        password,
        phone,
        address1,
        address2,
        address3,
        city,
        pincode,
        state,
        country,
      });
      if(data?.error){
        toast.error(data?.error)
      }else{
        setAuth({...auth, user:data?.updatedUser})
        let ls = localStorage.getItem('auth')
        ls = JSON.parse(ls)
        ls.user = data.updatedUser
        localStorage.setItem('auth', JSON.stringify(ls))
        toast.success("Profile Updated Successfully ")
      }
      
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }
};

  const clearErrors = () => {
    const errors = document.getElementsByClassName('formerror');
    for(let item of errors)
    {
        item.innerHTML = "";
    }


}
const seterror =(id, error) => {
    //sets error inside tag of id 
    const element = document.getElementById(id);
    element.getElementsByClassName('formerror')[0].innerHTML = error;

}

const validateForm = () => {
    var returnval = true;
    clearErrors();

    //perform validation and if validation fails, set the value of returnval to false
    const name = document.forms['myForm']["fname"].value;
    if (!isNaN(name)){
        seterror("name", "*Enter a valid name");
        returnval = false;
    }

    if (name.length === 0){
        seterror("name", "*Length of name cannot be zero!");
        returnval = false;
    }
    var password = document.forms['myForm']["fpass"].value;
    if (password.length < 8){
        seterror("pass", "*Password should be atleast 8 characters long!");
        returnval = false;
    }
    if (validator.isStrongPassword(password, {
      minLength: 8, minLowercase: 1,
      minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
      returnval = true;
    } else {
      if(validator.isStrongPassword(password, {
        minLength: 8, minLowercase: 0,
        minUppercase: 1, minNumbers: 1, minSymbols: 1
      })){
        seterror("pass", "*Password should have atleast 1 lowercase character!");
        returnval=false
      }
      if(validator.isStrongPassword(password, {
        minLength: 8, minLowercase: 1,
        minUppercase: 0, minNumbers: 1, minSymbols: 1
      })){
        seterror("pass", "*Password should have atleast 1 Uppercase character!");
        returnval=false
      }
      if(validator.isStrongPassword(password, {
        minLength: 8, minLowercase: 1,
        minUppercase: 1, minNumbers: 0, minSymbols: 1
      })){
        seterror("pass", "*Password should have atleast 1 Numeric character!");
        returnval=false
      }
      if(validator.isStrongPassword(password, {
        minLength: 8, minLowercase: 1,
        minUppercase: 1, minNumbers: 1, minSymbols: 0
      })){
        seterror("pass", "*Password should have atleast 1 Special character!");
        returnval=false
      }
    }
    
    var phone = document.forms['myForm']["fphone"].value;
    if (phone.length !== 10){
        seterror("phone", "*Enter 10 digit Phone Number!");
        returnval = false;
    }
    var expr = /^(0|91)?[6-9][0-9]{9}$/;
    if (!expr.test(phone)) {
        seterror("phone", "*Enter Valid Phone Number!");
        }
    if (isNaN(phone)){
      seterror("phone", "*Enter a valid Phone Number!");
      returnval = false;
    }
    var address1 = document.forms['myForm']["faddress1"].value;
    if (address1.length === 0){
        seterror("address1", "**Required field!");
        returnval = false;
    }
    if (address2.length === 0){
        seterror("address2", "**Required field!");
        returnval = false;
    }
    if (address3.length === 0){
        seterror("address3", "**Required field!");
        returnval = false;
    }
    if (city.length === 0){
        seterror("city", "*Required field!");
        returnval = false;
    }
    if (state.length === 0){
        seterror("state", "*Required field!");
        returnval = false;
    }
    if (city.length === 0){
        seterror("country", "*Required field!");
        returnval = false;
    }
    var pincode = document.forms['myForm']["fpincode"].value;
    if (pincode.length !== 6){
        seterror("pincode", "*Enter a valid 6 digit pincode Number!");
        returnval = false;
    }
    
    
    return returnval;
}
  return (
    <Layout title={"Your Profile"}>
        <div className='container-fluid m-3 p-3 dashboard'>
        <div className='row'>
            <div className='col-md-3'>
                <UserMenu/>
            </div>
            <div className='col-md-9'>
            <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit} name='myForm'>
          <h4 className="title">USER PROFILE </h4>
          <div className="mb-3" id='name'>
            <input
              type="text"
              name='fname'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Name"
              
              autoFocus
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              
              disabled
            />
          </div>
          <div className="mb-3" id='pass'>
            <input
              type="password"
              name='fpass'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3" id='phone'>
            <input
              type="text"
              name="fphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Phone"
              
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3" id="address1">
            <input
              type="text"
              name="faddress1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="House No., Building Name"             
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3" id="address2">
            <input
              type="text"
              name="faddress2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Road Name, Area, Colony"             
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3" id="address3">
            <input
              type="text"
              name="faddress3"
              value={address3}
              onChange={(e) => setAddress3(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Landmark(Optional)"             
            /><span class="formerror"> </span>
          </div>
          <div className="col-sm mb-3" id="city">
            <input
              type="text"
              name="fcity"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="City"             
            /><span class="formerror"> </span>
          </div>
          <div className="col-sm mb-3" id="pincode">
            <input
              type="Number"
              name="fpincode"
              value={pincode}
              maxLength={6}
              onChange={(e) => setPincode(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Pincode"             
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3" id="state">
            <input
              type="text"
              name="fstate"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="State"             
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3" id="country">
            <input
              type="text"
              name="fcountry"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Country"             
            /><span class="formerror"> </span>
          </div>
          <button type="submit" className="btn btn-primary">
            UPDATE
          </button>
        </form>
      </div>
        </div>
        </div>
        </div>
    </Layout>
  )
}

export default Profile;