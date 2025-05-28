poll = Poll.create!(title: "What is your favorite language?")
poll.votes.create!(option: "Ruby")
poll.votes.create!(option: "JavaScript")
poll.votes.create!(option: "Python")
