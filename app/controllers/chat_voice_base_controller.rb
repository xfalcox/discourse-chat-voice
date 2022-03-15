# frozen_string_literal: true

class DiscourseChatVoice::ChatVoiceBaseController < ::ApplicationController
  before_action :ensure_logged_in
  before_action :ensure_can_chat

  private

  def ensure_can_chat
    raise Discourse::NotFound unless SiteSetting.chat_enabled
    guardian.ensure_can_chat!(current_user)
  end
end