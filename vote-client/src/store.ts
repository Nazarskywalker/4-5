import { create } from 'zustand';
import { Poll, Vote } from './types';
import { mockPolls } from './mockData';

// Flag to identify if a vote is just an option or an actual vote
const OPTION_FLAG = 'option_only';

// Add vote count tracking
interface VoteCount {
  [option: string]: number;
}

interface PollWithVoteCounts extends Poll {
  voteCounts?: VoteCount;
}

interface PollStore {
  polls: PollWithVoteCounts[];
  setPollsFromApi: (polls: Poll[]) => void;
  addPoll: (poll: Poll) => void;
  updatePoll: (updatedPoll: Poll) => void;
  deletePoll: (pollId: number) => void;
  addVote: (pollId: number, option: string) => void;
  calculateVoteCounts: () => void;
}

export const usePollStore = create<PollStore>((set, get) => ({
  polls: [],
  
  setPollsFromApi: (polls: Poll[]) => {
    set({ polls });
    get().calculateVoteCounts();
  },
  
  addPoll: (poll: Poll) => {
    set((state) => ({ 
      polls: [...state.polls, poll] 
    }));
    get().calculateVoteCounts();
  },
  
  updatePoll: (updatedPoll: Poll) => {
    set((state) => ({ 
      polls: state.polls.map(p => p.id === updatedPoll.id ? updatedPoll : p) 
    }));
    get().calculateVoteCounts();
  },
  
  deletePoll: (pollId: number) => {
    set((state) => ({ 
      polls: state.polls.filter(p => p.id !== pollId) 
    }));
  },
  
  addVote: (pollId: number, option: string) => {
    set((state) => {
      // Find the poll
      const pollIndex = state.polls.findIndex(p => p.id === pollId);
      if (pollIndex === -1) return state;
      
      // Create a new vote with a flag to indicate it's an actual vote
      const newVote: Vote = {
        id: Date.now(),
        poll_id: pollId,
        option,
        // @ts-ignore - Adding a custom property to identify real votes
        isRealVote: true
      };
      
      // Create a new array of polls with the updated poll
      const updatedPolls = [...state.polls];
      updatedPolls[pollIndex] = {
        ...updatedPolls[pollIndex],
        votes: [...updatedPolls[pollIndex].votes, newVote]
      };
      
      return { polls: updatedPolls };
    });
    
    // Update vote counts
    get().calculateVoteCounts();
  },
  
  // Calculate vote counts for each poll
  calculateVoteCounts: () => {
    set((state) => {
      const updatedPolls = state.polls.map(poll => {
        // Get unique options from the poll
        const uniqueOptions = Array.from(new Set(poll.votes.map(vote => vote.option)));
        
        // Initialize all options with 0 votes
        const voteCounts: VoteCount = {};
        uniqueOptions.forEach(option => {
          voteCounts[option] = 0;
        });
        
        // Only count votes that have the isRealVote flag
        poll.votes.forEach(vote => {
          // @ts-ignore - Check for the custom property
          if (vote.isRealVote) {
            voteCounts[vote.option]++;
          }
        });
        
        return {
          ...poll,
          voteCounts
        };
      });
      
      return { polls: updatedPolls };
    });
  }
}));
