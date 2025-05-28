class PollChannel < ApplicationCable::Channel
  def subscribed
    stream_from "poll_#{params[:poll_id]}"
  end
end
