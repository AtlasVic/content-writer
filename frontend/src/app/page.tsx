'use client'

import { useState, useEffect } from 'react'

interface FormData {
  topic?: string
  audience?: string
  tone?: string
  word_count?: string
  platform?: string
  count?: string
  product_name?: string
  features?: string
  email_type?: string
  context?: string
  product?: string
  goal?: string
  character_limit?: string
  ollama_model?: string
}

const CONTENT_TYPES = [
  { id: 'blog', label: '📝 Blog Post' },
  { id: 'social', label: '📱 Social Media' },
  { id: 'product', label: '🏷️ Product Description' },
  { id: 'email', label: '✉️ Email Template' },
  { id: 'ad', label: '📣 Ad Copy' },
]

const MODELS = [
  { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Fast)' },
  { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (Better)' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
  { value: 'gpt-4o', label: 'GPT-4o (Best)' },
  { value: 'minimax', label: 'MiniMax (M2.1)' },
  { value: 'ollama', label: 'Ollama (Local)' },
]

const FORM_CONFIGS: Record<string, { name: string; label: string; placeholder: string; type?: string }[]> = {
  blog: [
    { name: 'topic', label: 'Topic', placeholder: 'e.g., The Benefits of Remote Work' },
    { name: 'audience', label: 'Target Audience', placeholder: 'e.g., Remote workers and digital nomads' },
    { name: 'tone', label: 'Tone', placeholder: 'e.g., Professional, Friendly, Casual' },
    { name: 'word_count', label: 'Word Count', placeholder: '500', type: 'number' },
  ],
  social: [
    { name: 'topic', label: 'Topic', placeholder: 'e.g., New product launch' },
    { name: 'platform', label: 'Platform', type: 'select', options: ['LinkedIn', 'Twitter', 'Instagram', 'Facebook'] },
    { name: 'tone', label: 'Tone', placeholder: 'e.g., Professional, Fun, Inspirational' },
    { name: 'count', label: 'Number of Posts', placeholder: '3', type: 'number' },
  ],
  product: [
    { name: 'product_name', label: 'Product Name', placeholder: 'e.g., Smart Home Hub' },
    { name: 'features', label: 'Key Features', placeholder: 'e.g., Voice control, energy monitoring, security' },
    { name: 'audience', label: 'Target Audience', placeholder: 'e.g., Tech-savvy homeowners' },
    { name: 'tone', label: 'Tone', placeholder: 'e.g., Persuasive, Technical, Friendly' },
  ],
  email: [
    { name: 'email_type', label: 'Email Type', type: 'select', options: ['Follow-up', 'Inquiry', 'Thank You', 'Introduction', 'Reminder'] },
    { name: 'context', label: 'Context', placeholder: 'e.g., Follow up after demo call about our services' },
    { name: 'tone', label: 'Tone', placeholder: 'e.g., Professional, Friendly' },
  ],
  ad: [
    { name: 'product', label: 'Product/Service', placeholder: 'e.g., Our new fitness app' },
    { name: 'platform', label: 'Platform', type: 'select', options: ['Facebook', 'Google', 'LinkedIn', 'Instagram'] },
    { name: 'goal', label: 'Goal', placeholder: 'e.g., Conversions, Clicks, Sign-ups' },
    { name: 'character_limit', label: 'Character Limit', placeholder: '150', type: 'number' },
  ],
}

export default function Home() {
  const [contentType, setContentType] = useState('blog')
  const [model, setModel] = useState('claude-3-haiku-20240307')
  const [apiKey, setApiKey] = useState('')
  const [formData, setFormData] = useState<FormData>({})
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  // Dark mode toggle with class-based approach
  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize dark mode from system preference
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    if (!apiKey && model !== 'ollama') {
      setError('Please enter an API key')
      return
    }

    setLoading(true)
    setError('')
    setOutput('')

    try {
      const response = await fetch('http://localhost:8002/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: contentType,
          model,
          inputs: formData,
          api_key: apiKey,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Generation failed')
      }

      const data = await response.json()
      setOutput(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-indigo-600">Content</span> Writer AI
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">AI-powered content generation</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Content:</span>
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setContentType(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                contentType === type.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Main */}
        <main className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">
                Generate {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content
              </h2>

              {/* API Key */}
              <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <label className="block text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  🔑 API Key {model.startsWith('ollama') && <span className="text-green-600">(not needed for Ollama)</span>}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={model.startsWith('ollama') ? 'No key needed' : 'sk-... or sk-ant-api03-...'}
                  disabled={model.startsWith('ollama')}
                  className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white"
                />
              </div>

              {/* Model */}
              <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <label className="block text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-2">
                  🤖 AI Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-300 dark:border-indigo-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white"
                >
                  {MODELS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                {model === 'ollama' && (
                  <input
                    type="text"
                    value={formData.ollama_model || ''}
                    onChange={(e) => handleInputChange('ollama_model', e.target.value)}
                    placeholder="Model name (e.g., llama3.2:1b)"
                    className="w-full mt-2 px-3 py-2 border border-indigo-300 dark:border-indigo-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white"
                  />
                )}
              </div>

              {/* Dynamic Fields */}
              {FORM_CONFIGS[contentType]?.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name as keyof FormData] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt.toLowerCase()}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={formData[field.name as keyof FormData] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white"
                    />
                  )}
                </div>
              ))}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? 'Generating...' : '✨ Generate Content'}
              </button>
            </div>

            {/* Output */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold dark:text-white">Generated Content</h2>
                {output && (
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg dark:text-white"
                  >
                    📋 Copy
                  </button>
                )}
              </div>
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}
              {output ? (
                <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                  {output}
                </div>
              ) : (
                <div className="text-gray-400 dark:text-gray-500">
                  Your generated content will appear here...
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}