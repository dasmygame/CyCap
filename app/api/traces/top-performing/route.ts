import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Trace } from '@/lib/models/Trace'

export async function GET() {
  try {
    await connectDB()

    const topTraces = await Trace.aggregate([
      // Calculate performance metrics and member count
      {
        $addFields: {
          memberCount: { $size: { $ifNull: ["$members", []] } },
          avgMonthlyReturn: { 
            $avg: { 
              $ifNull: ["$performance.monthly.pnl", [0]] 
            }
          },
          avgWinRate: {
            $avg: { 
              $ifNull: ["$performance.monthly.winRate", [0]] 
            }
          }
        }
      },
      
      // Sort by average monthly return
      { $sort: { avgMonthlyReturn: -1 } },
      
      // Limit to top 4 traces
      { $limit: 4 },
      
      // Project only needed fields
      {
        $project: {
          _id: 1,
          slug: 1,
          name: 1,
          avatar: 1,
          stats: {
            memberCount: "$memberCount",
            tradeAlertCount: { 
              $size: { 
                $ifNull: ["$alerts", []] 
              }
            },
            winRate: { $ifNull: ["$stats.winRate", 0] },
            totalPnL: { $ifNull: ["$stats.totalPnL", 0] }
          },
          performance: {
            monthly: {
              pnl: { $ifNull: ["$performance.monthly.pnl", [0, 0, 0, 0, 0, 0]] },
              winRate: { $ifNull: ["$performance.monthly.winRate", [0, 0, 0, 0, 0, 0]] }
            }
          },
          avgMonthlyReturn: 1,
          avgWinRate: 1
        }
      }
    ])

    // If we have less than 4 traces, add placeholder traces
    while (topTraces.length < 4) {
      topTraces.push({
        _id: `placeholder-${topTraces.length}`,
        slug: 'demo',
        name: 'Demo Trace',
        avatar: null,
        stats: {
          memberCount: 0,
          tradeAlertCount: 0,
          winRate: 0,
          totalPnL: 0
        },
        performance: {
          monthly: {
            pnl: [0, 0, 0, 0, 0, 0],
            winRate: [0, 0, 0, 0, 0, 0]
          }
        },
        avgMonthlyReturn: 0,
        avgWinRate: 0
      })
    }

    return NextResponse.json({ traces: topTraces })
  } catch (error) {
    console.error('Error fetching top traces:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top traces' },
      { status: 500 }
    )
  }
} 