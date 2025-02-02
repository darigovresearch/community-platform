import * as React from 'react'
import { Heading, Box, Switch, Text } from 'theme-ui'
import { observer } from 'mobx-react'
import { Field } from 'react-final-form'

import { FlexSectionContainer } from './elements'
import { fields } from 'src/pages/UserSettings/labels'
import { DEFAULT_PUBLIC_CONTACT_PREFERENCE } from 'src/pages/UserSettings/constants'

import type { IUser } from 'src/models'

interface Props {
  isContactableByPublic: IUser['isContactableByPublic']
}

export const PublicContactSection = observer(
  ({ isContactableByPublic }: Props) => {
    const { description, placeholder, title } = fields.publicContentPreference
    const isChecked = isContactableByPublic || DEFAULT_PUBLIC_CONTACT_PREFERENCE
    const name = 'isContactableByPublic'

    return (
      <FlexSectionContainer>
        <Heading variant="small">{title}</Heading>
        <Text mt={4} mb={4}>
          {description}
        </Text>
        <Box mt={2}>
          <Field name={name}>
            {({ input }) => {
              return (
                <Switch
                  checked={isChecked}
                  data-cy={name}
                  data-testid={name}
                  label={placeholder}
                  onChange={() => input.onChange(!isChecked)}
                  sx={{
                    'input:checked ~ &': {
                      backgroundColor: 'green',
                    },
                  }}
                />
              )
            }}
          </Field>
        </Box>
      </FlexSectionContainer>
    )
  },
)
