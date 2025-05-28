import { useState } from 'react';
import { api } from './api';
import { NewPoll, Poll } from './types';

interface PollFormProps {
  onPollCreated: (poll: Poll) => void;
  existingPoll?: Poll;
}

export function PollForm({ onPollCreated, existingPoll }: PollFormProps) {
  const [title, setTitle] = useState(existingPoll?.title || '');
  const [options, setOptions] = useState<string[]>(
    existingPoll?.votes?.map(vote => vote.option) || ['', '']
  );
  const [error, setError] = useState('');

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Будь ласка, введіть назву голосування');
      return;
    }

    const filteredOptions = options.filter(option => option.trim() !== '');
    if (filteredOptions.length < 2) {
      setError('Будь ласка, додайте хоча б 2 варіанти відповіді');
      return;
    }

    try {
      // Simulate API delay
      setTimeout(() => {
        let poll: Poll;
        
        if (existingPoll) {
          // Update existing poll
          poll = {
            ...existingPoll,
            title: title
          };
          
          // Store options but don't create votes for them
          // We'll just store the options in the votes array without creating actual votes
          const votes = filteredOptions.map((option, index) => ({
            id: existingPoll.id * 100 + index + 1,
            poll_id: existingPoll.id,
            option: option
          }));
          
          poll.votes = votes;
        } else {
          // Create new poll with a temporary ID (will be replaced by the PollManagement component)
          const tempId = Date.now();
          
          // Store options but don't create votes for them
          // We'll just store the options in the votes array without creating actual votes
          const votes = filteredOptions.map((option, index) => ({
            id: tempId * 100 + index + 1,
            poll_id: tempId,
            option: option
          }));
          
          poll = {
            id: tempId,
            title: title,
            votes: votes
          };
        }
        
        onPollCreated(poll);
        setTitle('');
        setOptions(['', '']);
        setError('');
      }, 500);
    } catch (err) {
      console.error('Error creating poll:', err);
      setError('Помилка при створенні голосування. Спробуйте ще раз.');
    }
  };

  return (
    <div className="poll-form">
      <h2>{existingPoll ? 'Редагувати голосування' : 'Створити нове голосування'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Питання:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введіть питання для голосування"
          />
        </div>
        
        <div className="form-group">
          <label>Варіанти відповідей:</label>
          {options.map((option, index) => (
            <div key={index} className="option-row">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Варіант ${index + 1}`}
              />
              <button 
                type="button" 
                onClick={() => removeOption(index)}
                disabled={options.length <= 2}
                className="remove-btn"
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={addOption} className="add-option-btn">
            + Додати варіант
          </button>
        </div>
        
        <button type="submit" className="submit-btn">
          {existingPoll ? 'Оновити голосування' : 'Створити голосування'}
        </button>
      </form>
    </div>
  );
}
