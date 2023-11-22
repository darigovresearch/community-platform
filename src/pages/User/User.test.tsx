import { render, act } from '@testing-library/react'
import { Provider } from 'mobx-react'
import User from './User'
import { useCommonStores } from 'src/index'
import { FactoryUser } from 'src/test/factories/User'
import { Router } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { createMemoryHistory } from 'history'
const Theme = testingThemeStyles

// eslint-disable-next-line prefer-const
let mockGetUserProfile = jest.fn().mockResolvedValue(FactoryUser)
const mockGetPin = jest.fn()
const mockUpdateUserBadge = jest.fn()

jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserProfile: mockGetUserProfile,
        updateUserBadge: mockUpdateUserBadge,
        getUserCreatedDocs: jest.fn(),
      },
      aggregationsStore: {
        updateAggregation: jest.fn(),
        stopAggregationUpdates: jest.fn(),
        getAggregationValue: jest.fn(),
        aggregations: {
          users_totalUseful: {
            HowtoAuthor: 0,
          },
          users_verified: {
            HowtoAuthor: true,
          },
        },
      },
      themeStore: {
        currentTheme: {
          styles: {
            communityProgramURL: '',
          },
        },
      },
      mapsStore: {
        getPin: mockGetPin,
      },
      tagsStore: {},
    },
  }),
}))

describe('User', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('displays user page', async () => {
    const user = FactoryUser()

    // Act
    let wrapper
    await act(async () => {
      wrapper = await getWrapper(user)
    })

    // Assert
    expect(wrapper.getByText(user.displayName)).toBeInTheDocument()
  })

  it('displays user not found page', async () => {
    // Act
    let wrapper
    await act(async () => {
      wrapper = await getWrapper(null, '/u/does-not-exist')
    })

    // Assert
    expect(wrapper.getByText('User not found')).toBeInTheDocument()
  })

  describe('workspace', () => {
    it('handles workspace with no images', async () => {
      const user = FactoryUser({
        coverImages: [],
      })

      // Act
      let wrapper
      await act(async () => {
        wrapper = await getWrapper(user)
      })

      // Assert
      expect(wrapper.getByText('No images available.')).toBeInTheDocument()
    })
  })
})

const getWrapper = async (user, url?) => {
  const history = createMemoryHistory({
    initialEntries: [url || `/u/${user.userName}`],
  })

  mockGetUserProfile.mockResolvedValue(user)

  return render(
    <Provider
      {...useCommonStores().stores}
      userStore={{
        user,
        updateStatus: { Complete: true },
        getUserEmail: jest.fn(),
        getUserProfile: jest.fn().mockResolvedValue(user),
        getUserCreatedDocs: jest.fn(),
      }}
    >
      <ThemeProvider theme={Theme}>
        <Router history={history}>
          <User />
        </Router>
      </ThemeProvider>
    </Provider>,
  )
}
