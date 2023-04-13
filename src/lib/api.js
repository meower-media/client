/**
 * @file API-related utilities.
 */

import { apiUrl } from "./urls.js";
import { token } from "./stores.js";

let _token;
token.subscribe(v => (_token = v));

export async function makeRequest(path, method = "GET", body = null, includeAuth = false) {
    return await (await fetch(apiUrl + path, {
        method: method,
        body: (JSON.stringify(body) ?? body),
        headers: (includeAuth ? {Authorization: _token} : {})
    })).json();
}
