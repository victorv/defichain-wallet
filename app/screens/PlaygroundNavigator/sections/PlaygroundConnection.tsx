import React, { useEffect, useState } from 'react'
import tailwind from 'tailwind-rn'
import { Text, View } from '../../../components'
import { EnvironmentNetwork } from '../../../environment'
import { getPlaygroundApiClient } from '../../../middlewares/api/playground'
import { Logging } from '../../../middlewares/logging'
import { getNetwork } from '../../../middlewares/storage'
import { PlaygroundStatus } from '../components/PlaygroundStatus'

const DURATION = 3000

export function PlaygroundConnection (): JSX.Element {
  const apiClient = getPlaygroundApiClient()

  const [count, setCount] = useState(0)
  const [connected, setConnected] = useState(false)
  const [environment, setEnvironment] = useState<EnvironmentNetwork | undefined>(undefined)

  useEffect(() => {
    getNetwork().then(network => {
      setEnvironment(network)
    }).catch(Logging.error)

    function refresh (): void {
      apiClient.playground.info().then(({ block }) => {
        setCount(block.count)
        setConnected(true)
      }).catch(() => {
        setConnected(false)
      })
    }

    refresh()
    const interval = setInterval(refresh, DURATION)
    return () => clearInterval(interval)
  }, [])

  return (
    <View>
      <View style={tailwind('flex flex-row items-center')}>
        <Text style={tailwind('text-xl font-bold')}>Connection</Text>
        <View style={tailwind('flex-row items-center ml-2')}>
          <PlaygroundStatus online={connected} offline={!connected} />
          <Text style={tailwind('ml-2 text-gray-900')}>↻{(DURATION / 1000).toFixed(0)}s</Text>
        </View>
      </View>

      <View style={tailwind('mt-1')}>
        <Text style={tailwind('text-sm font-medium text-gray-900')}>
          Playground: {environment}
        </Text>

        <Text style={tailwind('mt-1 text-sm font-medium text-gray-900')}>
          Block Count: {count === 0 ? '...' : count}
        </Text>
      </View>
    </View>
  )
}