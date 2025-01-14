import { fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { render } from '../tests/utils'
import { CommentList } from './CommentList'
import type { CommentItemProps as Comment } from '../CommentItem/CommentItem'
import { createComments } from './createComments'

const mockHandleEdit = vi.fn()
const mockHandleEditRequest = vi.fn()
const mockHandleDelete = vi.fn()
const mockTrackEvent = vi.fn()

describe('CommentList', () => {
  it('renders the correct number of comments initially', () => {
    const mockComments: Comment[] = createComments(2)
    const screen = render(
      <CommentList
        comments={mockComments}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
        trackEvent={mockTrackEvent}
      />,
    )
    expect(screen.getAllByTestId('CommentList: item')).toHaveLength(
      mockComments.length,
    )
  })

  it('loads more comments when show more button is clicked', () => {
    const mockComments: Comment[] = createComments(20)
    const screen = render(
      <CommentList
        comments={mockComments}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
        trackEvent={mockTrackEvent}
      />,
    )
    fireEvent.click(screen.getByText('show more comments'))
    expect(screen.getAllByTestId('CommentList: item').length).toBeGreaterThan(5)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Comments',
      action: 'Show more',
      label: undefined, // Replace with expected article title if available
    })
  })

  it('highlights the correct comment when highlightedCommentId is provided', () => {
    const mockComments: Comment[] = createComments(10)
    const highComm = mockComments[1]
    const highlightedCommentId = highComm._id // Replace with an actual ID from mockComments
    highComm.text = 'Highlighted comment text'
    const screen = render(
      <CommentList
        comments={mockComments}
        highlightedCommentId={highlightedCommentId}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
        trackEvent={mockTrackEvent}
      />,
    )
    expect(screen.getAllByTestId('CommentList: item')[1]).toHaveStyle(
      'border: 2px dashed black',
    )
  })
})
