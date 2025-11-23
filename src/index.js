import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';





function App() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPizzas() {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching pizzas from API...');
        const response = await fetch("https://pizza-menu-q7xq.onrender.com/");
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch pizzas: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Pizzas fetched successfully:', data);
        setPizzas(data);
      } catch (err) {
        console.error('Error fetching pizzas:', err);
        // Provide more detailed error message
        const errorMessage = err.message || 'Network error. Please check your connection and try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchPizzas();
  }, []);

  return <div className='container'>
    <Header />
    <Menu pizzas={pizzas} loading={loading} error={error} />
    <Footer />
  </div>;
}


function Header() {
  return <>
    <header className='header'>
      <h1>Fast React Pizza Co.</h1>
    </header>
  </>
}

function Menu({ pizzas, loading, error }) {
  const numPizzas = pizzas.length;

  if (loading) {
    return (
      <main className='menu'>
        <h2>Our menu</h2>
        <p>Loading our delicious pizzas...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className='menu'>
        <h2>Our menu</h2>
        <p>Sorry, we're having trouble loading our menu. Please try again later.</p>
        <p>Error: {error}</p>
      </main>
    );
  }

  return (
    <main className='menu'>
      <h2>Our menu</h2>

      {numPizzas > 0 ? (
        <>
          <p>
            Authentic Italian cuisine. {numPizzas} creative dishes to choose from.
            All from our stone oven, all organic, all delicious.
          </p>

          <ul className='pizzas'>
            {pizzas.map(pizza => (
              <Pizza pizzaObj={pizza} key={pizza.name} />
            ))}
          </ul>
        </>
      ) : <p>We're still working on our menu. Please come back later.</p>}
    </main>
  );
}

function Pizza({ pizzaObj }) {
  // Check if pizza is sold out (quantity is 0)
  const isSoldOut = pizzaObj.quantity === 0;

  return (
    <li className={`pizza ${isSoldOut ? 'sold-out' : ''}`}>
      <img src={pizzaObj.image} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>{isSoldOut ? 'SOLD OUT' : `$${pizzaObj.quantity}`}</span>
      </div>
    </li>
  );
}

function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;
  console.log(isOpen);


  return (<>
    <footer className='footer'>
      {isOpen ? (
        <Order closeHour={closeHour} />
      ) : (
        <p>
          We are happy to welcome you between {openHour}:00 and {closeHour}:00.
        </p>
      )}
    </footer >
  </>
  )
}

function Order({ closeHour }) {
  return (
    <div className='order'>
      <p>
        We're open until {closeHour}:00. Come visit us or order online
      </p>
      <button className='btn'>Order</button>
    </div>
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);