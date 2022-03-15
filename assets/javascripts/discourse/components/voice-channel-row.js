import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
import getURL from "discourse-common/lib/get-url";
import { equal } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import loadScript from "discourse/lib/load-script";
import { action } from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default Component.extend({
  channel: null,
  id: 666666,
  switchChannel: null,
  isDirectMessageRow: equal("channel.chatable_type", "DirectMessageChannel"),
  participating: false,
  router: service(),

  @discourseComputed("active", "channel.muted")
  rowClassNames(active, muted) {
    const classes = ["chat-channel-row"];
    if (active) {
      classes.push("active");
    }
    if (muted) {
      classes.push("muted");
    }
    return classes.join(" ");
  },

  @action
  handleSwitchChannel(event) {

    this.participating = !this.participating;

    loadScript("/plugins/discourse-plugin-name/vendor/simplepeer.min.js").then(async () => {

      this.messageBus.subscribe(`/chat-voice/${this.id}/signalling`, (data) => {
        console.log(data);
      });

      let stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
      });

      let myPeer = new SimplePeer({ initiator: true, stream: stream, trickle: false });

      myPeer.on('signal', signal => {
        ajax('/chat-voice/voice_channel/announce', {
          type: "POST",
          data: {
            channel: this.id,
            signal: JSON.stringify(signal)
          },
        }).catch(popupAjaxError);
      });

      
    });





    if (this.switchChannel) {
      this.switchChannel(this.channel);
      event.preventDefault();
    }
  },

  @action
  handleClick(event) {
    this.handleSwitchChannel(event);
  },

  @action
  handleKeydown(event) {
    this.handleSwitchChannel(event);
  },


  @discourseComputed("channel", "router.currentRoute")
  active(channel, currentRoute) {
    return (
      currentRoute?.name === "chat.channel" &&
      currentRoute?.params?.channelId === channel.id.toString(10)
    );
  },

  @discourseComputed("currentUser.chat_channel_tracking_state")
  unreadIndicatorClassName(trackingState) {
    return this.isDirectMessageRow ||
      trackingState[this.channel.id]?.unread_mentions > 0
      ? "chat-unread-urgent-indicator"
      : "chat-unread-indicator";
  },

  @discourseComputed("currentUser.chat_channel_tracking_state")
  hasUnread(trackingState) {
    return trackingState[this.channel.id]?.unread_count || 0;
  },
});
