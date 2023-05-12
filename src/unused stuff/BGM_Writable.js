/**
 * @file To fix bug with BGM where it will play twice due to autoreload
*/

import {writable} from "svelte/store";

export const audio = writable();