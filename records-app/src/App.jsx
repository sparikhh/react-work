import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "./customerSlice";
import { Routes, Route, useNavigate } from "react-router-dom";
import StatementPage from "./StatementPage";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<CustomerList />} />
      <Route path="/statement" element={<StatementPage />} />
    </Routes>
  );
}

function CustomerList() {
  const { list } = useSelector((s) => s.customers);
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      {/* <h2 className="mb-4">Customer Management</h2> */}

      <div className="accordion">
        {list.map((customer) => (
          <div className="accordion-item" key={customer.id}>
            <button
              className="accordion-button"
              data-bs-toggle="collapse"
              data-bs-target={`#cust-${customer.id}`}
            >
              {customer.name} (ID: {customer.id})
            </button>

            <div
              id={`cust-${customer.id}`}
              className="accordion-collapse collapse show"
            >
              <div className="accordion-body">
                {customer.accounts.map((acc) => (
                  <div key={acc.id} className="mb-4 border p-3 rounded">
                    <h6>Account ID: {acc.id}</h6>

                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {acc.transactions.map((txn) => (
                          <tr key={txn.id}>
                            <td>{txn.date}</td>
                            <td>{txn.description}</td>
                            <td>{txn.amount}</td>

                            <td>
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() =>
                                  navigate("/statement", {
                                    state: {
                                      customer,
                                      acc,
                                      selectedTxn: txn,
                                    },
                                  })
                                }
                              >
                                Statement
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}