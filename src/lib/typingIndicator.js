/**
 * @file Detects typing events
 */

import {writable} from "svelte/store";
import {link} from "../lib/clmanager.js";

/**
 * Adds events to listen for typing updates.
 */

let typingSince = {};
let _typing = {};

link.on("direct", cmd => {
	if (cmd.val.state === 100) {
		startTyping(cmd.val.chatid, cmd.val.u);
	} else if (cmd.val.chatid === "livechat" && cmd.val.state === 101) {
		startTyping("home", cmd.val.u);
	}

	if (cmd.val.type === 1) {
		if (!_typing[cmd.val.post_origin]) return;

		_typing[cmd.val.post_origin] = _typing[cmd.val.post_origin].filter(
			selectedUser => selectedUser !== cmd.val.u
		);
		typing.set(_typing);
	}
});

function startTyping(chat, user) {
	let typingStart = +new Date();
	if (!typingSince[chat]) typingSince[chat] = {};
	typingSince[chat][user] = typingStart;

	if (!_typing[chat]) _typing[chat] = [];
	if (!_typing[chat].includes(user)) {
		_typing[chat].push(user);
		typing.set(_typing);
	}

	setTimeout(function () {
		checkIfStillTyping(chat, user, typingStart);
	}, 3000);
}

function checkIfStillTyping(chat, user, typingStart) {
	if (typingSince[chat][user] === typingStart) {
		_typing[chat] = _typing[chat].filter(
			selectedUser => selectedUser !== user
		);
		typing.set(_typing);
	}
}

export let typing = writable({});
