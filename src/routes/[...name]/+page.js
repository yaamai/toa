import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ url, params }) {
    let mode = url.searchParams.get('mode')
    if (!["edit", "view"].includes(mode)) {
        mode = "view"
    }

    return {
        name: params.name,
        mode: mode,
    }
}
