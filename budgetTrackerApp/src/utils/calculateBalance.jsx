const calculateBalance = (transactions) => {
  return transactions.reduce((total, txn) => total + txn.amount, 0);
};

export default calculateBalance;