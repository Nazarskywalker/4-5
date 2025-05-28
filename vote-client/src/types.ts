export type Poll = {
  id: number;
  title: string;
  votes: Vote[];
};

export type Vote = {
  id: number;
  poll_id: number;
  option: string;
};

export type NewPoll = {
  title: string;
};

export type NewVote = {
  poll_id: number;
  option: string;
};
