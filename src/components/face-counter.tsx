interface FaceCounterProps {
  count: number
}

export function FaceCounter({ count }: FaceCounterProps) {
  return (
    <div className="flex flex-col items-center md:items-center">
      <span className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
        {count}
      </span>
      <span className="text-xs text-muted-foreground mt-0.5">
        người phát hiện
      </span>
    </div>
  )
}