import { SearchBar } from '@/components/diary/SearchBar'

export default function SearchPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">日記を検索</h1>
        <p className="text-sm text-gray-500">キーワードで過去の日記を探せます</p>
      </div>
      <SearchBar />
    </div>
  )
}
