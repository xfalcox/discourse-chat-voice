# frozen_string_literal: true

class DiscourseChatVoice::VoiceChannelController < ::DiscourseChatVoice::ChatVoiceBaseController


  def announce

    data = JSON.parse(params[:signal])['sdp']

    MessageBus.publish("/chat-voice/#{params[:channel]}/signalling", data)

  end
end