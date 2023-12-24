jest.mock('../../stores/common/module.store')

import '@testing-library/jest-dom'
import { ThemeProvider } from '@emotion/react'
import { cleanup, render, waitFor, act, screen } from '@testing-library/react'
import { Provider } from 'mobx-react'
import {
  Route,
  RouterProvider,
  createMemoryRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import userEvent from '@testing-library/user-event'
import type { QuestionStore } from 'src/stores/Question/question.store'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { useDiscussionStore } from 'src/stores/Discussions/discussions.store'
import { FactoryQuestionItem } from 'src/test/factories/Question'
import { faker } from '@faker-js/faker'
import { questionRouteElements } from './question.routes'
import {
  FactoryDiscussion,
  FactoryDiscussionComment,
} from 'src/test/factories/Discussion'

const Theme = testingThemeStyles

// Similar to issues in Academy.test.tsx - stub methods called in user store constructor
// TODO - replace with mock store or avoid direct call
jest.mock('src/index', () => ({
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {},
      aggregationsStore: {
        aggregations: {
          users_totalUseful: {
            HowtoAuthor: 0,
          },
          users_verified: {
            HowtoAuthor: true,
          },
        },
      },
      howtoStore: {},
      tagsStore: {
        categoryTags: [
          {
            categories: ['question'],
            label: 'test tag 1',
            image: 'test img',
          },
        ],
        setTagsCategory: jest.fn(),
      },
      questionCategoriesStore: {
        allQuestionCategories: [],
      },
    },
  }),
}))

const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}))

class mockQuestionStoreClass implements Partial<QuestionStore> {
  setActiveQuestionItemBySlug = jest.fn()
  needsModeration = jest.fn().mockResolvedValue(true)
  incrementViewCount = jest.fn()
  activeQuestionItem = FactoryQuestionItem({
    title: 'Question article title',
  })
  QuestionUploadStatus = {} as any
  updateUploadStatus = {} as any
  formatQuestionCommentList = jest.fn()
  getActiveQuestionUpdateComments = jest.fn()
  lockQuestionItem = jest.fn()
  lockQuestionUpdate = jest.fn()
  unlockQuestionUpdate = jest.fn()
  upsertQuestion = jest.fn()
  fetchQuestions = jest.fn().mockResolvedValue([])
  fetchQuestionBySlug = jest.fn()
}

const mockQuestionStore = new mockQuestionStoreClass()

jest.mock('src/stores/Question/question.store')
jest.mock('src/stores/Discussions/discussions.store')

