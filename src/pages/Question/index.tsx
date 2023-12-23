import { MODULE } from 'src/modules'
import type { IPageMeta } from '../PageList'
import QuestionRoutes from './question.routes'
import {
  QuestionStore,
  QuestionStoreContext,
} from 'src/stores/Question/question.store'
import { useCommonStores } from '../../index'
import {
  DiscussionStore,
  DiscussionStoreContext,
} from 'src/stores/Discussions/discussions.store'

export const QuestionModuleContainer = () => {
  const rootStore = useCommonStores()
  return (
    <QuestionStoreContext.Provider value={new QuestionStore(rootStore)}>
      <DiscussionStoreContext.Provider value={new DiscussionStore(rootStore)}>
        <QuestionRoutes />
      </DiscussionStoreContext.Provider>
    </QuestionStoreContext.Provider>
  )
}

export const QuestionModule: IPageMeta = {
  moduleName: MODULE.QUESTION,
  path: '/questions',
  component: <QuestionModuleContainer />,
  title: 'Questions',
  description: 'Welcome to question and answer',
}
