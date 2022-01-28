# Mossos-React

This is the front-end code for 'mossos.in' webapp. 
Built using React.js + Vite.js & TailwindCSS, React Hooks & Router, Axios.

# Project Status
No longer maintained.

# Screenshots

<p float="left">
  <img src="/screenshots/home.png?raw=true" width="300" />
  <img src="/screenshots/menu.png?raw=true" width="300" />
  <img src="/screenshots/cart.png?raw=true" width="300" />
  <img src="/screenshots/bottom.png?raw=true" width="300" />
  <img src="/screenshots/signup.png?raw=true" width="300" />
</p>

# Setup

Requirement:

`node` and `npm` / `yarn`

`.env`:

`VITE_APP_API`: Mossos-Express back-end API url

Installation:

`npm i`

Run development server:

`npm run dev`

Visit app:

`http://localhost:3000`

Build for production:

`npm run build`

# Reflection

I started Mossos.in which focused on serving fresh home-made food by home-chefs & small food business. This was a 3 month long project built while also working on the back-end server and business side of things. Project goals included using technologies learned up until this point and also familiarizing myself with better or alternative technologies if time constraints permitted.

Originally I wanted to build an application by using the create-react-app boilerplate, but the developer experience (DX) in terms build time was not great. This was when I decided to use Vite.js for the build tool. I never used TailwindCSS, so it was time to give it a try over Bootstrap.

One of the main challenges I ran into was authentication. This lead me to spend a few days on a research spike into JWT auth. Since I wanted to dig into auth myself, I decided not to rely on third party services to understand it completely. But today I would!

Where are the tests? This was more of a rapid ship-feedback-iterate project than a proper one. As a solo dev working on many things, due to many constraints, I had to table tests and focus more on functionality, features and design. Would've loved if there was a team!

At the end of the day, I learnt more than just React. I learnt a great deal about caching, authentication, routing, Cloudflare CDN, and design!
