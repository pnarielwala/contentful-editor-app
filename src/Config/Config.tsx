import React, { useEffect } from 'react'
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk'

// Use components from Contentful's design system, Forma 36: https://ctfl.io/f36
import { Heading } from '@contentful/forma-36-react-components'

import { Flex, Text } from '../design-components'

export default function Config({ sdk }: { sdk: AppExtensionSDK }) {
  useEffect(() => {
    // Ready to display our app (end loading state).
    sdk.app.setReady()
    sdk.app.onConfigure(() => ({}))
  }, [])

  return (
    <Flex width="75%" height="100%" mx="auto" my={6} justifyContent="center">
      <Text variant="largeHeadline">Hello World!!</Text>
    </Flex>
  )
}
