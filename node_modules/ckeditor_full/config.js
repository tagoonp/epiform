/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */


CKEDITOR.editorConfig = function( config ) {

    // Define changes to default configuration here.
    // For the complete reference:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config

    // The toolbar groups arrangement, optimized for a single toolbar row.
    config.toolbarGroups = [
        { name: 'document', groups: [ 'mode'] },
        { name: 'clipboard', groups: [{name: 'clipboard', items: [ 'Cut', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] }, 'undo' ] },
        { name: 'basicstyles', groups: [ 'basicstyles' ,'cleanup' ] },
        { name: 'colors' },
        { name: 'paragraph',   groups: [ 'list', 'indent', 'align' ] },
        // { name: 'insert'},
        { name: 'styles' },
        { name: 'tools' }
    ];

    // The default plugins included in the basic setup define some buttons that
    // we don't want too have in a basic editor. We remove them here.
    config.removeButtons = 'Save,NewPage,Flash,Smiley,Iframe,ShowBlocks,SpecialChar,Preview,PageBreak,Print,Anchor,Subscript,Superscript';
    //
    // // Considering that the basic setup doesn't provide pasting cleanup features,
    // // it's recommended to force everything to be plain text.
    config.forcePasteAsPlainText = false;
    //
    // // Let's have it basic on dialogs as well.
    config.removeDialogTabs = 'link:advanced';
};
