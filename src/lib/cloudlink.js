/**
 * @file A JavaScript client for CloudLink servers. A very beefed up fork of cloudlinkinabrowser.
 */

import sleep from "./sleep.js";
import {apiUrl} from "./urls.js";

/**
 * A callback type used for packet events.
 *
 * @callback clPacketCallback
 * @param {object} data
 */

/**
 * A JavaScript client for CloudLink servers. A very beefed up fork of cloudlinkinabrowser.
 */
export default class Cloudlink {
    /**
	 * Create the client, and optionally auto-connect to a server.
	 * 
	 * @param {string | URL} [server] Optional URL to autoconnect to.
	 */
    constructor(server) {
        this.events = {};
        this._numevents = 1;
		this.ip = null;

        if (server) {
            this.connect(server);
        }

        return this;
    }

	/**
	 * Internal special formatted console function.
	 * 
	 * @param {string} type The console function to call.
	 * @param {string} label A label for the log, displayed next to the CL badge.
	 * @param {...any} _values The values to log.
	 */
	_console(type, label, _values) {
		const objects = Array.from(arguments).slice(2);

		const actualLog = ("%o").repeat(objects.length);
		console[type](`%cCLJS%c${label}%c ${actualLog}`, "background:#0fbd8c;color:white;font-weight:bold;border-radius:4px 0 0 4px;padding:0 3px;display:inline-block", "background:#000;color:white;font-weight:bold;border-radius:0 4px 4px 0;padding:0 3px;display:inline-block", "", ...objects);
	}
	/**
	 * Special formatted console log function.
	 * 
	 * @param {string} _label A label for the log, displayed next to the CL badge.
	 * @param {...any} _values The values to log.
	 */
	log(_label, _values) {
		this._console.apply(this, ["log", ...arguments]);
	}
	/**
	 * Special formatted console warn function.
	 * 
	 * @param {string} _label A label for the log, displayed next to the CL badge.
	 * @param {...any} _values The values to log.
	 */
	warn(_label, _values) {
		this._console.apply(this, ["warn", ...arguments]);
	}
	/**
	 * Special formatted console error function.
	 * 
	 * @param {string} _label A label for the log, displayed next to the CL badge.
	 * @param {...any} _values The values to log.
	 */
	error(_label, _values) {
		this._console.apply(this, ["error", ...arguments]);
	}

    /**
	 * Disconnects if the client is already connected, then connects to a server.
	 * 
	 * @param {string | URL} server
	 */
    connect(server) {
		return new Promise((resolve, reject) => {
			try {
				if (this.ws && this.ws.readyState === 1) {
					this.log("connection", "already connected, disconnecting...");
					this.disconnect(1000, "Intentional disconnect");
				}

				this.ws = new WebSocket(server);
				this.emit("connectionstart");
				this.ws.addEventListener("open", async () => {
					try {
						this.log("connection", "connected to websockets");
						
						const _ip = localStorage.getItem("meower_ip");
						if (_ip || _ip === "") {
							this.ip = _ip;
						} else {
							this.ip = await (await fetch(apiUrl + "ip")).text();
						}
						
						this.send({
							cmd: "direct",
							val: {
								cmd: "ip",
								val: this.ip,
							},
						});

						await sleep(100);

						this.send({
							cmd: "direct",
							val: { cmd: "type", val: "js" },
							listener: "send_type",
						});
						const tkeyEv = this.sendListener({
							cmd: "direct",
							val: "meower",
							listener: "send_tkey",
						}, (cmd) => {
							if (cmd.cmd === "statuscode") {
								this.off(tkeyEv);
										
								if (cmd.val === "I:100 | OK") {
									resolve();
									this.log("connection", "successfully connected");
								} else {
									reject(cmd.val);
									this.error("connection", "error connecting; code:", cmd.val);
								}
							}
						});
						this.emit("connected");
					} catch(e) {
						this.error("connection", "error connecting:", e);
						reject(e);
					}
				});
				this.ws.addEventListener("message", (socketdata) => {
					const data = JSON.parse(socketdata.data);

					this.log("< incoming", data);

					this.emit(data.cmd, data);
					if (data.listener) {
						this.emit("__listener_" + data.listener, data);
					}
				});
				this.ws.addEventListener("close", (e) => {
					this.log("connection", "disconnected with code ", e.code, " and reason", e.reason);
					this.emit("disconnected", e);
				});
				this.ws.addEventListener("error", (e) => {
					this.error("connection", "error:", e);
					this.emit("error", e);
				});
			} catch(e) {
				reject(e);
			}
		});
	}

    /**
	 * Send a packet through the link.
	 * 
	 * @param {object} data
	 * 
	 * @param {string} data.cmd
	 * @param {string | object} data.val
	 * @param {string} [data.listener]
	 */
    send(data) {
        if ((!this.ws) || (this.ws.readyState !== 1)) {
            throw new Error("Not connected; use link.connect(server) to connect");
        }
		this.log("> outgoing", data);
        this.ws.send(JSON.stringify(data));
    }
	/**
	 * Send a packet through the link and listen for any subsequent packets with the specified listener.
	 * 
	 * @param {object} data
	 * @param {string} data.cmd
	 * @param {string | object} data.val
	 * @param {string} data.listener
	 * @param {clPacketCallback} listenerCb
	 */
	 sendListener(data, listenerCb) {
		if (!data.listener)
			throw new Error("data must have a listener");

		this.send(data);
		return this.onListener(data.listener, listenerCb);
	}

    /**
	 * Listen for a command or other event.
	 * 
	 * @param {string} event
	 * @param {clPacketCallback} cb
	 */
    on(event, cb) {
        this._numevents++;
        const numevents = (this._numevents - 1).toString();

        this.events[numevents] = {
			event,
			cb,
		};
        return numevents;
    }
    /**
	 * Listen for packets with specific listeners.
	 * 
	 * @param {string} listener
	 * @param {clPacketCallback} cb
	 */
    onListener(listener, cb) {
        return this.on("__listener_" + listener, cb);
    }
    /**
	 * Remove a listener with its ID.
	 * 
	 * @param {any} id
	 */
    off(id) {
        if (!this.events[id])
            throw new Error("Tried to remove nonexistent listener");
        delete this.events[id];
    }
    /**
	 * Listen for an event, then remove it once it fires the first time.
	 * 
	 * @param {string} event
	 * @param {clPacketCallback} cb
	 */
    once(event, cb) {
        const id = this.on(event, () => {
            cb(arguments);
            this.off(id);
        });
    }
    /**
	 * Emit an event, with optional data. Pretty self-explanatory.
	 * 
	 * @param {string} event
	 * @param {any} [data]
	 */
    emit(event, data) {
	    Object.values(this.events).forEach(e => {
			if (e.event === event) e.cb(data);
		});
    }

	/**
	 * Disconnect from the server.
	 */
    disconnect(_code, _reason) {
        if ((!this.ws) || (this.ws.readyState !== 1)) {
            return;
        }
		console.log(_code, _reason);
        this.ws.close(_code, _reason);
    }
}