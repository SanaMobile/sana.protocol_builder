const Config  = require('utils/config');
const Helpers = require('utils/helpers');
const App     = require('utils/sanaAppInstance');

let Procedure  = require('models/procedure');
let Page = require('models/page');
let Element = require('models/element');

let ProcedureVersions = require('collections/procedureVersions');

let BuilderVersionCollectionView = require('views/builder/builderVersionCollectionView');

module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/builderHeaderView'),

    // templateHelpers: function() {
    //     console.log('hi');
    //     // console.log(this.model);
    //     // console.log(this.model.getAllVersions());
    //     // console.log(this.model.getAllVersions().get('models'));
    //     // console.log(this.model.getAllVersions().models);
    //     // console.log(this.model.getAllVersions().collection);
    //     // console.log(this.model.getAllVersions().toJSON());
    //     // console.log(this.model.getAllVersions().child);
    //     // console.log(this.model.getAllVersions().length);
    //     console.log('bye');
    //     // $.ajax({

    //     // })
    //     var a = [{'id':3,'version':4}, {'id':5,'version':5}];
    //     var C = Backbone.Collection.extend({
    //         model: Procedure
    //     });
    //     var c = new C(a);
    //     console.log(c);
    //     console.log(c.models);
    //     // var x = Backbone.Collection.extend({
    //     //     model: Procedure,
    //     //     url: '/api/procedures?only_return_id=true&uuid=0a86b599-a1a7-47d5-a66d-ad810660003d',
    //     // });

    //     // var y = new x();    
    //     // y.fetch({reset:false})
    //     // .done(()=>console.log(y));

    //     // console.log(y);
    //     return {
    //         // versionElements: c.models,
    //         versionElements: this.model.getAllVersions().models,    
    //         // versionElements: [{'id':3,'version':4}, {'id':5,'version':5}],
    //     };
    // },
    ui: {
        titleField: 'input#change-title',
        authorField: 'input#change-author',
        versionSelector: 'select#select-version',
        downloadButton: 'a#download-btn',
        saveButton: 'a#save-btn',
        saveVersionButton: 'a#save-version-btn',
    },

    events: {
        'keyup @ui.titleField': '_save',
        'keyup @ui.authorField': '_save',
        'click @ui.downloadButton': '_download',
        'click @ui.saveButton':  '_saveProcedure',
        'click @ui.saveVersionButton': '_saveNewProcedureVersion',
        'change @ui.versionSelector': '_selectVersion',
    },

    modelEvents: {
        'change:title': '_renderOnce',
        'change:author': '_renderOnce',
    },

    regions: {
        procedureVersionSelect: 'section#procedures-version-list',
    },
  
    initialize: function() {
        // var x = Backbone.Collection.extend({
        //     model: Procedure,
        //     url: '/api/procedures?only_return_id=true&uuid=0a86b599-a1a7-47d5-a66d-ad810660003d',
        // });

        // var y = new x();    
        // y.fetch({
        //     success: function() {
        //         console.info('Fetched Procedures');
        //         this._updateVersions();
        //     },
        // });
        // this.procedures = y;
        // this.procedures = this.model.getAllVersions();
        this.procedures = new ProcedureVersions(null, {uuid: this.model.get('uuid')});
        // this.procedures = this.model.getVersionCollection();
        console.log('know');
        console.log(this.procedures);
        console.log('mad');
    },

    _updateVersions: function() {
        this.latestVersion = 0;
        // for (var i in this.procedures) {
        //     procedureV = this.procedures[i];
        //         $('#select-version').append($('<option>', {
        //             value: procedureV.id,
        //             text: procedureV.version
        //         }));
        // }
        this.ui.versionSelector.find('option').remove();

        let self = this;
        this.procedures.each(function(procedure) {
            var isSelected = false;
            if (self.model.id == procedure.id) {
                isSelected = true;
            }

            if (procedure.attributes.version > self.latestVersion) {
                self.latestVersion = procedure.attributes.version;
            }

            self.ui.versionSelector.append($('<option>', {
                // TODO: get the current language?
                value: procedure.id,
                text: procedure.attributes.version,
                selected: isSelected
            }));
        });
        console.log('weed13');
        console.log(this.procedures);
        // for (var i in this.procedures) {}
    },

    onBeforeShow: function() {
        // Procedures collection
        // this._proceduresCollectionView = new BuilderVersionCollectionView({
        //     collection: this.procedures,
        // });
        // this.showChildView('procedureVersionSelect', this._proceduresCollectionView);
        console.log('hey');
    },

    onAttach: function() {
        let self = this;
        this.procedures.fetch({
            success: function() {
                console.info('Fetched Procedures Versions');
                console.log(self.procedures);
                self._updateVersions();
                console.log('shit5');
            },
        });
    },

    // initialize: function() {
    //     $.ajax({
    //         // url: "/api/procedures?only_return_id=true&uuid=" + this.model.get('uuid'),
    //         url: "/api/procedures?only_return_id=true&uuid=0a86b599-a1a7-47d5-a66d-ad810660003d",
    //         dataType: "json",
    //         success: function( data ) {
    //             for (var i in data) {
    //                 car = data[i];
    //                     $('#select-version').append($('<option>', {
    //                         value: car.id,
    //                         text: car.version
    //                     }));
    //             }
    //         }
    //     }); 
    // },

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

    _saveNewProcedureVersion: function() {
        const nextVersion = this.latestVersion + 1;
        console.log('heyheyhey');
        console.log(this.model.get('id'));
        let procedure = new Procedure({
            uuid: this.model.get('uuid'),
            version: nextVersion,
            title: this.model.get('title'),
            author: this.model.get('author'),
            owner: this.model.get('owner'),
        });

        let self = this;
        let pageCount = self.model.pages.length;

        procedure.save({}, {
            success: function(data) {
                console.info('Created new version for procedure', procedure.id);
                let newProcedureId = data.id;

                if (pageCount === 0) {
                    // Load procedureId
                    Backbone.history.navigate('procedures/' + newProcedureId, {trigger: true});
                }

                // Save the new copies of pages
                self.model.pages.forEach(function(page) {
                    console.log(procedure.get('id'));
                    let copyPage = new Page({
                        display_index: page.get('display_index'),
                        procedure: newProcedureId,
                        show_if: page.get('show_if'),
                    });

                    let elementCount = page.elements.length;

                    copyPage.save({}, {
                        success: function (data) {
                            console.info('Created Page', page.get('id'));
                            // Don't think this is needed so commenting out
                            // procedure.pages.add(copyPage);
                            let newPageId = data.id;

                            
                            if (elementCount === 0) {
                                pageCount--;
                                if (pageCount === 0) {
                                    // load it in.
                                    Backbone.history.navigate('procedures/' + newProcedureId, {trigger: true});

                                }
                            }

                            page.elements.forEach(function(element) {
                                let copyElement = new Element({
                                    display_index: element.get('display_index'),
                                    page: newPageId,
                                    question: element.get('question'),
                                    concept: element.get('concept'),
                                    element_type: element.get('element_type'),
                                });
                                copyElement.debounceSave({}, {
                                    success: function() {
                                        elementCount--;
                                        if (elementCount === 0) {
                                            pageCount--;
                                            if (pageCount === 0) {
                                                // load it in...
                                                Backbone.history.navigate('procedures/' + newProcedureId, {trigger: true});
                                            }
                                        }
                                    },
                                });
                            });

                        },
                        error: function error() {
                            console.warn('Failed to create Page', page.get('id'));
                            App().RootView.showNotification('Failed to create Page!');
                        }
                    });
                });

            },
            error: function() {
                console.warn('Failed to create Procedure!');
                App().RootView.showNotification('Failed to create Procedure!');
            },
        });



        // TODO, update the current procedure view to this new version.
    },

    _renderOnce: _.once(function() {
        this.render();
    }),

    _saveToServer: function() {
        let self = this;
        this.model.save({
            title: this.ui.titleField.val(),
            author: this.ui.authorField.val(),
        }, {
            success: function() {
                self._updateVersions();
            },
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

    _selectVersion: function() {
        console.log('war1');
        console.log(this.ui.versionSelector.val());
        Backbone.history.navigate('procedures/' + this.ui.versionSelector.val(), {trigger: true});
        // // App.Router().proceduresRouter
        // App.routers.proceduresRouter.navigate("procedures/40", {trigger: true});
    },

});
