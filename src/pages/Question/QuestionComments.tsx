import { CommentList, CreateComment } from 'oa-components'
import { useState } from 'react'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import type { IDiscussionComment } from 'src/models'
import { Box } from 'theme-ui'

interface IProps {
  comments: IDiscussionComment[]
  activeUser: any
  onSubmit: (comment: string) => void
}

export const QuestionComments = ({
  comments,
  activeUser,
  onSubmit,
}: IProps) => {
  const [comment, setComment] = useState('')

  return (
    <>
      {
        <Box mt={5}>
          <CommentList comments={comments} />
          <CreateComment
            maxLength={MAX_COMMENT_LENGTH}
            comment={comment}
            onChange={setComment}
            onSubmit={() => {
              onSubmit(comment)
              setComment('')
            }}
            isLoggedIn={!!activeUser}
          />
        </Box>
      }
    </>
  )
}
