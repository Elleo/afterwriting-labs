define(function(require) {

    var Protoplast = require('protoplast'),
        template = require('text!plugin/io/view/save.hbs'),
        BaseComponent = require('core/view/base-component'),
        SectionViewMixin = require('theme/aw-bubble/view/section-view-mixin'),
        SaveViewPresenter = require('plugin/io/view/save-view-presenter');
    
    return BaseComponent.extend([SectionViewMixin], {

        $meta: {
            presenter: SaveViewPresenter
        },
        
        hbs: template,

        displayOpenFromDropbox: false,

        displayOpenFromGoogleDrive: false,

        $saveFountainLocally: null,

        $saveFountainDropbox: null,

        $saveFountainGoogleDrive: null,

        $savePdfLocally: null,

        $savePdfDropbox: null,

        $savePdfGoogleDrive: null,

        addBindings: function() {
            Protoplast.utils.bind(this, {
                displayOpenFromDropbox: this._updateOpenFromDropboxVisibility,
                displayOpenFromGoogleDrive: this._updateOpenFromGoogleDriveVisibility
            });
        },

        addInteractions: function() {

            this.onClick(this.$saveFountainLocally, this.dispatch.bind(this, 'save-as-fountain'));
            this.onClick(this.$saveFountainDropbox, this.dispatch.bind(this, 'dropbox-fountain'));
            this.onClick(this.$saveFountainGoogleDrive, this.dispatch.bind(this, 'google-drive-fountain'));

            this.onClick(this.$savePdfLocally, this.dispatch.bind(this, 'save-as-pdf'));
            this.onClick(this.$savePdfDropbox, this.dispatch.bind(this, 'dropbox-pdf'));
            this.onClick(this.$savePdfGoogleDrive, this.dispatch.bind(this, 'google-drive-pdf'));
        },

        _updateOpenFromDropboxVisibility: function() {
            if (this.displayOpenFromDropbox) {
                this.$saveFountainDropbox.parent().show();
                this.$savePdfDropbox.parent().show();
            } else {
                this.$saveFountainDropbox.parent().hide();
                this.$savePdfDropbox.parent().hide();
            }
        },

        _updateOpenFromGoogleDriveVisibility: function() {
            if (this.displayOpenFromGoogleDrive) {
                this.$saveFountainGoogleDrive.parent().show();
                this.$savePdfGoogleDrive.parent().show();
            } else {
                this.$saveFountainGoogleDrive.parent().hide();
                this.$savePdfGoogleDrive.parent().hide();
            }
        }

    });

});
