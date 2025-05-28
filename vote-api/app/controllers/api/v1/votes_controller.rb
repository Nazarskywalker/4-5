class Api::V1::VotesController < ApplicationController
  def create
    vote = Vote.new(vote_params)

    if vote.save
      ActionCable.server.broadcast("poll_#{vote.poll_id}", vote.as_json)
      render json: vote, status: :created
    else
      render json: { errors: vote.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    vote = Vote.find(params[:id])

    if vote.update(vote_params)
      ActionCable.server.broadcast("poll_#{vote.poll_id}", vote.as_json)
      render json: vote
    else
      render json: { errors: vote.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    vote = Vote.find(params[:id])
    poll_id = vote.poll_id
    vote.destroy
    ActionCable.server.broadcast("poll_#{poll_id}", { id: params[:id], deleted: true })
    head :no_content
  end

  private
    def vote_params
      params.require(:vote).permit(:option, :poll_id)
    end
end
