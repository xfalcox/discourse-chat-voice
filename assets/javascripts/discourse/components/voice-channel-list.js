import Component from "@ember/component";
import discourseComputed, { bind } from "discourse-common/utils/decorators";
import showModal from "discourse/lib/show-modal";
import { action, computed } from "@ember/object";
import { next, schedule } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { empty } from "@ember/object/computed";
import voiceChatChannel from "../models/voice-chat-channel";

export default Component.extend({
  classNames: "voice-channels",
  voiceChannels: [voiceChatChannel],
  inSidebar: false,
  toggleSection: null,
  voiceChannelsEmpty: empty("voiceChannels"),
  showPopup: false,
  audioEnabled: true,
  chat: service(),
  router: service(),

  didInsertElement() {
    this._super(...arguments);
  },

  willDestroyElement() {
    this._super(...arguments);
  },

  @discourseComputed("inSidebar")
  voiceChannelClasses(inSidebar) {
    return `chat-channels-container voice-channels ${
      inSidebar ? "collapsible-sidebar-section" : ""
    }`;
  },

  @action
  browseChannels() {
    this.router.transitionTo("chat.browse");
    return false;
  },

  @action
  pencilClicked() {
    if (this.currentUser.staff) {
      this.togglePopupMenu();
    } else {
      this.browseChannels();
    }
    return false;
  },

  @bind
  togglePopupMenu() {
    this.set("showPopup", !this.showPopup);
    next(() => {
      if (this.showPopup) {
        window.addEventListener("click", this.togglePopupMenu);
      } else {
        window.removeEventListener("click", this.togglePopupMenu);
      }
    });
  },

  @action
  openCreateChannelModal() {
    showModal("create-channel-modal");
    return false;
  },

  @action
  toggleChannelSection(section) {
    this.toggleSection(section);
  },
});
