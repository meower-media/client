
import { browser } from '$app/environment';

// it so that it gets served as a static asset in production
export const prerender = false;

export async function load({ params }) {
    if(browser) {
        return {isclient: true};
    } else {
        // ssr
        return null;
    }
}
