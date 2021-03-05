import * as React from 'react'

import { Card, Text, Title } from '@habx/ui-core'

import { LoadingBar } from '../LoadingBar'

import { OverlayContainer } from './LoadingOverlay.style'

const pad = (n: number) => (n < 10 ? `0${n}` : n)

export const LoadingOverlay: React.FunctionComponent<LoadingOverlayInterface> = ({
  total,
  done,
  remainingTime,
}) => {
  const remainingTimeDate = remainingTime ? new Date(remainingTime) : new Date()
  return (
    <OverlayContainer>
      <Card spacing="regular">
        <Title type="regular">
          {done}/{total}
        </Title>
        <br />
        <LoadingBar total={total} loaded={done} />
        <br />
        <Text>
          Temps restant:{' '}
          {remainingTime
            ? `${pad(remainingTimeDate.getMinutes())}:${pad(
                remainingTimeDate.getSeconds()
              )}`
            : '--:--'}
        </Text>
      </Card>
    </OverlayContainer>
  )
}

interface LoadingOverlayInterface {
  total: number
  done: number
  remainingTime: number | undefined | null
}