describe('question.routes', () => {
  beforeEach(() => {
    ;(useQuestionStore as jest.Mock).mockReturnValue(mockQuestionStore)
    ;(useDiscussionStore as jest.Mock).mockReturnValue({
      fetchOrCreateDiscussionBySource: jest.fn().mockResolvedValue(null),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    cleanup()
  })

  describe('/questions/', () => {
    it('renders a loading state', async () => {
      let wrapper
      await act(async () => {
        wrapper = renderFn('/questions').wrapper
        expect(wrapper.getByText(/loading/)).toBeInTheDocument()
      })

      await waitFor(async () => {
        expect(() => wrapper.getByText(/loading/)).toThrow()
      })
    })

    it('renders an empty state', async () => {
      let wrapper
      ;(useQuestionStore as any).mockReturnValue({
        ...mockQuestionStore,
        fetchQuestions: jest.fn().mockResolvedValue([]),
      })

      await act(async () => {
        wrapper = renderFn('/questions').wrapper
      })

      await waitFor(async () => {
        expect(
          wrapper.getByText(/Ask your questions and help others out/),
        ).toBeInTheDocument()

        expect(wrapper.getByText(/No questions yet/)).toBeInTheDocument()
        expect(
          wrapper.getByRole('link', { name: 'Ask a question' }),
        ).toHaveAttribute('href', '/questions/create')
      })
    })

    it('renders the question listing', async () => {
      let wrapper
      const questionTitle = faker.lorem.words(3)
      const questionSlug = faker.lorem.slug()

      ;(useQuestionStore as any).mockReturnValue({
        ...mockQuestionStore,
        fetchQuestions: jest.fn().mockResolvedValue([
          {
            ...FactoryQuestionItem({
              title: questionTitle,
              slug: questionSlug,
            }),
            _id: '123',
          },
        ]),
      })

      await act(async () => {
        wrapper = renderFn('/questions').wrapper
      })

      await waitFor(async () => {
        expect(
          wrapper.getByText(/Ask your questions and help others out/),
        ).toBeInTheDocument()

        expect(wrapper.getByText(questionTitle)).toBeInTheDocument()
        expect(
          wrapper.getByRole('link', {
            name: questionTitle,
          }),
        ).toHaveAttribute('href', `/questions/${questionSlug}`)
      })
    })
  })

  describe('/questions/create', () => {
    it('allows user to create a question', async () => {
      let wrapper
      // Arrange
      const mockUpsertQuestion = jest.fn().mockResolvedValue({
        slug: 'question-title',
      })
      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        upsertQuestion: mockUpsertQuestion,
      })

      await act(async () => {
        const render = renderFn('/questions/create')
        wrapper = render.wrapper
      })

      // Fill in form
      const title = wrapper.getByLabelText('The Question')
      const description = wrapper.getByLabelText('Give some more information')
      const submitButton = wrapper.getByText('Publish')

      // Submit form
      await userEvent.type(title, 'Question title')
      await userEvent.type(description, 'Question description')

      await waitFor(() => {
        submitButton.click()
      })

      expect(mockUpsertQuestion).toHaveBeenCalledWith({
        title: 'Question title',
        description: 'Question description',
        tags: {},
        allowDraftSave: false,
        moderation: 'accepted',
      })

      expect(mockedUsedNavigate).toBeCalledWith('/questions/question-title')
    })

    it('allows user to draft a question', async () => {
      let wrapper
      // Arrange
      const mockUpsertQuestion = jest.fn().mockResolvedValue({
        slug: 'question-title',
      })
      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        upsertQuestion: mockUpsertQuestion,
      })

      await act(async () => {
        const render = await renderFn('/questions/create')
        wrapper = render.wrapper
      })

      // Fill in form
      const title = wrapper.getByLabelText('The Question')
      const draftButton = wrapper.getByText('Save as draft')

      // Submit form
      await userEvent.type(title, 'Question title')

      await waitFor(() => {
        draftButton.click()
      })

      expect(mockUpsertQuestion).toHaveBeenCalledWith({
        title: 'Question title',
        tags: {},
        allowDraftSave: true,
        moderation: 'draft',
      })

      expect(mockedUsedNavigate).toBeCalledWith('/questions/question-title')
    })
  })

  describe('/questions/:slug', () => {
    it('renders the question single page', async () => {
      let wrapper
      const question = FactoryQuestionItem()
      const mockFetchQuestionBySlug = jest.fn().mockResolvedValue(question)
      const discussionComment = FactoryDiscussionComment({
        text: faker.lorem.words(2),
      })
      const mockfetchOrCreateDiscussionBySource = jest.fn().mockResolvedValue(
        FactoryDiscussion({
          sourceId: question._id,
          sourceType: 'question',
          comments: [discussionComment],
        }),
      )
      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        fetchQuestionBySlug: mockFetchQuestionBySlug,
      })
      useDiscussionStore.mockReturnValue({
        fetchOrCreateDiscussionBySource: mockfetchOrCreateDiscussionBySource,
      })

      await act(async () => {
        wrapper = renderFn(`/questions/${question.slug}`).wrapper
        expect(wrapper.getByText(/loading/)).toBeInTheDocument()
      })

      await waitFor(async () => {
        expect(() => wrapper.getByText(/loading/)).toThrow()
        expect(wrapper.getByText(question.title)).toBeInTheDocument()
        expect(
          wrapper.getByText(
            new RegExp(`^${question.description.split(' ')[0]}`),
          ),
        ).toBeInTheDocument()
        expect(mockFetchQuestionBySlug).toBeCalledWith(question.slug)

        // Loads comments
        expect(mockfetchOrCreateDiscussionBySource).toBeCalledWith(
          question._id,
          'question',
        )

        expect(wrapper.getByText(discussionComment.text)).toBeInTheDocument()

        // Support adding comments
        expect(wrapper.getByText('Leave a comment')).toBeInTheDocument()
      })
    })

    it('does not show Edit call to action', async () => {
      let wrapper
      const question = FactoryQuestionItem()
      const mockFetchQuestionBySlug = jest.fn().mockResolvedValue(question)
      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        fetchQuestionBySlug: mockFetchQuestionBySlug,
      })

      await act(async () => {
        wrapper = renderFn(`/questions/${question.slug}`, FactoryUser()).wrapper
        expect(wrapper.getByText(/loading/)).toBeInTheDocument()
      })

      // Ability to edit
      await waitFor(async () => {
        expect(() => wrapper.getByText(/Edit/)).toThrow()
      })
    })

    it('shows Edit call to action', async () => {
      let wrapper
      const activeUser = FactoryUser({})
      const question = FactoryQuestionItem({
        _createdBy: activeUser.userName,
      })
      const mockFetchQuestionBySlug = jest.fn().mockResolvedValue(question)
      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        activeUser,
        fetchQuestionBySlug: mockFetchQuestionBySlug,
      })

      await act(async () => {
        wrapper = renderFn(`/questions/${question.slug}`, FactoryUser()).wrapper
        expect(wrapper.getByText(/loading/)).toBeInTheDocument()
      })

      // Ability to edit
      await waitFor(async () => {
        expect(wrapper.getByText(/Edit/)).toBeInTheDocument()
      })
    })
  })

  describe('/questions/:slug/edit', () => {
    const editFormTitle = /Edit your question/
    it('renders the question edit page', async () => {
      let wrapper
      await act(async () => {
        wrapper = renderFn('/questions/slug/edit').wrapper
      })

      await waitFor(async () => {
        expect(wrapper.getByText(editFormTitle)).toBeInTheDocument()
      })
    })

    it('allows admin access', async () => {
      let wrapper

      const questionItem = FactoryQuestionItem({
        slug: 'slug',
        title: faker.lorem.words(1),
        _createdBy: 'author',
      })
      const mockUpsertQuestion = jest.fn().mockResolvedValue({
        slug: 'question-title',
      })

      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        activeUser: FactoryUser({
          userName: 'not-author',
          userRoles: ['admin'],
        }),
        fetchQuestionBySlug: jest.fn().mockResolvedValue(questionItem),
        upsertQuestion: mockUpsertQuestion,
      })

      await act(async () => {
        const res = renderFn('/questions/slug/edit', FactoryUser())
        wrapper = res.wrapper
      })

      await waitFor(async () => {
        await new Promise((r) => setTimeout(r, 500))
        expect(wrapper.getByText(editFormTitle)).toBeInTheDocument()
        expect(screen.getByDisplayValue(questionItem.title)).toBeInTheDocument()
        expect(() => wrapper.getByText('Draft')).toThrow()
      })
      // Fill in form
      const title = wrapper.getByLabelText('The Question')
      const description = wrapper.getByLabelText('Give some more information')
      const submitButton = wrapper.getByText('Update')

      // Submit form
      await userEvent.clear(title)
      await userEvent.type(title, 'Question title')
      await userEvent.clear(description)
      await userEvent.type(description, 'Question description')

      await waitFor(() => {
        submitButton.click()
      })

      expect(mockUpsertQuestion).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Question title',
          description: 'Question description',
          _createdBy: 'author',
        }),
      )
    })

    it('redirects non-author', async () => {
      let wrapper

      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        activeUser: FactoryUser({ userName: 'not-author' }),
        fetchQuestionBySlug: jest.fn().mockResolvedValue(
          FactoryQuestionItem({
            slug: 'slug',
            _createdBy: 'author',
          }),
        ),
      })

      await act(async () => {
        const res = renderFn('/questions/slug/edit', FactoryUser())
        wrapper = res.wrapper
      })

      await waitFor(async () => {
        expect(() => wrapper.getByText(editFormTitle)).toThrow()
        expect(mockedUsedNavigate).toBeCalledWith('/questions/slug')
      })
    })
  })
})

const renderFn = (url, fnUser?) => {
  const localUser = fnUser || FactoryUser()
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route path="/questions">{questionRouteElements}</Route>,
    ),
    {
      initialEntries: [url],
    },
  )

  return {
    wrapper: render(
      <Provider
        userStore={{ user: localUser }}
        questionStore={{ foo: 'bar' }}
        tagsStore={{ setTagsCategory: jest.fn() }}
      >
        <ThemeProvider theme={Theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>,
    ),
  }
}
