import React, { useState, useEffect } from 'react'

import {
  Heading,
  Note,
  Form,
  SelectField,
  Option,
  FieldGroup,
  TextField,
  Button,
  RadioButtonField,
  FormLabel,
  EntryCard,
  TextLink,
  HelpText,
  DropdownList,
  DropdownListItem,
  Checkbox,
  CheckboxField,
} from '@contentful/forma-36-react-components'
import {
  EditorExtensionSDK,
  Link,
  EntrySys,
  SpaceAPI,
  ContentType,
  NavigatorAPI,
  EntryFieldAPI,
} from 'contentful-ui-extensions-sdk'
import { Box, Flex } from '../design-components'

type PropsT = {
  sdk: EditorExtensionSDK
}

type Validations = {
  in?: Array<string>
  linkContentType?: Array<string>
}[]

type EditorSettings = {
  displayIfField?: string
  displayIfValue?: string
  helpText?: string
}

type Entry = { sys: EntrySys; fields: { [fieldId: string]: { 'en-US': any } } }

const AsyncEntryCard = (props: {
  link?: Link
  linkContentType?: Array<string>
  sdk: EditorExtensionSDK
  onRemove: () => void
  onSelect: (value: any) => void
}) => {
  const [data, setData] = useState<
    { entry?: Entry; contentType?: ContentType } | undefined
  >(undefined)
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true)
        const entry = props.link
          ? await props.sdk.space.getEntry<Entry>(props.link.sys.id)
          : undefined
        const contentTypeId =
          entry?.sys.contentType.sys.id || props.linkContentType?.[0]
        const contentType = contentTypeId
          ? await props.sdk.space.getContentType<ContentType>(contentTypeId)
          : undefined

        setData({ entry, contentType })
        setLoading(false)
      } catch (e) {
        setLoading(false)
        setError(e)
      }
    }

    fetchEntry()
  }, [])

  if (props.link) {
    return (
      <EntryCard
        contentType={data?.contentType?.name}
        title={
          data?.entry?.fields[String(data?.contentType?.displayField)]['en-US']
        }
        status={
          data?.entry?.sys.publishedAt
            ? data?.entry?.sys.publishedVersion + 1 === data?.entry?.sys.version
              ? 'published'
              : 'changed'
            : 'draft'
        }
        loading={loading}
        size="small"
        onClick={() =>
          props.link &&
          props.sdk.navigator.openEntry(props.link.sys.id, { slideIn: true })
        }
        dropdownListElements={
          <>
            <DropdownList>
              <DropdownListItem
                onClick={() =>
                  props.link &&
                  props.sdk.navigator.openEntry(props.link.sys.id, {
                    slideIn: true,
                  })
                }
              >
                Edit
              </DropdownListItem>
              <DropdownListItem onClick={props.onRemove}>
                Remove
              </DropdownListItem>
            </DropdownList>
          </>
        }
      />
    )
  } else {
    const linkContentType = props.linkContentType?.[0]
    return (
      <Box>
        <Box as="span" pr={2}>
          <TextLink
            icon={'Plus'}
            onClick={() =>
              linkContentType &&
              props.sdk.navigator.openNewEntry(linkContentType, {
                slideIn: true,
              })
            }
          >
            {data?.contentType
              ? `Create new ${data.contentType.name} and link`
              : 'Create new Entry and link'}
          </TextLink>
        </Box>
        <Box as="span">
          <TextLink
            icon={'Link'}
            onClick={() =>
              props.sdk.dialogs
                .selectSingleEntry<ContentType>({
                  contentTypes: props.linkContentType,
                })
                .then(
                  (response) =>
                    response &&
                    props.onSelect({
                      sys: {
                        id: response.sys.id,
                        type: 'Link',
                        linkType: 'Entry',
                      },
                    }),
                )
            }
          >
            Link existing Entry
          </TextLink>
        </Box>
      </Box>
    )
  }
}

