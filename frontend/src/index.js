import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import store from './redux/store'
import { positions, transitions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transitions: transitions.SCALE
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
    </BrowserRouter>
  </ReduxProvider>
);
