import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { api } from './api';
import { Poll } from './types';
import { PollManagement } from './PollManagement';
import { usePollStore } from './store';
import './App.css';

function HomePage() {
  const polls = usePollStore(state => state.polls);
  const addVote = usePollStore(state => state.addVote);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<{[key: number]: string}>({});

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOptionSelect = (pollId: number, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [pollId]: option
    }));
  };

  const handleVote = (pollId: number) => {
    const selectedOption = selectedOptions[pollId];
    if (selectedOption) {
      addVote(pollId, selectedOption);
      // Clear selection after voting
      setSelectedOptions(prev => {
        const newSelections = {...prev};
        delete newSelections[pollId];
        return newSelections;
      });
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home-page">
      <div className="header">
        <h1>Голосування</h1>
        <Link to="/manage" className="create-poll-btn">
          Створити голосування
        </Link>
      </div>

      <div className="polls-container">
        {!polls.length ? (
          <p>Немає доступних голосувань</p>
        ) : (
          polls.map((poll) => (
          <div key={poll.id} className="poll-card">
            <h2>{poll.title}</h2>
            <div className="votes-list">
              {/* Group votes by option to avoid duplicates */}
              {Array.from(new Set(poll.votes.map(vote => vote.option))).map((option) => (
                <label key={`${poll.id}-${option}`} className="vote-option-label">
                  <input 
                    type="radio" 
                    name={`poll-${poll.id}`} 
                    value={option}
                    checked={selectedOptions[poll.id] === option}
                    onChange={() => handleOptionSelect(poll.id, option)}
                  />
                  <div className="vote-option-container">
                    <span className="vote-option">{option}</span>
                    <span className="vote-count">{poll.voteCounts?.[option] || 0}</span>
                  </div>
                </label>
              ))}
            </div>
            <button 
              className="vote-btn"
              onClick={() => handleVote(poll.id)}
              disabled={!selectedOptions[poll.id]}
            >
              Проголосувати
            </button>
          </div>
        ))
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/manage" element={<PollManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;