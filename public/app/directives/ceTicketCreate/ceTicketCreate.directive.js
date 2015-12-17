(function () {

angular.module('customerEngineApp')
.directive('ceTicketCreate',
  ['$location', '$state', '$timeout', '$interval', 'Customer', 'Person', 'Ticket', 'Country', 'Category', 'Notification', 'Department', 'Product', 'timerDiffFilter',
  function ($location, $state, $timeout, $interval, Customer, Person, Ticket, Country, Category, Notification, Department, Product, timerDiffFilter) {
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
      
      scope.loadingCurrent = false;
      
      var timer;
      
      var existingPerson;
      
      scope.romeOptions = {
        max: moment().endOf('day')
      };
      
      function setTimerDates(ticket) {
        scope.timerString = timerDiffFilter([
          ticket // Start time
            ? ticket.ticketDate
            : new Date(),
          ticket // End time
            ? ticket.ticketDateClosed
            : new Date()
          ]);
      }
      function startTimer() {
        // Initial set
        setTimerDates(scope.ticket);
        
        timer = $interval(function () {
          setTimerDates(scope.ticket);
        }, 1000);
      }
      
      function stopTimer() {
        if (timer) {
          $interval.cancel(timer);
        }
      }
      
      function setupTimerString() {
        if (scope.ticket && scope.ticket.status != 'Closed') {
          startTimer();
        } else {
          setTimerDates(scope.ticket);
        }
      }
      
      scope.countries = Country.getShortAndNames();
      
      scope.statuses = [
        'Open',
        'Closed',
        'Pending'
      ];
      
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
            setupTimerString();
          })
          ['catch'](function (err) {
            scope.loadingCurrent = false;
            scope.ticket = emptyTicket();
            setupTimerString();
          });
        } else {
          // Set up new ticket
          scope.ticket = emptyTicket();
          setupTimerString();
        }
      }
      
      var submitted = false;
      
      /**
       * Submits the ticket to db and sets scope.ticketId to undefined.
       * 
       * @param {Object} _ticket (Ticket)
       */
      scope.submit = function (_ticket) {
        
        // return console.log(_ticket);
        
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
      
      scope.discard = function (_ticket) {
        
        if (scope.confirmDelete) {
          scope.confirmDelete(
            'Discard ticket?',
            'Are you sure you want to discard the ticket?\nThis will delete it entirely.',
            function (answer) {
              if (answer) {
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
      
      scope.goBack = function (_ticket) {
        Ticket.autoSave(_ticket);
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
       * Gets top 12 customers somehow matching *val*.
       * 
       * @param {String} val
       * @return {Promise} -> ([Customer])
       */
      scope.getCustomer = function (val) {
        return Customer.getFuzzy(val);
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
       * @param {Object} person
       * @param {Object} $item
       */
      scope.setPerson = function (person, $item) {
        // existingPerson = angular.copy($item);
        
        console.log($item);
        console.log(person);
        
        console.log(scope.ticket.person === person);
        
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
          
          setupTimerString();
        } else {
          ticket.ticketDateClosed = new Date();
          if (timer) {
            stopTimer();
          }
          setTimerDates(ticket);
        }
        
        // Remove transferredDepartment if ticket isn't transferred
        if (!ticket.transferred) {
          ticket.transferredDepartment = {};
        }
        
        Ticket.autoSave(ticket) 
        .then(function (t) {
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
       * Watches for changes in user and assigns ticket.user to user.
       */
      scope.$watch('user', function (user, oldUser) {
        if (scope.ticket) { scope.ticket.user = user; }
      });
      
      getCategories();
      getDepartments();
      getProducts();
      
      setupTimerString();
      
      scope.$on('$destroy', function (event) {
        stopTimer();
      })
      
    }
  };
}]);

})();