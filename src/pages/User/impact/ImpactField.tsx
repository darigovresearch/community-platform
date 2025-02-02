import { Box, Text } from 'theme-ui'

import { numberWithCommas } from 'src/utils/helpers'
import { impactQuestions } from 'src/pages/UserSettings/content/formSections/Impact/impactQuestions'
import { ImpactEmoji } from './ImpactEmoji'

import type { IImpactDataField } from 'src/models'

interface Props {
  field: IImpactDataField
}

export const ImpactField = ({ field }: Props) => {
  const { id, isVisible, value } = field

  const impactQuestion = impactQuestions.find((question) => question.id === id)
  if (!impactQuestion || !isVisible) return null

  const sx = {
    backgroundColor: 'background',
    borderRadius: 1,
    padding: 1,
    mt: 2,
  }

  const prefix = impactQuestion?.prefix || ''
  const suffix = impactQuestion?.suffix || ''
  const label = impactQuestion.label
  const text = `${prefix} ${numberWithCommas(value)} ${suffix} ${label}`

  return (
    <Box sx={sx}>
      <Text variant="label">
        <ImpactEmoji id={id} /> {text}
      </Text>
    </Box>
  )
}
