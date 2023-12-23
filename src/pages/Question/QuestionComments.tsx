import { CommentList } from 'oa-components'
import type { IDiscussionComment } from 'src/models'
import { Box } from 'theme-ui'

interface IProps {
  comments: IDiscussionComment[]
}

export const QuestionComments = ({ comments }: IProps) => {
  return (
    <>
      {
        <Box mt={5}>
          <CommentList comments={comments} />
        </Box>
      }
    </>
  )
}