const Editors = ({ sdk }: PropsT) => {
  const fields = sdk.contentType.fields
  const entries = sdk.entry.fields
  const fieldInterfaces = sdk.editor.editorInterface.controls

  const [initialValues] = useState<{ [fieldId: string]: any }>(() => {
    return Object.entries(entries).reduce((acc, [fieldId, fieldValue]) => {
      return {
        [fieldId]: fieldValue.getValue(),
        ...acc,
      }
    }, {})
  })
  const [values, setValues] = useState<{ [fieldId: string]: any }>(
    initialValues,
  )

  console.log('initialValues', initialValues)
  console.log('values', values)

  const onFieldChange = (fieldId: string, newValue: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      [fieldId]: newValue,
    }))
  }

  return (
    <Box width={[1, '80%']} p={2} margin="auto">
      <Form spacing="default">
        {fields.map((field) => {
          const fieldInterface = fieldInterfaces?.find(
            (face) => face.fieldId === field.id,
          )

          if (!fieldInterface) return null

          const settings = fieldInterface?.settings as
            | EditorSettings
            | undefined
          const displayIfField = settings?.displayIfField as string
          const displayIfValue = settings?.displayIfValue
          const shouldShowField = displayIfField
            ? values[displayIfField] === displayIfValue
            : true

          const validations = field.validations as Validations

          if (!shouldShowField) return null
          console.log(field.id, fieldInterface)
          if (field.type === 'Symbol') {
            if (fieldInterface.widgetId === 'dropdown') {
              console.log('select value', values[field.id])
              return (
                <SelectField
                  required={field.required}
                  name={field.id}
                  id={field.id}
                  labelText={field.name}
                  // value={values[field.id]}
                  selectProps={{
                    value: values[field.id],

                    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
                      console.log('event', event)
                      onFieldChange(field.id, event.currentTarget.value)
                    },
                  }}
                >
                  {[...(validations[0]?.in ?? [])]
                    .reverse()
                    .map((option, index) => {
                      return (
                        <Option key={index} value={option}>
                          {option}
                        </Option>
                      )
                    })}
                </SelectField>
              )
            }
            return (
              <TextField
                required={field.required}
                name={field.id}
                id={field.id}
                labelText={field.name}
                value={values[field.id]}
                helpText={settings?.helpText}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onFieldChange(field.id, event.target.value)
                }
              />
            )
          } else if (
            field.type === 'Array' &&
            fieldInterface.widgetId === 'checkbox'
          ) {
            return (
              <Box>
                <FormLabel htmlFor={field.id} required={field.required}>
                  {field.name}
                </FormLabel>
                <FieldGroup>
                  {(field.items?.validations as Validations)[0]?.in?.map(
                    (option) => {
                      return (
                        <CheckboxField
                          labelText={option}
                          id={field.id}
                          checked={values[field.id].includes(option)}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) =>
                            event.target.checked
                              ? onFieldChange(field.id, [
                                  option,
                                  ...(values[field.id] as Array<string>).filter(
                                    (currOption) => currOption !== option,
                                  ),
                                ])
                              : onFieldChange(field.id, [
                                  ...(values[field.id] as Array<string>).filter(
                                    (currOption) => currOption !== option,
                                  ),
                                ])
                          }
                        />
                      )
                    },
                  )}
                </FieldGroup>
                {settings && (
                  <Box mt={1} sx={{ fontStyle: 'italic' }}>
                    <HelpText>{settings.helpText}</HelpText>
                  </Box>
                )}
              </Box>
            )
          } else if (field.type === 'Boolean') {
            return (
              <Box>
                <FormLabel htmlFor={field.id} required={field.required}>
                  {field.name}
                </FormLabel>
                <Box mt={1}>
                  <RadioButtonField
                    labelText="Yes"
                    id={field.id}
                    name="yesOption"
                    checked={values[field.id] === true}
                    value="yes"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      onFieldChange(field.id, event.target.checked)
                    }
                  />
                  <RadioButtonField
                    labelText="No"
                    id={field.id}
                    name="NoOption"
                    checked={values[field.id] === false}
                    value="no"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      onFieldChange(field.id, !event.target.checked)
                    }
                  />
                </Box>
                {settings && (
                  <Box mt={1} sx={{ fontStyle: 'italic' }}>
                    <HelpText>{settings.helpText}</HelpText>
                  </Box>
                )}
              </Box>
            )
          } else if (field.type === 'Link' && field.linkType === 'Entry') {
            const entryValue = values[field.id]

            return (
              <Box>
                <FormLabel htmlFor={field.id} required={field.required}>
                  {field.name}
                </FormLabel>
                <AsyncEntryCard
                  link={entryValue}
                  linkContentType={validations[0].linkContentType}
                  sdk={sdk}
                  onRemove={() => onFieldChange(field.id, undefined)}
                  onSelect={(value: any) => onFieldChange(field.id, value)}
                />
                {settings && (
                  <Box mt={1} sx={{ fontStyle: 'italic' }}>
                    <HelpText>{settings.helpText}</HelpText>
                  </Box>
                )}
              </Box>
            )
          } else {
            return null
          }
        })}
        <FieldGroup>
          <Flex>
            <Button>Submit</Button>
            <Button
              type="reset"
              buttonType="naked"
              onClick={(event) => {
                event.preventDefault()
                setValues(initialValues)
              }}
            >
              Reset form
            </Button>
          </Flex>
        </FieldGroup>
      </Form>
    </Box>
  )
}

export default Editors
