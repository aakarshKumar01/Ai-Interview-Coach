import { useState } from 'react'
import Navbar from '../components/Navbar'

const Resources = () => {
  const [activeTab, setActiveTab] = useState('hr')
  const [openTip, setOpenTip] = useState(null)

  const questionBank = {
    hr: [
      'Tell me about yourself.',
      'Why do you want to work for this company?',
      'What are your greatest strengths and weaknesses?',
      'Describe a challenge you faced and how you handled it.',
      'Where do you see yourself in 5 years?',
      'Why should we hire you?',
      'Tell me about a time you worked in a team.',
      'How do you handle pressure or stressful situations?',
    ],
    technical: [
      'Explain the difference between SQL and NoSQL databases.',
      'What is the time complexity of binary search?',
      'Explain how React\'s virtual DOM works.',
      'What is the difference between REST and GraphQL?',
      'How does JWT authentication work?',
      'Explain the concept of closures in JavaScript.',
      'What is the difference between SQL JOIN types?',
      'How would you optimize a slow API endpoint?',
    ],
    behavioral: [
      'Describe a time you disagreed with a teammate. How did you resolve it?',
      'Tell me about a project you\'re most proud of.',
      'Describe a time you failed and what you learned.',
      'How do you prioritize tasks when everything feels urgent?',
      'Tell me about a time you had to learn something new quickly.',
      'Describe a situation where you went above and beyond.',
    ],
  }

  const tips = [
    {
      title: 'Use the STAR Method',
      content: 'For behavioral questions, structure your answer as Situation, Task, Action, Result. This keeps your answer focused and shows clear impact.',
      icon: '⭐',
    },
    {
      title: 'Avoid Filler Words',
      content: 'Words like "umm", "like", "basically", and "you know" make you sound less confident. Our AI interviewer tracks this automatically — check your feedback report after each session.',
      icon: '🎯',
    },
    {
      title: 'Research the Company',
      content: 'Before any interview, know the company\'s products, recent news, and values. Mentioning something specific shows genuine interest.',
      icon: '🔍',
    },
    {
      title: 'Prepare Questions to Ask',
      content: 'Always have 2-3 questions ready for the interviewer. Good examples: "What does success look like in this role after 6 months?"',
      icon: '💬',
    },
    {
      title: 'Body Language Matters (Even on Video)',
      content: 'Sit upright, maintain eye contact with the camera, and smile naturally. Practice in front of a mirror or record yourself.',
      icon: '🎥',
    },
    {
      title: 'Quantify Your Achievements',
      content: 'Instead of "I improved performance," say "I reduced load time by 40%." Numbers make your impact concrete and memorable.',
      icon: '📈',
    },
  ]

  const tabLabels = {
    hr: { label: 'HR Questions', icon: '💼', color: 'emerald' },
    technical: { label: 'Technical Questions', icon: '⚙️', color: 'amber' },
    behavioral: { label: 'Behavioral Questions', icon: '🎯', color: 'purple' },
  }

  const tabActiveClasses = {
    hr: 'bg-emerald-500 text-white',
    technical: 'bg-amber-500 text-white',
    behavioral: 'bg-purple-500 text-white',
  }

  return (
    <div className="min-h-screen text-gray-900" style={{ background: '#F0E0C8' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-10 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900">Resources</h2>
          <p className="text-gray-500 text-sm mt-2">
            Interview tips and a question bank to help you prepare beyond mock interviews.
          </p>
        </div>

        {/* Tips Section */}
        <p className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wider animate-fade-in-up">
          Interview Tips
        </p>
        <div className="space-y-3 mb-12">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <button
                onClick={() => setOpenTip(openTip === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-orange-50/50 transition-all"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{tip.icon}</span>
                  <span className="text-gray-900 font-medium text-sm">{tip.title}</span>
                </span>
                <span className={`text-gray-400 transition-transform ${openTip === i ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>
              {openTip === i && (
                <div className="px-6 pb-4 pl-16">
                  <p className="text-gray-500 text-sm leading-relaxed">{tip.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Question Bank */}
        <p className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wider animate-fade-in-up">
          Question Bank
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 animate-fade-in-up">
          {Object.entries(tabLabels).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`text-sm px-4 py-2 rounded-xl transition-all font-medium ${
                activeTab === key
                  ? tabActiveClasses[key] + ' shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {val.icon} {val.label}
            </button>
          ))}
        </div>

        {/* Questions list */}
        <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-2">
          {questionBank[activeTab].map((q, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0"
            >
              <span className="text-emerald-600 text-xs font-bold mt-0.5 flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-gray-700 text-sm">{q}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Resources