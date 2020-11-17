import tokens from '@contentful/forma-36-tokens'

const brandonTextFontStack = tokens.fontStackPrimary
const baseTextFont = {
  fontFamily: brandonTextFontStack,
  fontStyle: 'normal',
  fontWeight: '400',
}

const standardHeadline = {
  ...baseTextFont,
  fontSize: tokens.fontSize2Xl,
  lineHeight: tokens.lineHeightDefault,
  color: tokens.colorTextBase,
}
const smallHeadline = {
  ...standardHeadline,
  fontSize: tokens.fontSizeXl,
}
const largeHeadline = {
  ...standardHeadline,
  fontSize: tokens.fontSize3Xl,
}

const body = {
  ...baseTextFont,
  fontSize: tokens.fontSizeM,
  lineHeight: tokens.lineHeightDefault,
  color: 'text.main',
}
const bodySmall = {
  ...body,
  fontSize: tokens.fontSizeS,
}
const bodyLarge = {
  ...body,
  fontSize: tokens.fontSizeL,
}

let typography = {
  largeHeadline,
  standardHeadline,
  smallHeadline,
  bodyLarge,
  body,
  bodySmall,
}

export default {
  breakpoints: ['600px', '960px', '1440px'],
  colors: {
    blue: '#07c',
    lightgray: '#f6f6ff',
  },
  space: [
    tokens.spacingXs,
    tokens.spacingS,
    tokens.spacingM,
    tokens.spacingL,
    tokens.spacingXl,
    tokens.spacing2Xl,
    tokens.spacing3Xl,
  ],
  fonts: {
    body: tokens.fontStackPrimary,
    heading: 'inherit',
    monospace: tokens.fontStackMonospace,
  },
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  variants: {},
  text: typography,
  buttons: {
    primary: {
      color: tokens.colorBlueBase,
      bg: 'primary',
    },
  },
}
