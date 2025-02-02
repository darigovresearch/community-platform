import React, { useEffect, useState } from 'react'
import type { IHowtoDB } from 'src/models/howto.models'
import { Navigate, useParams } from 'react-router-dom'
import { toJS } from 'mobx'
import { Text } from 'theme-ui'
import type { IUser } from 'src/models/user.models'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { useCommonStores } from 'src/index'
import { HowtoForm } from '../Common/Howto.form'
import { Loader } from 'oa-components'

interface IState {
  formValues: IHowtoDB
  isLoading: boolean
  loggedInUser?: IUser | undefined
}

const EditHowto = () => {
  const { slug } = useParams()
  const { howtoStore } = useCommonStores().stores
  const [{ formValues, isLoading, loggedInUser }, setState] = useState<IState>({
    formValues: {} as IHowtoDB,
    isLoading: true,
    loggedInUser: undefined,
  })

  useEffect(() => {
    const loggedInUser = howtoStore.activeUser
    const init = async () => {
      if (howtoStore.activeHowto) {
        setState({
          formValues: toJS(howtoStore.activeHowto) as IHowtoDB,
          isLoading: false,
          loggedInUser: loggedInUser ? loggedInUser : undefined,
        })
      } else {
        const doc = await howtoStore.setActiveHowtoBySlug(slug)
        setState({
          formValues: doc as IHowtoDB,
          isLoading: false,
          loggedInUser: loggedInUser ? (loggedInUser as IUser) : undefined,
        })
      }
    }

    init()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  if (!formValues) {
    return (
      <Text mt="50px" sx={{ width: '100%', textAlign: 'center' }}>
        How-to not found
      </Text>
    )
  }

  if (loggedInUser && isAllowedToEditContent(formValues, loggedInUser)) {
    return <HowtoForm formValues={formValues} parentType="edit" />
  } else {
    return <Navigate to={'/how-to/' + formValues.slug} />
  }
}

export default EditHowto
