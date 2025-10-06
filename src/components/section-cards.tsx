import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface KPICard {
  id: string
  title: string
  value: string | number
  description: string
  trend?: {
    value: string
    direction: 'up' | 'down'
    icon?: ReactNode
  }
  footer?: {
    primary: string
    secondary: string
    icon?: ReactNode
  }
  variant?: 'default' | 'success' | 'warning' | 'destructive'
}

interface SectionCardsProps {
  cards: KPICard[]
  className?: string
}

export function SectionCards({ cards, className = "" }: SectionCardsProps) {
  const getTrendIcon = (direction: 'up' | 'down') => {
    return direction === 'up' ? <IconTrendingUp /> : <IconTrendingDown />
  }

  const getTrendVariant = (direction: 'up' | 'down') => {
    return direction === 'up' ? 'default' : 'secondary'
  }

  return (
    <div className={`*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 ${className}`}>
      {cards.map((card) => (
        <Card key={card.id} className="@container/card">
          <CardHeader>
            <CardDescription>{card.description}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            {card.trend && (
              <CardAction>
                <Badge variant="outline">
                  {card.trend.icon || getTrendIcon(card.trend.direction)}
                  {card.trend.value}
                </Badge>
              </CardAction>
            )}
          </CardHeader>
          {card.footer && (
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.footer.primary} {card.footer.icon && <span className="size-4">{card.footer.icon}</span>}
              </div>
              <div className="text-muted-foreground">
                {card.footer.secondary}
              </div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
