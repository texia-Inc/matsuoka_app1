# matsuoka_app1 - AI Diary with Past Insights

「書いて終わり」にしない、過去の自分と対話する日記Webアプリ。
5行の記録からAIがあなたの感情や変化を分析し、数ヶ月前の自分からのフィードバックを届けます。

## 🌟 主な機能

- **クイック入力**: 1日5行程度のテキスト + 5段階の気分評価。
- **カレンダービュー**: 日記を記載した日は色分けされ、継続を可視化。
- **AI感情分析**: 今日の日記の内容をAIが分析し、トピックや感情の変化を抽出。
- **タイムトラベル・フィードバック**: 
  - 「3ヶ月前も同じことで悩んでいたよ」
  - 「あの時の目標、今日達成したんじゃない？」
  - 過去のログと現在の内容を照合し、AIがパーソナライズされた通知・メッセージを表示。
- **検索・振り返り**: 全文検索機能および、過去の日記を一覧で振り返るタイムライン。
- **Webプッシュ通知**: 書き忘れ防止や、AIからのメッセージ到着を通知。

## 🛠 技術スタック

| カテゴリ | 技術 |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, shadcn/ui |
| **Backend/DB** | Supabase (PostgreSQL / pgvector) |
| **AI / NLP** | OpenAI API (GPT-4o / Text Embedding) |
| **Auth** | Supabase Auth (Google / Email) |
| **Deployment** | Vercel |

## 📐 システム構成図



## 🗄 データベース設計 (Supabase / PostgreSQL)

### `diaries` テーブル
| カラム名 | 型 | 説明 |
| :--- | :--- | :--- |
| `id` | uuid | プライマリキー |
| `user_id` | uuid | ユーザー識別子 (FK) |
| `content` | text | 日記本文 (5行程度) |
| `mood_score` | integer | 気分の評価 (1-5) |
| `embedding` | vector(1536) | **AIベクトルデータ (類似度検索用)** |
| `analysis` | jsonb | AIによる分析結果（タグ、要約など） |
| `created_at` | timestamptz | 記録日時 |

## 🧠 AIフィードバックの仕組み (Vector Search)

このアプリの最大の特徴は、単なるキーワードマッチではなく「意味の類似性」で過去を探すことです。

1. **Embedding**: 日記保存時、OpenAI APIを使用して文章を多次元のベクトル数値に変換。
2. **Similarity Search**: `pgvector` を使い、今日の日記と「意味が近い」過去の日記を検索。
3. **Contextual Feedback**: ヒットした過去の内容と今日の内容をGPT-4oに渡し、「成長」や「繰り返される悩み」を言語化してユーザーに提示。

---

