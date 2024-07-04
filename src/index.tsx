import AWS from 'aws-sdk';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import { ContentProvider } from './context/ContentContext';
import { GlobalProvider } from './context/Provider';

const bucketConfig = {
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_REGION
}
AWS.config.update(bucketConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <GlobalProvider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </GlobalProvider>
  </BrowserRouter>

);