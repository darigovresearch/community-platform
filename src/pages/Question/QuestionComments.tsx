import { CommentList, CreateComment } from 'oa-components'
import { useState } from 'react'
import { useCommonStores } from '../../'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import type { IDiscussionComment } from 'src/models'
import type { DiscussionStore } from 'src/stores/Discussions/discussions.store'
import { Box } from 'theme-ui'

interface IProps {
  comments: IDiscussionComment[]
  discussionStore: DiscussionStore
}

export const QuestionComments = ({ comments }: IProps) => {
  const { stores } = useCommonStores()
  const [comment, setComment] = useState('')

  const onSubmit = async () => {
  }

  return (
    <>
      {
        <Box mt={5}>
          <CommentList comments={comments} />
          <CreateComment
              maxLength={MAX_COMMENT_LENGTH}
              comment={comment}
              onChange={setComment}
              onSubmit={onSubmit}
              isLoggedIn={!!stores.userStore.activeUser}
            />
        </Box>
      }
    </>
  )
}
