'use strict';

/**
 * active-theme service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::active-theme.active-theme');
