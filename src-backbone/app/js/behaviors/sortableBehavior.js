const ON_SORT_EVENT = 'sortable';


let SortableBehavior = Marionette.Behavior.extend({

    events: {
        'sortupdate': 'onFinishedSorting' // 'sortupdate' is an event name from jquery-ui.sortable
    },

    onFinishedSorting: function(event, ui) {
        let $child = ui.item;
        let newIndex = $child.parent().children().index($child);
        let collection = this.view.collection;
        let model = collection.get($child.attr('data-model-cid'));

        // Ask user before sorting if it has some side effects
        if (_.isFunction(model.shouldConfirmBeforeSort)) {
            let onSortOptions = model.shouldConfirmBeforeSort(newIndex);

            if (onSortOptions) {
                let warningMessage = onSortOptions.warningMessage + ' ' +
                                     i18n.t("Are you sure you wish to continue?");

                if (confirm(warningMessage)) {
                    onSortOptions.callback();
                } else {
                    event.preventDefault();
                    return;
                }
            }
        }

        let displayIndexAttr = this.options.displayIndexAttr; // attribute of model that determines sort order

        // Remove the newly sorted item and re-index every thing else
        collection.remove(model, { silent: true });
        collection.each(function(model, index) {
            let displayIndex = index;

            // Any models after the newly sorted item should be shifted down
            if (index >= newIndex) {
                displayIndex += 1;
            }

            model.set(displayIndexAttr, displayIndex, { silent: true });
        });

        // Finally add back the newly sorted item
        model.set(displayIndexAttr, newIndex, { silent: true });
        collection.add(model, { 
            at: newIndex,
            silent: true,
        });

        // Will cause CollectionView to call render()
        console.info('SortableBehavior will now sort its collection');
        collection.sort();
        collection.trigger(ON_SORT_EVENT);
    },

    // overrides CollectionView/CompositeView onAddChild()
    onAddChild: function(view) {
        view.$el.attr('data-model-cid', view.model.cid);
    },

    onRender: function() {
        this._getChildViewContainer()
            .sortable(this.options.sortableOptions)
        ;
    },

    _getChildViewContainer: function() {
        if (typeof this.view.getChildViewContainer === 'function') {
            // CompositeView
            return this.view.getChildViewContainer(this.view);
        } else if (typeof this.view.getItemViewContainer === 'function') {
            // CompositeView for Marionttte 1.x
            return this.view.getItemViewContainer(this.view);
        } else {
            // CollectionView
            return this.$el;
        }
    },

});

SortableBehavior.ON_SORT_EVENT = ON_SORT_EVENT;

module.exports = SortableBehavior;
