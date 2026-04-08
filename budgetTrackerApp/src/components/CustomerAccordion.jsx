import { useSelector } from "react-redux";
import AccountAccordion from "./AccountAccordion";

const CustomerAccordion = () => {
  const customers = useSelector((state) => state.customers);

  if (!customers || customers.length === 0)
    return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      {/* <h2>Customer Management</h2> */}

      <div className="accordion" id="customerAccordion">
        {customers.map((cust) => (
          <div className="accordion-item" key={cust.id}>
            <h2 className="accordion-header" id={`heading-${cust.id}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#customer-${cust.id}`}
                aria-expanded="false"
              >
                <div className="d-flex w-100 justify-content-between">
                  <span>
                    <strong>ID:</strong> {cust.id} &nbsp; | &nbsp;
                    <strong>Name:</strong> {cust.name} &nbsp; | &nbsp;
                    <strong>Mobile:</strong> {cust.mobile} &nbsp; | &nbsp;
                    <strong>Email:</strong> {cust.email}
                  </span>
                </div>
              </button>
            </h2>

            <div
              id={`customer-${cust.id}`}
              className="accordion-collapse collapse"
              data-bs-parent="#customerAccordion"
            >
              <div className="accordion-body">
                <h5>Linked Accounts</h5>
                <AccountAccordion customer={cust} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerAccordion;