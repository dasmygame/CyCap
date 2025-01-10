'use client'

interface DiscordWidgetProps {
  serverId: string
}

export function DiscordWidget({ serverId }: DiscordWidgetProps) {
  return (
    <iframe
      src={`https://discord.com/widget?id=${serverId}&theme=dark`}
      width="100%"
      height="100%"
      frameBorder="0"
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      className="rounded-lg"
    />
  )
}

