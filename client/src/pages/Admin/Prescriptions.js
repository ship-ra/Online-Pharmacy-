import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  
  const [prescriptions, setPrescriptions] = useState([]);
  const [auth, setAuth] = useAuth();
  

  const getPrescriptions = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-prescription");
      setPrescriptions(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getPrescriptions();
  }, [auth?.token]);

//   const handleChange = async (orderId, value) => {
//     try {
//       const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
//         status: value,
//       });
//       getOrders();
//     } catch (error) {
//       console.log(error);
//     }
//   };

  return (
    <Layout title={"All Orders Data"}>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Prescriptions</h1>
          {prescriptions?.map((p, i) => {
            return (
              <div className="border shadow">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Prescriptions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>{p?.name}</td>
                      <td>
                      {p?.photo && p?.photo.data ? (
                <img
                src={`/api/v1/product/prescription-photo/${p.id}`}
                  className="card-img-top"
                  alt={p.name}
                  width="100px"
                //   height={"500px"}
                />
              ) : (
                "No photo available"
              )}
                        {/* <img
                          src={`/api/v1/product/all-prescription/${p.id}`}
                          className="card-img-top"
                          alt={p.name}
                          width="100px"
                          height={"100px"}
                        /> */}
                      </td>
                      
                    </tr>
                  </tbody>
                </table>
                </div>
          )}  
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;