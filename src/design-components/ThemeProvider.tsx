import React, { ReactNode } from 'react'

import { ThemeProvider } from 'emotion-theming'

import theme from './theme'

type PropsT = {
  children: ReactNode
}

const ThreadThemeProvider = ({ children }: PropsT) => (
  <>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </>
)

export default ThreadThemeProvider
