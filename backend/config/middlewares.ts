export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'https://curious-pudding-787d40.netlify.app',
        'https://6996b42e645df300087d3804--curious-pudding-787d40.netlify.app',
        'http://localhost:3000',
        'http://localhost:5173',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
