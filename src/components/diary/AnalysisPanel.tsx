import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Analysis } from '@/lib/types'

interface AnalysisPanelProps {
  analysis: Analysis | undefined
}

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  if (!analysis) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-400 text-center">AI分析中...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">今日の感情分析</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {analysis.summary && (
          <p className="text-sm text-gray-700 italic">{analysis.summary}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">感情:</span>
          <span className="text-sm font-medium">{analysis.emotions.primary}</span>
          {analysis.emotions.secondary && (
            <span className="text-sm text-gray-500">/ {analysis.emotions.secondary}</span>
          )}
        </div>
        {analysis.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {analysis.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
