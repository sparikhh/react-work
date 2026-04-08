import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomerAccordion from "./components/CustomerAccordion";
import StatementPage from "./components/StatementPage";

function App() {
  const customers = useSelector((state) => state.customers);

  return (
    <Router>
      <div className="container mt-4">
        <h2>Customer Banking App</h2>

        <Routes>
          <Route path="/" element={<CustomerAccordion customers={customers} />} />
          <Route path="/statement/:custId/:accId" element={<StatementPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;