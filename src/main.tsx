// import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import queryString from 'query-string'
import { SnackbarProvider, closeSnackbar } from 'notistack'
import { RiCloseFill } from 'react-icons/ri'
import App from './App.tsx'
import './import-fonts.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <SnackbarProvider
    maxSnack={5}
    autoHideDuration={60000}
    // preventDuplicate
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    style={{
      borderRadius: '8px',
      maxWidth: '430px',
    }}
    action={(snackbarId) => (
      <button onClick={() => closeSnackbar(snackbarId)}>
        <RiCloseFill fontSize='25px' />
      </button>
    )}
  >
    <HashRouter>
      <QueryParamProvider 
        adapter={ReactRouter6Adapter}
        // NOTE: See also https://www.npmjs.com/package/query-string#api
        options={{
          searchStringToObject: (searchStr) => queryString.parse(searchStr, { arrayFormat: 'separator', arrayFormatSeparator: ',' }),
          objectToSearchString: (obj) => queryString.stringify(obj, { arrayFormat: 'separator', arrayFormatSeparator: ',' }),
        }}
      >
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </QueryParamProvider>
    </HashRouter>
  </SnackbarProvider>
  // </React.StrictMode>,
)
