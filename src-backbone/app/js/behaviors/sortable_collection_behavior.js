module.exports = Marionette.Behavior.extend({

    events: {
        'sortupdate': 'on_finished_sorting' // 'sortupdate' is an event name from jquery-ui.sortable
    },

    on_finished_sorting: function(event, ui) {
        let display_index_attr = this.options.display_index_attr;

        let $child = ui.item;
        let new_index = $child.parent().children().index($child);

        let collection = this.view.collection;
        let model = collection.get($child.attr('data-model-cid'));

        // Remove the newly sorted item and re-index every thing else
        collection.remove(model, { silent: true });
        collection.each(function(model, index) {
            var display_index = index;

            // Any models after the newly sorted item should be shifted down
            if (index >= new_index) {
                display_index += 1;
            }

            model.set(display_index_attr, display_index, { silent: true });
        });

        // Finally add back the newly sorted item
        model.set(display_index_attr, new_index, { silent: true });
        collection.add(model, { 
            at: new_index,
            silent: true,
        });

        // Will cause CollectionView to call render()
        console.info('SortableBehavior will now sort its collection');
        collection.sort();
        collection.trigger('sortable');
    },

    onRender: function() {
        this._get_child_view_container()
            .sortable(this.options.sortable_options)
            .disableSelection()
        ;
    },

    onAddChild: function(view) {
        view.$el.attr('data-model-cid', view.model.cid);
    },

    _get_child_view_container: function() {
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
    }

});
