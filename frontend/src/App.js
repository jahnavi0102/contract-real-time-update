// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";


const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:8000";


const App = () => {
  const [contracts, setContracts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingContract, setEditingContract] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [createContract, setCreateContract] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [contractData, setContractData] = useState({
    client_name: "",
    status: "draft",
    contract_type: "",
    effective_date: "",
    expiration_date: "",
    contract_value: "",
    description: "",
    uploaded_by: "admin",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContractData({
      ...contractData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedData = Object.fromEntries(
      Object.entries(contractData).map(([key, value]) => 
        value === "" ? [key, null] : [key, value]
      )
    );
    try {
      const response = await fetch(`${API_URL}/contracts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });
      if (response.ok) {
        setCreateContract(false);
        alert('Contract uploaded successfully!');
      } else {
        alert('Failed to upload contract.');
      }
    } catch (error) { 
        alert(error);
        console.error('Error:', error);
    }
  };

  useEffect(() => {
    const socket = new WebSocket(`${WEBSOCKET_URL}/ws/contracts/`);
    socket.onopen = () => {
        console.log("[open] Connection established");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case "contract_update":
              setContracts((prevContracts) =>
                prevContracts.map((contract) =>
                  contract.contract_id === data.data.contract_id ? data.data : contract
                )
              );
               alert("Contract updated successfully!");
                break;
            case "contract_create":
                fetchContracts()
                break;
            case "contract_delete":
                fetchContracts()
                break;
            default:
                console.log("Unknown message type:", data.type);
        }
    };

    return () => {
        socket.close();
    };
}, []);

useEffect(() => {
    setCurrentPage(1);
    fetchContracts();
  }
  , [searchQuery, statusFilter]);

  const fetchContracts = async (url = null) => {
    try {
      const apiUrl =
            url ||
            `${API_URL}/contracts/?page=${currentPage}&search=${searchQuery}&status=${
              statusFilter === "all" ? "" : statusFilter
            }&page=${currentPage}&page_size=${pageSize}`;

      const response = await axios.get(apiUrl);
      if (response.data.status && response.data.data.count>0) {
        setContracts(response.data.data.results);
        setNextPage(response.data.data.next);
        setPreviousPage(response.data.data.previous);
        setTotalCount(response.data.data.count);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const handleDeleteContract = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/contracts/${id}/`);
      if (response.data.status) {
        alert("Contract deleted successfully!");
      }
    } catch (error) {
      alert('Failed to delete contracts:');
      console.error("Error deleting contract:", error);
    }
  };

  const handleEditContract = (contract) => {
    setEditingContract(true);
    setContractData(contract);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateContract();
  }

  const updateContract = async () => {
    try {
      const response = await axios.put(`${API_URL}/contracts/${contractData.contract_id}/`, contractData);
      if (response.data.status){
        alert("Contract updated successfully!");
        setEditingContract(false);
      }
    } catch (error) {
      alert('Failed to update contracts:');
      console.error("Error updating contract:", error);
    }
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    console.log(nextPage)
    if (nextPage) {
      fetchContracts(nextPage);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchContracts(previousPage);
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="App">
      <h1>Contract Management</h1>
      <div className="filters">
        {!editingContract && !createContract && 
        (<>
        <input
          type="text"
          placeholder="Search by client name or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="finalized">Finalized</option>
          <option value="expired">Expired</option>
        </select>
        </>)}
      <button onClick={() => setCreateContract(true)}>Create Contract</button>     
      </div>

      {createContract && (<form onSubmit={handleSubmit}>
      <input
        type="text"
        name="client_name"
        placeholder="Client Name"
        value={contractData.client_name || ""}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="contract_type"
        placeholder="Contract Type"
        value={contractData.contract_type || ""}
        onChange={handleChange}
      />
      <>
      <div style={{fontSize:"10px",  marginTop:"10px"}}>Effective Date</div>
      <input
        type="date"
        name="effective_date"
        placeholder="Effective Date"
        value={contractData.effective_date || ""}
        onChange={handleChange}
      />
      </>
      <>
      <div style={{fontSize:"10px", marginTop:"10px"}}>Effective Date</div>
      <input
        type="date"
        name="expiration_date"
        placeholder="Expiration Date"
        value={contractData.expiration_date || ""}
        onChange={handleChange}
        min={contractData.effective_date || ""}
      />
      </>
      <input
        type="number"
        name="contract_value"
        placeholder="Contract Value"
        value={contractData.contract_value || ""}
        onChange={handleChange}
      />
      <input
        name="description"
        placeholder="Description"
        value={contractData.description || ""}
        onChange={handleChange}
      />
      <button type="submit">Upload Contract</button>
       <button type="button" onClick={() => setCreateContract(false)}>
            Cancel
       </button>
    </form>)}

      {!createContract && !editingContract && (<div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Contract ID</th>
              <th>Client Name</th>
              <th>Status</th>
              <th>Contract Type</th>
              <th>Effective Date</th>
              <th>Expiration Date</th>
              <th>Contract Value</th>
              <th>Description</th>
              <th>Uploaded By</th>
              <th>Last Modified</th>
              <th>Contract Created</th>
            </tr>
          </thead>
          <tbody>
            {contracts && contracts.map((contract) => (
              <tr key={contract.contract_id}>
                <td>{contract.contract_id || "N/A"}</td>
                <td>{contract.client_name || "N/A"}</td>
                <td>{contract.status || "N/A"}</td>
                <td>{contract.contract_type || "N/A"}</td>
                <td>{contract.effective_date ? new Date(contract.effective_date).toLocaleDateString() : "N/A"}</td>
                <td>{contract.expiration_date ? new Date(contract.expiration_date).toLocaleDateString() : "N/A"}</td>
                <td>{contract.contract_value || "N/A"}</td>
                <td>{contract.description || "N/A"}</td>
                <td>{contract.uploaded_by || "N/A"}</td>
                <td>{contract.last_modified ? new Date(contract.last_modified).toLocaleString() : "N/A"}</td>
                <td>{contract.contract_created ? new Date(contract.contract_created).toLocaleString() : "N/A"}</td>
                <td>
                  <button onClick={() => handleEditContract(contract)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDeleteContract(contract.contract_id)}>Delete</button>
                </td>              
              </tr>
            ))}
          </tbody>
        </table>
      </div>)}


      {editingContract && (
        <form>
          <h2>Edit Contract</h2>
          <label>
            Client Name:
            <input
              type="text"
              name="client_name"
              value={contractData.client_name || ""}
              onChange={handleChange}
              disabled={contractData.status !== 'draft'}
            />
          </label>
          <label>
            Contract Type:
            <input
              type="text"
              name="contract_type"
              value={contractData.contract_type || ""}
              onChange={handleChange}
              disabled={contractData.status !== 'draft'}
            />
          </label>
          <label>
            Effective Date:
            <input
              type="date"
              name="effective_date"
              value={contractData.effective_date || ""}
              onChange={handleChange}
              disabled={contractData.status !== 'draft'}
            />
          </label>
          <label>
            Expiration Date:
            <input
              type="date"
              name="expiration_date"
              value={contractData.expiration_date || ""}
              onChange={handleChange}
              disabled={contractData.status !== 'draft'}
            />
          </label>
          <label>
            Contract Value:
            <input
              type="number"
              name="contract_value"
              value={contractData.contract_value || ""}
              onChange={handleChange}
              disabled={contractData.status !== 'draft'}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={contractData.description || ""}
              onChange={handleChange}
              disabled={contractData.status !== 'draft'}
            />
          </label>
          <label>
            Status:
            <select
              name="status"
              value={contractData.status || "draft"}
              onChange={handleChange}
            >
              {contractData.status === 'finalized' ? (
                <>
                <option value="finalized">Finalized</option>
                <option value="expired">Expired</option>
                </>
              ) : (
                <>
                  <option value="draft">Draft</option>
                  <option value="finalized">Finalized</option>
                  <option value="expired">Expired</option>
                </>
              )}
            </select>
          </label>
          <button type="button" onClick={handleEditSubmit}>Save Changes</button>
          <button type="button" onClick={() => setEditingContract(null)}>
            Cancel
          </button>
        </form>
      )}
      {!createContract && !editingContract && (
        <div className="page-div">
        <button onClick={handlePreviousPage} disabled={!previousPage}>
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(totalCount / pageSize)} 
        </span>
        <button onClick={handleNextPage} disabled={!nextPage}>
          Next
        </button>
      </div>
      )}
      
      
    </div>
  );
};

export default App;