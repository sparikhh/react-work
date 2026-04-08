import TransactionTable from "./TransactionTable";

const AccountAccordion = ({ customer }) => {
  const accounts = customer?.accounts || [];

  if (accounts.length === 0) return <p>No accounts found.</p>;

  return (
    <div className="accordion nested-accordion" id={`accountAccordion-${customer.id}`}>
      {accounts.map((acc) => (
        <div className="accordion-item" key={acc.id}>
          <h2 className="accordion-header" id={`accHeading-${acc.id}`}>
            <button
              className="accordion-button collapsed account-header"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#accData-${acc.id}`}
            >
              {acc.type} - ****{acc.number} (Balance: ₹{acc.transactions.reduce((s, t) => s + t.amount, 0)})
            </button>
          </h2>

          <div
            id={`accData-${acc.id}`}
            className="accordion-collapse collapse"
            data-bs-parent={`#accountAccordion-${customer.id}`}
          >
            <div className="accordion-body">
              <TransactionTable account={acc} customer={customer} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountAccordion;