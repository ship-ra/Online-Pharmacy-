import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [photo, setPhoto] = useState();
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + (item.price)*item.quantity;
      });
      return total.toLocaleString("Hin-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

//razorpay order 
const checkouthandler = async() => {
  try {
    let total = 0;
    let quantity =0;
    cart?.map((item) => {
      quantity = item.quantity
      total = total + item.price;
    });
    const { data: {order} } = await axios.post("/api/v1/product/razorpay/order",{
      amount: total
    })
    const { data: { key } } = await axios.get("http://www.localhost:8080/api/getkey")

    const options = {
      key, // Enter the Key ID generated from the Dashboard
      amount: order.amount, 
      currency: "INR",
      name: "Online Pharmacy",
      description: "MERN stack project ",
      order_id: order.id, 
      handler: function (response){
        const razorpay_payment_id = response.razorpay_payment_id;
        const razorpay_order_id = response.razorpay_order_id;
        const razorpay_signature = response.razorpay_signature;
        const { data } = axios.post("/api/v1/product//paymentverification", {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          cart,
          quantity
        });
        toast.success("Payment Completed Successfully ");
        localStorage.removeItem("cart");
        setCart([]);
        navigate("/dashboard/user/orders");
        window.location.reload()
    },
      prefill: {
          name: auth?.user?.name,
          email: auth?.user?.email,
          contact: auth?.user?.phone,
      },
      notes: {
          address: "Razorpay Corporate Office"
      },
      theme: {
          color: "#0B380A"
      }
    };
    const razor = new window.Razorpay(options);
    razor.on('payment.failed', function (response){
      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
      toast.error("Payment Failed! Try again ");
      // const { data } = axios.post("/api/v1/product//paymentfailure", {
      //     cart,
      //   });
      window.location.reload()
    });
    razor.open();
    
    
  } catch (error) {
    console.log(error)
}
}

  // Function to add an item to the cart or increase its quantity
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      // If the item is already in the cart, increase its quantity
      const updatedCart = cart.map((item) => {
        if (item._id === product._id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      // If the item is not in the cart, add it with a quantity of 1
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    toast.success("Item Added to cart");
  };

  // Function to decrease the quantity of a product in the cart
  const decreaseQuantity = (pid) => {
    const updatedCart = cart.map((item) => {
      if (item._id === pid) {
        const newQuantity = Math.max(item.quantity - 1, 0);
        if (newQuantity === 0) {
          // If the quantity reaches 0, remove the item from the cart
          return null;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // Remove items with quantity 0
    const updatedCartWithoutZeroQuantity = updatedCart.filter(
      (item) => item !== null
    );

    setCart(updatedCartWithoutZeroQuantity);
    localStorage.setItem("cart", JSON.stringify(updatedCartWithoutZeroQuantity));
};

  //upload function
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("id", auth?.user?._id);
      productData.append("name", auth?.user?.name);
      productData.append("photo", photo);
      
      const { data } = axios.post(
        "/api/v1/product/prescription",
        productData
      );
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("Prescription uploaded Successfully");
        window.location.reload()
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };


  return (
    <Layout>
      <div className=" cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container ">
          <div className="row ">
            <div className="col-md-7  p-0 m-0">
              {cart?.map((p) => (
                <div className="row card flex-row" key={p._id}>
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="100%"
                      height={"130px"}
                    />
                  </div>
                  <div className="col-md-4">
                    <b><p>{p.name.substring(0,20)}...</p></b>
                    <p>{p.description.substring(0, 30)}...</p>
                    <p>Price : {p.price}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => decreaseQuantity(p._id)}
                  >
                    -
                  </button>
                  <button
                    className="btn btn-sm btn-outline-success"
                  >
                  <b> {p.quantity} </b>
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => addToCart(p)}
                  >
                    +
                  </button>
                  </div>
                </div>
                
              ))}
              {cart.length? (<div>
                <button className="btn btn-primary" onClick={() => {setCart([])}}>
                  Clear Cart
                </button>
              </div>) : ("")}
            </div>
            <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )}
              {!auth?.user ? ("") : (
              <>
                {photo? (
                <div className="column">
                <label className=" col-md-12">
                  { photo.name }
                  <input
                    type="file"
                    name="fphoto"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
                <button className="btn btn-sm btn-success col-md-4" onClick={handleUpload}>
                   Upload 
                </button>
                </div>
                ) :
                (<label className="btn btn-outline-success col-md-12">
                  {"Upload Prescription"}
                  <input
                    type="file"
                    name="fphoto"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>)}
              </>)}
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    

                    <button
                      className="btn btn-primary"
                      onClick={checkouthandler}
                    >
                      Make Payment
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;