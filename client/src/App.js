import './App.css';
import React, { useState, useEffect } from "react";

function App() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:7071/api/HttpTrigger")
      .then(response => { return response.json() })
      .then(data => setProducts(data));
  }, [products])

  return (
    <div>
      {products.map(product => (<>
        <p>{product.Name}</p>
      </>))}
    </div>
  );
}

export default App;
