import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [editingTxn, setEditingTxn] = useState(null);
  const [statementModal, setStatementModal] = useState({
    show: false,
    txn: null,
    statements: [],
  });

  const parseAmount = (amountStr) =>
    parseFloat(amountStr.replace(/[^0-9.-]+/g, "")) * (amountStr.startsWith("-") ? -1 : 1);

  useEffect(() => {
    fetch("http://localhost:3000/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error(err));
  }, []);

  const recalcBalance = (acc) => {
    return acc.transactions.reduce((sum, txn) => {
      if (txn.statements && txn.statements.length > 0) {
        const txnAmount = txn.statements.reduce(
          (tsum, s) => tsum + Number(s.taxcredit || 0) - Number(s.taxdebit || 0),
          0
        );
        txn.amount = txnAmount >= 0 ? `+${txnAmount}` : `${txnAmount}`;
      }
      return sum + parseAmount(txn.amount);
    }, 0);
  };

  const startEdit = (custId, accId, txnId) => setEditingTxn({ custId, accId, txnId });
  const saveEdit = (custId, accId, txnId, newData) => {
    const updatedCustomers = customers.map((c) => {
      if (c.id !== custId) return c;
      return {
        ...c,
        accounts: c.accounts.map((a) => {
          if (a.id !== accId) return a;
          const updatedTxns = a.transactions.map((t) =>
            t.id === txnId ? { ...t, ...newData } : t
          );
          const balance = recalcBalance({ ...a, transactions: updatedTxns });
          return { ...a, transactions: updatedTxns, balance };
        }),
      };
    });
    setCustomers(updatedCustomers);
    setEditingTxn(null);
  };
  const cancelEdit = () => setEditingTxn(null);

  const deleteTransaction = (custId, accId, txnId) => {
    const updatedCustomers = customers.map((c) => {
      if (c.id !== custId) return c;
      return {
        ...c,
        accounts: c.accounts.map((a) => {
          if (a.id !== accId) return a;
          const updatedTxns = a.transactions.filter((t) => t.id !== txnId);
          const balance = recalcBalance({ ...a, transactions: updatedTxns });
          return { ...a, transactions: updatedTxns, balance };
        }),
      };
    });
    setCustomers(updatedCustomers);
  };

  const openStatement = (txn) => {
    setStatementModal({
      show: true,
      txn,
      statements: txn.statements ? [...txn.statements] : [],
    });
  };
  const closeStatement = () => setStatementModal({ show: false, txn: null, statements: [] });

  const addStatement = () => {
    const newId =
      statementModal.statements.length > 0
        ? Math.max(...statementModal.statements.map((s) => s.taxid)) + 1
        : 1;
    setStatementModal({
      ...statementModal,
      statements: [
        ...statementModal.statements,
        { taxid: newId, taxdate: "", taxheader: "", taxcredit: 0, taxdebit: 0 },
      ],
    });
  };

  const updateStatement = (taxid, field, value) => {
    setStatementModal({
      ...statementModal,
      statements: statementModal.statements.map((s) =>
        s.taxid === taxid ? { ...s, [field]: value } : s
      ),
    });
  };

  const deleteStatement = (taxid) => {
    setStatementModal({
      ...statementModal,
      statements: statementModal.statements.filter((s) => s.taxid !== taxid),
    });
  };

  const saveStatements = () => {
    const { txn, statements } = statementModal;
    const updatedCustomers = customers.map((c) => {
      return {
        ...c,
        accounts: c.accounts.map((a) => {
          const updatedTxns = a.transactions.map((t) =>
            t.id === txn.id ? { ...t, statements } : t
          );
          const balance = recalcBalance({ ...a, transactions: updatedTxns });
          return { ...a, transactions: updatedTxns, balance };
        }),
      };
    });
    setCustomers(updatedCustomers);
    closeStatement();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Customer Banking</h2>

      <div className="accordion" id="customerAccordion">
        {customers.map((customer) => (
          <div key={customer.id} className="accordion-item mb-2">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#customer${customer.id}`}
              >
                <strong>Customer: {customer.name}</strong> &nbsp; (ID: {customer.id})
              </button>
            </h2>
            <div id={`customer${customer.id}`} className="accordion-collapse collapse show">
              <div className="accordion-body">
                <h5>Linked Accounts</h5>
                <div className="accordion nested-accordion">
                  {customer.accounts.map((acc) => (
                    <div key={acc.id} className="accordion-item mb-2">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed account-header"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#acc${acc.id}`}
                        >
                          Account {acc.accountNumber} (Balance: {acc.balance.toFixed(2)})
                        </button>
                      </h2>
                      <div id={`acc${acc.id}`} className="accordion-collapse collapse">
                        <div className="accordion-body">
                          <table className="table table-hover align-middle">
                            <thead className="table-light">
                              <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th className="text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {acc.transactions.map((txn) => (
                                <tr key={txn.id}>
                                  {editingTxn &&
                                  editingTxn.custId === customer.id &&
                                  editingTxn.accId === acc.id &&
                                  editingTxn.txnId === txn.id ? (
                                    <>
                                      <td>
                                        <input
                                          type="date"
                                          className="form-control form-control-sm"
                                          defaultValue={txn.date}
                                          onChange={(e) => (txn.date = e.target.value)}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          defaultValue={txn.description}
                                          onChange={(e) => (txn.description = e.target.value)}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          defaultValue={txn.amount}
                                          onChange={(e) => (txn.amount = e.target.value)}
                                        />
                                      </td>
                                      <td className="text-center">
                                        <button
                                          className="btn btn-sm btn-success me-1"
                                          onClick={() =>
                                            saveEdit(customer.id, acc.id, txn.id, txn)
                                          }
                                        >
                                          Save
                                        </button>
                                        <button
                                          className="btn btn-sm btn-secondary me-1"
                                          onClick={cancelEdit}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className="btn btn-sm btn-info"
                                          onClick={() => openStatement(txn)}
                                        >
                                          Statement
                                        </button>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{txn.date}</td>
                                      <td>{txn.description}</td>
                                      <td
                                        className={
                                          parseAmount(txn.amount) < 0
                                            ? "text-danger"
                                            : "text-success"
                                        }
                                      >
                                        {txn.amount}
                                      </td>
                                      <td className="text-center">
                                        <button
                                          className="btn btn-sm btn-primary me-1"
                                          onClick={() =>
                                            startEdit(customer.id, acc.id, txn.id)
                                          }
                                        >
                                          Edit
                                        </button>
                                        <button
                                          className="btn btn-sm btn-secondary me-1"
                                          onClick={cancelEdit}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className="btn btn-sm btn-danger me-1"
                                          onClick={() =>
                                            deleteTransaction(customer.id, acc.id, txn.id)
                                          }
                                        >
                                          Delete
                                        </button>
                                        <button
                                          className="btn btn-sm btn-info"
                                          onClick={() => openStatement(txn)}
                                        >
                                          Statement
                                        </button>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {statementModal.show && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Statements for {statementModal.txn.description}
                </h5>
                <button type="button" className="btn-close" onClick={closeStatement}></button>
              </div>
              <div className="modal-body">
                <button className="btn btn-sm btn-success mb-2" onClick={addStatement}>
                  Add Statement
                </button>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Tax ID</th>
                      <th>Tax Date</th>
                      <th>Tax Header</th>
                      <th>Credit</th>
                      <th>Debit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statementModal.statements.map((s) => (
                      <tr key={s.taxid}>
                        <td>{s.taxid}</td>
                        <td>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={s.taxdate}
                            onChange={(e) => updateStatement(s.taxid, "taxdate", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={s.taxheader}
                            onChange={(e) =>
                              updateStatement(s.taxid, "taxheader", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={s.taxcredit}
                            onChange={(e) =>
                              updateStatement(s.taxid, "taxcredit", Number(e.target.value))
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={s.taxdebit}
                            onChange={(e) =>
                              updateStatement(s.taxid, "taxdebit", Number(e.target.value))
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteStatement(s.taxid)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeStatement}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={saveStatements}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}