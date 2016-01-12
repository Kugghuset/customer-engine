(function () {

angular.module('customerEngineApp')
.directive('ceTicketCreate',
  ['$location', '$state', '$timeout', '$interval', 'Customer', 'Person', 'Ticket', 'Country', 'Category', 'Notification', 'Department', 'Product',
  function ($location, $state, $timeout, $interval, Customer, Person, Ticket, Country, Category, Notification, Department, Product) {
  return {
    templateUrl: 'app/directives/ceTicketCreate/ceTicketCreate.html',
    restrict: 'EA',
    scope: {
      ticket: '=',
      relatedTickets: '=',
      user: '=',
      ticketId: '=',
      loadingTickets: '='
    },
    link: function (scope, element, attrs) {
      
      var saveOnDestroy = true;
      var hasUpdates = false;
      
      scope.loadingCurrent = false;
      
      scope.romeOptions = {
        max: moment().endOf('day')
      };
      
      scope.countries = Country.getShortAndNames();
      
      scope.statuses = [
        'Open',
        'Closed',
        'Pending'
      ];
      
      /**
       * Returns a default ticket object
       * which defaults to the current user as the user,
       * the user's department as the department,
       * its ticketDate to now
       * and the status set to 'Open'.
       * 
       * @return {Object}
       */
      function emptyTicket() {
        return {
          ticketDate: new Date(),
          user: scope.user,
          status: 'Open',
          department: scope.user ? scope.user.department : undefined
        };
      }
      
      /**
       * @param {Object} obj
       * @return {Object}
       */
      function cleanEmpty(obj) {
        _.forEach(_.keys(obj), function (key) {
          if (_.isNull(obj[key]) || _.isUndefined(obj[key])){
            delete obj[key];
          } else if (_.isObject(obj[key])) {
            if (!_.chain(obj[key]).map().filter().value().length) {
              delete obj[key];
            } else {
              return obj[key] = cleanEmpty(obj[key]);
            }
          }
        })
        
        return obj;
      }
      
      /**
       * Resets the ticket to only include user and ticketDate.
       */
      function resetTicket() {
        
        if (scope.ticketId) {
          // Get ticket from local tickets
          scope.loadingCurrent = true;
          
          Ticket.getById(scope.ticketId)
          .then(function (ticket) {
            scope.loadingCurrent = false;
            scope.ticket = cleanEmpty(ticket);
          })
          ['catch'](function (err) {
            scope.loadingCurrent = false;
            scope.ticket = emptyTicket();
          });
        } else {
          // Set up new ticket
          scope.ticket = emptyTicket();
        }
      }
      
      var submitted = false;
      
      /**
       * Submits the ticket to db and sets scope.ticketId to undefined.
       * 
       * @param {Object} _ticket (Ticket)
       */
      scope.submit = function (_ticket) {
        
        // Check if the ticket is allowed to be saved.
        if (!scope.canSave(_ticket)) {
          scope.confirmDelete(
            'No chosen customer.',
            'To save, please choose a customer.'
          );
          return; // early
        }
        
        // Removes the ticket from the autosave queue.
        Ticket.emptyQueue();
        
        // Set ticketDateClosed to now if it's unset and the status is closed.
        if (_ticket.status === 'Closed' && !_ticket.ticketDateClosed) {
          _ticket.ticketDateClosed = new Date();
        }
        
        submitted = true;
        Ticket.createOrUpdate(_.assign(_ticket))
        .then(function (ticket) {
          Notification.success('Ticket submitted');
          
          scope.ticketId = undefined;
          resetTicket();
          $state.go('main.dashboard');
        })
        ['catch'](function (err) {
          
        });
      }
      
      /**
       * Deletes the ticket in the DB and returns to the dashboard.
       * If there is a modal (scope.confirmDelete), it uses that to ask the user,
       * otherwise the regular confirm prompt will be used.
       * 
       * If the user says OK, the ticket is completely removed from the system,
       * and is then transitioned to the dashboard.
       * Otherwise really nothing happens.
       * 
       * @param {Object} _ticket
       */
      scope.discard = function (_ticket) {
        
        // Check for the custom modal
        if (scope.confirmDelete) {
          scope.confirmDelete(
            'Discard ticket?',
            'Are you sure you want to discard the ticket?\nThis will delete it entirely.',
            function (answer) {
              if (answer) {
                // Remove if it's been saved, I.E. if there's an ID
                if (_ticket && _ticket.ticketId) {
                  Ticket.remove(_ticket.ticketId)
                }
                $state.transitionTo('main.dashboard');
              }
            }
          );
        } else {
          if (confirm('Are you sure you want to discard the ticket?\n\nThis will delete it entirely.')) {
            if (_ticket && _ticket.ticketId) {
              Ticket.remove(_ticket.ticketId)
            }
            $state.transitionTo('main.dashboard');
          }
        }
      }
      
      /**
       * Transitions to dashboard and, if allowed, saves the user
       * 
       * @param {Object} _ticket
       */
      scope.goBack = function (_ticket) {
        if (scope.canSave(_ticket)) {
          // Save if it's allowed
          Ticket.autoSave(_ticket);
        }
        // Go to dashboard
        $state.transitionTo('main.dashboard');
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
        
        if (_.isString(item)) { return item; } // Early
        
        return _.chain(item)
          .filter(function (v, key) { return (key != itemName + 'Id') || !!~_.indexOf(options.skip, key); })
          .map(function (value) { return value; })
          .filter() // Remove empty posts
          .value()
          .join(', ');
      }
      
      /**
       * Returns a boolean value for whether the ticket is allowed to be saved or not.
       * This is determined by whether there is a company or not.
       * 
       * @param {Object} ticket
       * @return {Boolean}
       */
      scope.canSave = function (ticket) {
        // sort of null check
        if (!ticket) { return false; }
        
        return _.every([
          // customers require an ID, as it otherwise cannot be stored.
          ticket.customer && ticket.customer.customerId
        ]);
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
       * Gets all departments and attaches them to scope.
       */
      function getDepartments() {
        Department.getAll()
        .then(function (departments) {
          scope.departments = departments;
        })
        ['catch'](function (err) {
          Notification.error('Something went wrong with fetching the departments, please refresh the page.')
        });
      }
      
      /**
       * Gets all products and attaches them to scope.
       */
      function getProducts() {
        Product.getAll()
        .then(function (products) {
          scope.products = products;
        })
        ['catch'](function (err) {
          Notification.error('Something went wrong with fetching the departments, please refresh the page.')
        });
      }
      
      /**
       * Returns a boolean value of whether the subcategory
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
       * @param {Object} customer
       */
      scope.openCreateCustomerForNew = function () {
        $timeout(function () {
          // Don't open the modal again.
          if (scope.customerModalIsOpen) { return; }
          
          var customer = scope.ticket.customer || {};
          
          if (!_.every([
            !!customer.orgName,
            !!customer.orgNr,
            !!customer.customerNumber
          ])) {
            scope.openModal(scope.ticket.customer)
          }
            
        }, 150)
      }
      
      /**
       * Returns true or false for whether the customer is deemed valid
       * @return {Boolean}
       */
      scope.customerIsValid = function (customer) {
        if (!scope.ticket && !customer) { return true; }
        
        customer = customer || scope.ticket.customer || {};
        
        return !_.some([ // Either all are empty
          !!(customer.orgName),
          !!(customer.orgNr || customer.customerNumber)
        ]) || _.every([ // Or all has values
          !!(customer.orgName),
          !!(customer.orgNr || customer.customerNumber)
        ]);
      }
      
      /**
       * Gets top 12 customers somehow matching *val*.
       * 
       * @param {String} val
       * @param {Object} current
       * @return {Promise} -> ([Customer])
       */
      scope.getCustomer = function (val, current) {
        // Remove everything but orgName from current if *val* doesn't match.
        if (current && current.orgName != val) {
          delete current.customerId;
          delete current.orgNr;
          delete current.customerNumber;
        }
        
        return Customer.getFuzzy(val);
      }
      
      /**
       * Sets scope.ticket.customer to *$item*
       * and "disables" the array.
       * @param {Object} $item (Customer)
       */
      scope.setCustomer = function ($item) {
        scope.ticket.customer = $item;
      }
      
      /**
       * @param {String|Number} customerId
       * @param {String} query
       * @param {String} colName
       * @return {Promise}
       */
      scope.getContacts = function (customerId, query, colName) {
        Person.cleanOther(scope.person, colName);
        
        return Person.getFuzzyBy(customerId, query, colName);
      }
      
      /**
       * Gets the last 12 tickets made for for *customerId*
       * and attaches them to scope as scope.relatedTickets.
       * 
       * @param {String} customerId
       */
      function getRelatedTickets(customerId) {
        scope.loadingTickets = true;
        Ticket.getByCustomerId(customerId)
        .then(function (tickets) {
          scope.loadingTickets = false;
          scope.relatedTickets = tickets;
        })
        ['catch'](function (err) {
          scope.loadingTickets = false;
          Notification.error('Something went wrong with fetching related tickets.');
        });
      }
      
      /**
       * Sets *person* to *$item*.
       * 
       * @param {Object} person
       * @param {Object} $item
       */
      scope.setPerson = function (person, $item) {
        
        person = $item;
      }
      
      /**
       * Watches for changes in ticket
       */
      scope.$watch('ticket', function (ticket, oldTicket) {
        
        if (!ticket) {
          return resetTicket();
        } else {
          if (scope.hideSubcategory(ticket)) { ticket.subcategory = undefined; }
          if (scope.hideDescriptor(ticket)) { ticket.descriptor = undefined; }
        }
        
        // Don't autosave if it's just been creatad
        if (!oldTicket) { return; }
        
        // Only allow closed tickets to be transferred
        if (ticket.status != 'Closed') {
          ticket.transferred = undefined;
          // Set ticketDateClosed to undefined
          if (ticket.ticketDateClosed) {
            ticket.ticketDateClosed = undefined;
          }
        } else {
          if (!ticket.ticketDateClosed) {
            ticket.ticketDateClosed = new Date();
          }
        }
        
        // Remove transferredDepartment if ticket isn't transferred
        if (!ticket.transferred) {
          ticket.transferredDepartment = {};
        }
        
        // Only auto save if there's a customer object.
        if (!scope.canSave(ticket)) {
          return; // early
        }
        
        hasUpdates = true;
        Ticket.autoSave(ticket)
        .then(function (t) {
          hasUpdates = false;
          if (!t) { return; }
          if (t && !submitted) { Notification('Ticket autosaved'); }
          // Attach personId if not present
          if (t && t.person && (ticket.person && !ticket.person.personId)) {
            ticket.person.personId = t.person ? t.person.personId : t.person;
          }
          // Attach ticketId if not present
          if (t && t.ticketId && !ticket.ticketId) {
            scope.ticket.ticketId = t.ticketId;
            $state.go($state.current.name, { ticketId: t.ticketId }, { location: true, notify: false })
            .then(function (item) {
              // Replace the last history item with this route
              $location.replace();
            })
          }
        })
        ['catch'](function (err) {
          hasUpdates = true;
          Notification.error('Auto save failed.')
        });
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
       * Watches for changes in the customer object for the ticket.
       */
      scope.$watch('ticket.customer', function (customer, oldCustomer) {
        if (customer && !customer.orgName) {
          scope.ticket.customer = {};
        }
      }, true);
      
      /**
       * Watches for changes in user and assigns ticket.user to user.
       */
      scope.$watch('user', function (user, oldUser) {
        if (scope.ticket) { scope.ticket.user = user; }
      });
      
      getCategories();
      getDepartments();
      getProducts();
      
      scope.$on('$destroy', function (event) {
        
        scope.loadingCurrent = false;
        
        if (hasUpdates && scope.canSave(scope.ticket)) {
          // Save if it's allowed
          Ticket.emptyQueue();
          Ticket.autoSave(scope.ticket, 0)
          .then(function (res) {
            // updated
          })
          ['catch'](function (err) {
             console.log(err);
          })
        }
        
      });
      
    }
  };
}]);

})();