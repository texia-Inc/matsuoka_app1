import { TimelineList } from '@/components/diary/TimelineList'

export default function TimelinePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">タイムライン</h1>
        <p className="text-sm text-gray-500">過去の日記を振り返りましょう</p>
      </div>
      <TimelineList />
    </div>
  )
}
