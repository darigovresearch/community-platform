jest.mock('../common/module.store')
import type { IDiscussion } from 'src/models'
import { DiscussionStore } from './discussions.store'
import type { RootStore } from '..'
import { FactoryUser } from 'src/test/factories/User'
import {
  FactoryDiscussion,
  FactoryDiscussionComment,
} from 'src/test/factories/Discussion'
import { faker } from '@faker-js/faker'

const factory = async (
  discussions: IDiscussion[] = [FactoryDiscussion({})],
) => {
  const store = new DiscussionStore({} as RootStore)

  const discussionItem = discussions[0]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.db.get.mockReturnValue(discussionItem)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.setActiveUser(FactoryUser({ _id: 'fake-user' }))

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.aggregationsStore = {
    aggregations: {
      users_verified: ['fake-user'],
    },
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.userStore = {
    activeUser: {
      _id: 'fake-user',
    },
  }

  return {
    store,
    discussionItem,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFn: store.db.set,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getFn: store.db.get,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getWhereFn: store.db.getWhere,
  }
}

describe('discussion.store', () => {
  describe('fetchDiscussionBySourceId', () => {
    it('fetches a discussion by sourceId', async () => {
      const fakeSourceId = faker.internet.password()
      const { store, getWhereFn } = await factory([
        FactoryDiscussion({ sourceId: fakeSourceId }),
      ])

      await store.fetchDiscussionBySourceId(fakeSourceId)

      expect(getWhereFn).toHaveBeenCalledTimes(1)
      expect(getWhereFn).toHaveBeenCalledWith('sourceId', '==', fakeSourceId)
    })

    it('handles empty response', async () => {
      const { store, getWhereFn } = await factory()

      getWhereFn.mockReturnValueOnce([])
      const res = await store.fetchDiscussionBySourceId('fake-source-id')

      expect(getWhereFn).toHaveBeenCalledTimes(1)
      expect(res).toBeNull()
    })
  })

  describe('uploadDiscussion', () => {
    it('creates a new discussion with sourceId and sourceType provided', async () => {
      const { store, discussionItem, setFn } = await factory()

      await store.uploadDiscussion(
        discussionItem.sourceId,
        discussionItem.sourceType,
      )

      const [newDiscussion] = setFn.mock.calls[0]
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newDiscussion.sourceId).toBe(discussionItem.sourceId)
      expect(newDiscussion.sourceType).toBe(discussionItem.sourceType)
    })
  })

  describe('addComment', () => {
    it('adds a new comment', async () => {
      const { store, discussionItem, setFn, getFn } = await factory()

      //Act
      await store.addComment(discussionItem, 'New comment')

      // Assert
      const [newDiscussion] = setFn.mock.calls[0]

      expect(getFn).toHaveBeenCalled()
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newDiscussion.comments[0]).toEqual(
        expect.objectContaining({ text: 'New comment' }),
      )
      expect(newDiscussion.comments[1]).toBeUndefined()
    })

    it('adds a reply to a comment', async () => {
      const { store, discussionItem, setFn } = await factory([
        FactoryDiscussion({
          comments: [FactoryDiscussionComment({ text: 'New comment' })],
        }),
      ])

      //Act
      await store.addComment(
        discussionItem,
        'New reply',
        discussionItem.comments[0]._id,
      )

      const [newDiscussion] = setFn.mock.calls[0]

      // Assert
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newDiscussion.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ text: 'New reply' }),
        ]),
      )
    })

    it('handles error fetching discussion', async () => {
      const { store, discussionItem, setFn, getFn } = await factory()

      getFn.mockReturnValue(null)
      //Act
      await expect(
        store.addComment(discussionItem, 'New comment'),
      ).rejects.toThrowError('Discussion not found')

      // Assert
      expect(setFn).not.toHaveBeenCalled()
    })
  })

  describe('editComent', () => {
    it('allows author to make changes comment', async () => {
      const { store, discussionItem, setFn } = await factory([
        FactoryDiscussion({
          comments: [
            FactoryDiscussionComment({
              _id: 'fake-comment-id',
              _creatorId: 'fake-user',
              text: 'New comment',
            }),
          ],
        }),
      ])

      //Act
      await store.editComment(
        discussionItem,
        'fake-comment-id',
        'Edited comment',
      )

      const [newDiscussion] = setFn.mock.calls[0]

      // Assert
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(newDiscussion.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ text: 'Edited comment' }),
        ]),
      )
    })

    it('throws an error for a different user', async () => {
      const { store, discussionItem, setFn } = await factory([
        FactoryDiscussion({
          comments: [
            FactoryDiscussionComment({
              _id: 'fake-comment-id',
              _creatorId: 'another-user-id',
              text: 'New comment',
            }),
          ],
        }),
      ])

      //Act
      await expect(
        store.editComment(discussionItem, 'fake-comment-id', 'Edited comment'),
      ).rejects.toThrowError()

      // Assert
      expect(setFn).not.toHaveBeenCalled()
    })
  })

  describe('deleteComment', () => {
    it('allows author to remove a comment', async () => {
      const comment = FactoryDiscussionComment({
        _creatorId: 'fake-user',
        text: 'New comment',
      })
      const { store, setFn, discussionItem } = await factory([
        FactoryDiscussion({ comments: [comment] }),
      ])

      //Act
      await store.deleteComment(discussionItem, comment._id)

      // Asert
      expect(setFn).toHaveBeenCalledTimes(1)
      expect(setFn.mock.calls[0][0].comments).toHaveLength(0)
    })

    it('throws an error for a different user', async () => {
      const { store, discussionItem, setFn } = await factory([
        FactoryDiscussion({
          comments: [
            FactoryDiscussionComment({
              _id: 'fake-comment-id',
              _creatorId: 'another-user-id',
              text: 'New comment',
            }),
          ],
        }),
      ])

      //Act
      await expect(
        store.deleteComment(discussionItem, 'fake-comment-id'),
      ).rejects.toThrowError()

      // Assert
      expect(setFn).not.toHaveBeenCalled()
    })
  })
})
