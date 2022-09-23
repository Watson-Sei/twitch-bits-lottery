import React from 'react'
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<App />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
)
