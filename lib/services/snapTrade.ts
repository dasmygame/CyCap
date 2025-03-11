import { Snaptrade } from 'snaptrade-typescript-sdk'

// Initialize SnapTrade client with environment variables
const snaptrade = new Snaptrade({
  clientId: process.env.SNAPTRADE_CLIENT_ID || '',
  consumerKey: process.env.SNAPTRADE_CONSUMER_KEY || '',
})

export class SnapTradeService {
  static client = new Snaptrade({
    clientId: process.env.SNAPTRADE_CLIENT_ID!,
    consumerKey: process.env.SNAPTRADE_CONSUMER_KEY!,
  })

  /**
   * Register a new user with SnapTrade
   * @param userId - The unique user ID (MongoDB ObjectId)
   */
  static async registerUser(userId: string) {
    try {
      const response = await snaptrade.authentication.registerSnapTradeUser({
        userId,
      })

      if (!response.data) {
        throw new Error('Failed to get response from SnapTrade')
      }

      return {
        userId: response.data.userId,
        userSecret: response.data.userSecret,
      }
    } catch (error) {
      console.error('SnapTrade registration error:', error)
      throw error
    }
  }

  /**
   * Get broker connection URL
   * @param userId - SnapTrade user ID
   * @param userSecret - SnapTrade user secret
   */
  static async getBrokerConnectionURL(userId: string, userSecret: string) {
    try {
      // Get connection portal URL
      const response = await snaptrade.authentication.loginSnapTradeUser({
        userId,
        userSecret,
      })

      if (!response.data) {
        throw new Error('Failed to get response from SnapTrade')
      }

      // The response type seems to be incorrect in the SDK types
      // According to the docs, it should return a redirectURI
      // We'll use type assertion here
      const data = response.data as unknown as { redirectURI: string }
      return data.redirectURI
    } catch (error) {
      console.error('Error getting broker connection URL:', error)
      throw error
    }
  }

  /**
   * List all connections for a user
   * @param userId - SnapTrade user ID
   * @param userSecret - SnapTrade user secret
   */
  static async listConnections(userId: string, userSecret: string) {
    try {
      const response = await snaptrade.accountInformation.getAllUserHoldings({
        userId,
        userSecret,
      })

      return response.data
    } catch (error) {
      console.error('Error listing connections:', error)
      throw error
    }
  }

  /**
   * Delete a user's SnapTrade connection
   * @param userId - SnapTrade user ID
   */
  static async deleteConnection(userId: string) {
    try {
      await snaptrade.authentication.deleteSnapTradeUser({
        userId,
      })

      return true
    } catch (error) {
      console.error('Error deleting connection:', error)
      throw error
    }
  }

  static async listBrokerageConnections(userId: string, userSecret: string) {
    const response = await snaptrade.connections.listBrokerageAuthorizations({
      userId,
      userSecret,
    })

    if (!response.data) {
      throw new Error('No response data from SnapTrade')
    }

    return response.data
  }

  /**
   * Get all holdings for a user across all accounts
   * @param userId - SnapTrade user ID
   * @param userSecret - SnapTrade user secret
   */
  static async getUserHoldings(userId: string, userSecret: string) {
    try {
      const response = await snaptrade.accountInformation.getAllUserHoldings({
        userId,
        userSecret,
      })

      if (!response.data) {
        throw new Error('No holdings data received from SnapTrade')
      }

      return response.data
    } catch (error) {
      console.error('Error fetching user holdings:', error)
      throw error
    }
  }
} 