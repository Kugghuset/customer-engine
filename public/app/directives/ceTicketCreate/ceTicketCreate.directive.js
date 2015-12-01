(function () {

angular.module('customerEngineApp')
.directive('ceTicketCreate', ['Customer', 'Ticket', 'Country', 'Category', 'Notification', function (Customer, Ticket, Country, Category, Notification) {
  return {
    templateUrl: 'app/directives/ceTicketCreate/ceTicketCreate.html',
    restrict: 'EA',
    scope: {
      ticket: '=',
      relatedTickets: '=',
      user: '='
    },
    link: function (scope, element, attrs) {
      
      scope.countries = Country.getShortAndNames();
      
      scope.statuses = [
        'Open',
        'Closed',
        'Pending',
        'Work in progress'
      ];
      
      /**
       * Resets the ticket to only include user and ticketDate.
       */
      function resetTicket() {
          scope.ticket = {
          ticketDate: new Date(),
          user: scope.user,
          status: 'Open'
        };
      }
      
      /**
       * Submits the ticket to db.
       * 
       * @param {Object} _ticket (Ticket)
       */
      scope.submit = function (_ticket) {
        Ticket.create(_ticket)
        .then(function (ticket) {
          Notification.success('Ticket submitted');
          
          resetTicket();
          console.log(ticket);
        })
        ['catch'](function (err) {
          
        });
      }
      
      /**
       * Returns a joined string of all values of *item*.
       * It skips *itemName*Id and any values in
       * 
       * @param {Object} item
       * @param {String} itemName
       * @param {Object} options - optional
       * @return {String}
       */
      scope.matched = function (item, itemName, options) {
        if (!options) { options =  {}; }
        if (_.isUndefined(itemName)) { itemName = ''; }
    
        return _.chain(item)
          .filter(function (v, key) { return (key != itemName + 'Id') || !!~_.indexOf(options.skip, key); })
          .map(function (value) { return value; })
          .filter() // Remove empty posts
          .value()
          .join(', ');
      }
      
      /**
       * Gets all categories, subcategories and descriptors
       * and attaches them to scope.
       */
      function getCategories() {
        Category.getAllCategories()
        .then(function (data) {
          scope.categories = data.categories;
          scope.subcategories = data.subcategories;
          scope.descriptors = data.descriptors;
        })
        ['catch'](function (err) {
          Notification.error('Something went wrong with fetching the categories, please refresh the page.')
        });
      }
      
      /**
       * Returns a boolean value of whether the subCategory
       * should be hidden or not.
       * 
       * @param {Object} ticket
       * @return {Boolean}
       */
      scope.hideSubcategory = function (ticket) {
        if (!ticket) { return true; }
        
        return _.some([
          !ticket.category,
          ticket.category && !scope.subcategories[ticket.category.categoryId],
          ticket.category && ticket.subcategory && ticket.category.categoryId != ticket.subcategory.categoryId,
        ]);
      }
      
      /**
       * Returns a boolean value of whether the descriptor
       * should be hidden or not.
       * 
       * @param {Object} ticket
       * @return {Boolean}
       */
      scope.hideDescriptor = function (ticket) {
        if (!ticket) { return true; }
        
        return _.some([
          !ticket.subcategory,
          ticket.subcategory && !scope.descriptors[ticket.subcategory.subcategoryId],
          ticket.subcategory && ticket.descriptor && ticket.subcategory.subcategoryId != ticket.descriptor.subcategoryId
        ]);
      }
      
      /**
       * Gets top 12 customers somehow matching *val*.
       * 
       * @param {String} val
       * @return {Promise} -> ([Customer])
       */
      scope.getCustomer = function (val) {
        return Customer.getFuzzy(val);
      }
      
      /**
       * Gets the last 12 tickets made for for *customerId*
       * and attaches them to scope as scope.relatedTickets.
       * 
       * @param {String} customerId
       */
      function getRelatedTickets(customerId) {
        Ticket.getByCustomerId(customerId)
        .then(function (tickets) {
          scope.relatedTickets = tickets;
        })
        ['catch'](function (err) {
          Notification.error('Something went wrong with fetching related tickets.');
        });
      }
      
      /**
       * Watches for changes in ticket
       */
      scope.$watch('ticket', function (ticket) {
        if (!ticket) {
          resetTicket();
        } else {
          if (scope.hideSubcategory(ticket)) { ticket.subcategory = undefined; }
          if (scope.hideDescriptor(ticket)) { ticket.descriptor = undefined; }
        }
        
      }, true);
      
      /**
       * Watches for changes in ticket.customer.ustomerId
       * and gets related tickets if it's defined
       * otherwise it sets scope.relatedCustomers to [].
       */
      scope.$watch('ticket.customer.customerId', function (customerId) {
        if (_.isUndefined(customerId)) { scope.relatedTickets = []; }
        else { getRelatedTickets(customerId); }
      })
      
      /**
       * Watches for changes in user and assigns ticket.user to user.
       */
      scope.$watch('user', function (user, oldUser) {
        if (scope.ticket) { scope.ticket.user = user; }
      });
      
      getCategories();
    }
  };
}]);

})();