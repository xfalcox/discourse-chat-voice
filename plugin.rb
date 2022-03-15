# frozen_string_literal: true

# name: discourse-plugin-name
# about: TODO
# version: 0.0.1
# authors: Discourse
# url: TODO
# required_version: 2.7.0
# transpile_js: true

enabled_site_setting :plugin_name_enabled

register_svg_icon "microphone"

after_initialize do

  module ::DiscourseChatVoice
    PLUGIN_NAME = "discourse-chat-voice"

    class Engine < ::Rails::Engine
      engine_name PLUGIN_NAME
      isolate_namespace DiscourseChatVoice
    end
  end

  load File.expand_path('../app/controllers/chat_voice_base_controller.rb', __FILE__)
  load File.expand_path('../app/controllers/voice_channel_controller.rb', __FILE__)

  DiscourseChatVoice::Engine.routes.draw do
    # direct_messages_controller routes
    post '/voice_channel/announce' => 'voice_channel#announce'

  end

  Discourse::Application.routes.append do
    mount ::DiscourseChatVoice::Engine, at: '/chat-voice'
  end
end
