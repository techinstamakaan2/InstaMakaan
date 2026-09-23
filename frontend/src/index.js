import React from 'react';
import ReactDOM from 'react-dom/client';

// Polyfill Object.hasOwn for older headless crawlers / browsers
if (typeof Object.hasOwn !== 'function') {
	Object.hasOwn = function (obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	};
}
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from '@/App';

const rootElement = document.getElementById('root');
const app = (
	<HelmetProvider>
		<App />
	</HelmetProvider>
);

ReactDOM.createRoot(rootElement).render(app);
