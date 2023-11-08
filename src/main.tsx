// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WithAppContextHOC } from '~/common/context/WithAppContextHOC'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <WithAppContextHOC>
      <App />
    </WithAppContextHOC>
  // </React.StrictMode>,
)
