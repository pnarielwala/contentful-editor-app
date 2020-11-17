import React from 'react'
import { render } from 'react-dom'

// Use the Contentful's App SDK to get access to the web app.
// Reference: https://ctfl.io/app-sdk
import {
  init,
  locations,
  AppExtensionSDK,
  EditorExtensionSDK,
} from 'contentful-ui-extensions-sdk'
import '@contentful/forma-36-react-components/dist/styles.css'
import '@contentful/forma-36-fcss/dist/styles.css'

import Config from './Config'
import './index.css'
import { ThemeProvider } from 'emotion-theming'
import theme from './design-components/theme'
import Editors from './Editors/Editors'

// You can render different components for each location in the Contentful web app.
// Learn more about all app locations here: https://ctfl.io/app-locations
init((sdk) => {
  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    render(
      <ThemeProvider theme={theme}>
        <Config sdk={sdk as AppExtensionSDK} />
      </ThemeProvider>,
      document.getElementById('root'),
    )
  } else if (sdk.location.is(locations.LOCATION_ENTRY_EDITOR)) {
    return render(
      <ThemeProvider theme={theme}>
        <Editors sdk={sdk as EditorExtensionSDK} />
      </ThemeProvider>,
      document.getElementById('root'),
    )
  } else {
    return null
  }
})
