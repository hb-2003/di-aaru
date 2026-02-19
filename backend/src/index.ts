import dns from 'node:dns';
import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register() {
    // Fix the 20-second delay on macOS by preferring IPv4
    dns.setDefaultResultOrder('ipv4first');
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const shouldSeed =
      process.env.RUN_SEED === 'true' || process.env.SEED_DATA === 'true';

    if (!shouldSeed) return;

    try {
      const { seedData } = require('../database/seed-bootstrap');
      await seedData(strapi);
    } catch (error) {
      console.error('Error during bootstrap seeding:', error);
    }
  },
};
