import React, { useState, useEffect, useTransition } from "react";

const Table = ({ data }) => {
  const [tableData, setTableData] = useState([]);
  const [batchSize, setBatchSize] = useState(10);
  const [index, setIndex] = useState(0);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState("Loading...");
  const [isPending, startTransition] = useTransition()

  window.onscroll = function () {
    if (
      window.innerHeight + Math.ceil(window.pageYOffset) >=
      document.body.offsetHeight
    ) {
      renderTable();
    }
  };

  const renderTable = () => {
    if (index < batches.length) {
      setTableData((prev) => [...prev, ...batches[index]]);
      setIndex(index + 1);
    }
  };

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((result) => {
        result.forEach((element) => {
          element.completed = "Initialized";
        });
        const batches = [];
        for (let i = 0; i < result.length; i += batchSize) {
          batches.push(result.slice(i, i + batchSize));
        }
        setBatches(batches);
      });
  }, []);
  useEffect(() => {
    renderTable();
  }, [batches.length]);

  const textChanged = (e, itemid) => {
    
    const { name, value } = e.target;

    const editData = tableData.map((currentItem) =>
      currentItem.id === itemid && name
        ? { ...currentItem, [name]: value }
        : currentItem
    );

    setTableData(editData);
  };

  const Save = (e, itemid, itemIndex) => {
    
    const { name } = e.target;

    let timer = Math.floor(Math.random() * 10 + 1);
    const editData = tableData.map((element) => {
      if (element.id === itemid) {
        element[name] = "API Call - " + timer + " seconds";
      }
      return element;
    });
    setTableData(editData);
    
    
 
    setTimeout(() => {
      const editData = tableData.map((element) => {
        if (element.id === itemid) {
          element[name] = "Completed";
        }
        return element;
      });
      setTableData(editData);
    }, timer * 1000);
  };
  
  return (
    <>
      <h1>Table - Progressive Loading</h1>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>

            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, itemIndex) => (
            <tr key={item.id}>
              <td>{item.id}</td>

              <td style={{ textAlign: "left", paddingLeft: "10px" }}>
                <input
                  name="title"
                  type="text"
                  value={item.title}
                  style={{ width: "500px" }}
                 
                  onChange={(e) => {
                    textChanged(e, item.id);
                  }}
                />
              </td>
              <td style={{ textAlign: "left", paddingLeft: "10px" }}>
                {item.completed === "Initialized" ? (
                  <span style={{ color: "blue", fontWeight: "bold" }}>
                    {item.completed}
                  </span>
                ) : item.completed === "Completed" ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {item.completed}
                  </span>
                ) : (
                  <span style={{ color: "orange", fontWeight: "bold" }}>
                    {item.completed}
                  </span>
                )}
                
              </td>
              <td style={{ textAlign: "left", paddingLeft: "10px" }}>
                <button
                  name="completed"
                  onClick={(e) => {
                    Save(e, item.id, itemIndex);
                  }}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
                  name="completed"
                  onClick={(e) => {
                    renderTable();
                  }}
                >
                  Load More..
                </button>
    </>
  );
};

export default Table;
