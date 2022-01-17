import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	},
	// intro: true // transitions run on initial load
});

export default app;