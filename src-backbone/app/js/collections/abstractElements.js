const ElementCollection = require('collections/elements');
const AbstractElement = require('models/abstractElement');

module.exports = ElementCollection.extend({
   model: AbstractElement,
});
