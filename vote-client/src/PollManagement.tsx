import { useState, useEffect } from 'react';
import { api } from './api';
import { Poll } from './types';
import { PollForm } from './PollForm';
import { Link } from 'react-router-dom';
import { usePollStore } from './store';

export function PollManagement() {
  const polls = usePollStore(state => state.polls);
  const addPoll = usePollStore(state => state.addPoll);
  const updatePoll = usePollStore(state => state.updatePoll);
  const deletePoll = usePollStore(state => state.deletePoll);
  
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePollCreated = (poll: Poll) => {
    if (editingPoll) {
      // Update the poll in the store
      updatePoll(poll);
      setEditingPoll(null);
    } else {
      // Create a new poll with a unique ID
      const newPoll = {
        ...poll,
        id: Math.max(0, ...polls.map(p => p.id)) + 1
      };
      // Add the new poll to the store
      addPoll(newPoll);
    }
  };

  const handleEditPoll = (poll: Poll) => {
    setEditingPoll(poll);
    window.scrollTo(0, 0);
  };

  const handleDeletePoll = async (pollId: number) => {
    if (window.confirm('Ви впевнені, що хочете видалити це голосування?')) {
      try {
        // Delete the poll from the store
        deletePoll(pollId);
        
        // Clear editing state if needed
        if (editingPoll?.id === pollId) {
          setEditingPoll(null);
        }
      } catch (err) {
        console.error('Error deleting poll:', err);
        setError('Помилка при видаленні голосування');
      }
    }
  };

  const cancelEdit = () => {
    setEditingPoll(null);
  };

  return (
    <div className="poll-management">
      <div className="header">
        <h1>Управління голосуваннями</h1>
        <Link to="/" className="back-btn">← Повернутися на головну</Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="form-container">
        {editingPoll && (
          <div>
            <PollForm onPollCreated={handlePollCreated} existingPoll={editingPoll} />
            <button onClick={cancelEdit} className="cancel-btn">
              Скасувати редагування
            </button>
          </div>
        )}
        
        {!editingPoll && <PollForm onPollCreated={handlePollCreated} />}
      </div>

      <div className="polls-list">
        <h2>Існуючі голосування</h2>
        
        {loading ? (
          <p>Завантаження...</p>
        ) : polls.length === 0 ? (
          <p>Немає створених голосувань</p>
        ) : (
          <ul>
            {polls.map(poll => (
              <li key={poll.id} className="poll-item">
                <div className="poll-info">
                  <h3>{poll.title}</h3>
                  <div className="options-list">
                    {Array.from(new Set(poll.votes.map(vote => vote.option))).map(option => (
                      <div key={`${poll.id}-${option}`} className="option-item">
                        {option}
                        <span className="option-count">{poll.voteCounts?.[option] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="poll-actions">
                  <button 
                    onClick={() => handleEditPoll(poll)} 
                    className="edit-btn"
                  >
                    Редагувати
                  </button>
                  <button 
                    onClick={() => handleDeletePoll(poll.id)} 
                    className="delete-btn"
                  >
                    Видалити
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
