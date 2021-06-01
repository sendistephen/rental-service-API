import React from 'react';
import './App.css';
import Header from './components/shared/Header';
import RentalHome from './pages/RentalHome';

const App = () => {
  return (
    <div className="App">
      <Header />
      <RentalHome />
    </div>
  );
};

export default App;
