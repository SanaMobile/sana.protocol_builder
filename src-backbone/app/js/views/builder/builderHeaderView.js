const Config  = require('utils/config');
const Helpers = require('utils/helpers');
const App     = require('utils/sanaAppInstance');

const ModalLayoutView = require('views/common/modalLayoutView');
const FlowchartView = require('./flowchartView');

module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/builderHeaderView'),

    ui: {
        titleField: 'input#change-title',
        authorField: 'input#change-author',
        downloadButton: 'a#download-btn',
        saveButton: 'a#save-btn',
        visualizeButton: 'a#visualize-btn',
    },

    events: {
        'keyup @ui.titleField': '_save',
        'keyup @ui.authorField': '_save',
        'click @ui.downloadButton': '_download',
        'click @ui.saveButton':  '_saveProcedure',
        'click @ui.visualizeButton': '_visualize',
    },

    modelEvents: {
        'change:title': '_renderOnce',
        'change:author': '_renderOnce',
    },

    _save: _.debounce(function() {
        this._saveToServer();
    }, Config.INPUT_DELAY_BEFORE_SAVE),

    _saveProcedure: function() {
        this.model.save();
        this.model.pages.forEach(function(page) {
            page.elements.forEach(function(element) {
                element.debounceSave();
            });
        });
    },

    _renderOnce: _.once(function() {
        this.render();
    }),

    _saveToServer: function() {
        this.model.save({
            title: this.ui.titleField.val(),
            author: this.ui.authorField.val(),
        }, {
            error: function(model, response, options) {
                console.warn('Failed to save Procedure meta data:', response.responseJSON);
                App().RootView.showNotification('Failed to save title and author!');
            },
        });
    },

    _download: function(event) {
        event.preventDefault();
        const filename = this.model.get('title') + '.xml';

        this.model.generate(function onSuccess(data, status, jqXHR) {
            Helpers.downloadXMLFile(data, filename);
        }, function onError(jqXHR, textStatus, errorThrown) {
            console.warn('Failed to generate Procedure', textStatus);
        });
    },

    _visualize: function() {
        console.log('visualizing');

        const modalView = new ModalLayoutView({
            title: i18n.t(
                'Flowchart - Solid arrows represent the next question in sequential order. ' +
                'Dashed arrows represent a condition depending on a previous question.'
            ),
            bodyView: new FlowchartView(this.model),
        });
        App().RootView.showModal(modalView);


        const { nodes, linearEdges, conditionalEdges } = this.model.generateGraph();

        const visNodes = new vis.DataSet(
            [
                {
                    id: -1,
                    label: 'Start',
                    shape: 'box',
                    group: -1,
                    widthConstraint: { maximum: 150 }
                },
                ...nodes.map((node, index) => (
                    {
                        id: index,
                        label: node.label,
                        shape: 'box',
                        group: node.page,
                        widthConstraint: { maximum: 150 }
                    }
                )),
                {
                    id: -2,
                    label: 'End',
                    shape: 'box',
                    group: -2,
                    widthConstraint: { maximum: 150 }
                },
            ]
        );

        const edges = [
            ...linearEdges.map(([node1, node2]) => ({
                from: node1,
                to: node2,
                arrows: 'to',
            })),
            ...conditionalEdges.map(([node1, node2]) => ({
                from: node1,
                to: node2,
                arrows: 'to',
                dashes: true
            })),
            {
                from: -1,
                to: 0,
                arrows: 'to'
            },
            {
                from: nodes.length - 1,
                to: -2,
                arrows: 'to'
            },
        ];

        const visEdges = new vis.DataSet(edges);

        const container = document.getElementById('flowchart');
        const data = {
            nodes: visNodes,
            edges: visEdges
        };
        const options = {};
        const network = new vis.Network(container, data, options);

        const resizer = () => {
            network.fit();
            network.off('afterDrawing', resizer);
        };
        network.on('afterDrawing', resizer);
    }
});
