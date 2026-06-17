import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const Practice = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const interviewTypes = [
    {
      icon: '💼',
      title: 'HR Interview',
      desc: 'Behavioral & situational questions to test soft skills and culture fit',
      tag: 'Beginner Friendly',
      tagColor: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
      route: 'hr',
      gradient: 'from-emerald-50 to-white',
      border: 'border-emerald-100 hover:border-emerald-300',
    },
    {
      icon: '⚙️',
      title: 'Technical Interview',
      desc: 'DSA, system design & your tech stack from resume',
      tag: 'Most Popular',
      tagColor: 'text-amber-700 bg-amber-50 border border-amber-200',
      route: 'technical',
      gradient: 'from-amber-50 to-white',
      border: 'border-amber-100 hover:border-amber-300',
    },
    {
      icon: '🎯',
      title: 'Mixed Interview',
      desc: 'A blend of HR and technical — simulates a real interview round',
      tag: 'Recommended',
      tagColor: 'text-purple-700 bg-purple-50 border border-purple-200',
      route: 'mixed',
      gradient: 'from-purple-50 to-white',
      border: 'border-purple-100 hover:border-purple-300',
    },
    {
      icon: '💻',
      title: 'Coding Round',
      desc: 'Live DSA problem solving with AI feedback on your approach',
      tag: 'Advanced',
      tagColor: 'text-rose-700 bg-rose-50 border border-rose-200',
      route: 'coding',
      gradient: 'from-rose-50 to-white',
      border: 'border-rose-100 hover:border-rose-300',
    },
  ]

  return (
    <div className="min-h-screen text-gray-900" style={{ background: '#F0E0C8' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-10 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900">Practice Hub</h2>
          <p className="text-gray-500 text-sm mt-2">
            Choose an interview type or check your resume against a job description.
          </p>
        </div>

        {/* ATS Checker — featured */}
        <div
          onClick={() => navigate('/ats-checker')}
          className="animate-fade-in-up delay-100 card-hover relative overflow-hidden bg-gradient-to-br from-purple-50 to-white border border-purple-200 hover:border-purple-400 rounded-2xl p-6 mb-10 flex items-center justify-between cursor-pointer transition-all group shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
              📄
            </div>
            <div>
              <p className="text-gray-900 font-semibold">ATS Resume Checker</p>
              <p className="text-gray-500 text-sm mt-0.5">
                {user?.resume?.originalName
                  ? 'Paste a job description and see your match score'
                  : 'Upload your resume first to use this feature'}
              </p>
            </div>
          </div>
          <span className="text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
            Check now →
          </span>
        </div>

        {/* Interview types */}
        <p className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wider animate-fade-in-up delay-200">
          Mock Interviews
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviewTypes.map((type, i) => (
            <div
              key={i}
              onClick={() => navigate(`/interview/${type.route}`)}
              className={`animate-fade-in-up card-hover bg-gradient-to-br ${type.gradient} border ${type.border} rounded-2xl p-6 cursor-pointer transition-all group shadow-sm`}
              style={{ animationDelay: `${(i + 3) * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{type.icon}</span>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${type.tagColor}`}>
                  {type.tag}
                </span>
              </div>
              <h3 className="text-gray-900 font-semibold mb-1">{type.title}</h3>
              <p className="text-gray-500 text-sm">{type.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
                Start Interview →
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Practice