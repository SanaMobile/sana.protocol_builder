$(document).ready(function () {
    var $procedureList = $('ul.procedure');
    var $pageTemplate = $('li.page-template').clone().removeClass();

    var init = function () {
        var NUM_PAGES = 5;

        for (var i = 1; i <= NUM_PAGES; i++) {
            var $newPageContainer = $pageTemplate.clone();
            $newPageContainer.find('a.open-page span.label').text('Page ' + i);
            $procedureList.append($newPageContainer);
        };
        $('li.page-template').remove();
    }

    var setupEventHandlers = function () {
        $procedureList.on('click', 'a.open-page', function (ev) {
            console.log('Hello World');

            ev.preventDefault();
        });

        var pageCounter = 1;
        $procedureList.on('click', 'a.add-page', function (ev) {
            var $newPageContainer = $pageTemplate.clone();
            $newPageContainer.find('a.open-page span.label').text('New Page ' + pageCounter++);
            $newPageContainer.hide();
            $(this).parents('li').after($newPageContainer);
            $newPageContainer.slideDown(500);
            ev.preventDefault();
        });

        $procedureList.on('click', 'span.delete-page', function (ev) {
            var $page = $(this).parents('li');
            $page.slideUp(500, function () {
                $page.remove();
            });

            ev.preventDefault();
        });

        $procedureList.on('click', 'span.add-condition', function (ev) {
            var $button = $(this);
            var $pageContainer = $button.parents('li');

            $pageContainer.find('a.open-page').addClass('has-condition');
            $button.toggleClass('add-condition');
            $button.toggleClass('delete-condition');

            ev.preventDefault();
        });

        $procedureList.on('click', 'span.delete-condition', function (ev) {
            var $button = $(this);
            var $pageContainer = $button.parents('li');

            $pageContainer.find('a.open-page').removeClass('has-condition');
            $button.toggleClass('add-condition');
            $button.toggleClass('delete-condition');

            ev.preventDefault();
        });

        $procedureList.sortable({
            handle: 'span.drag-handle',
            items: 'li:not(:first-child)',
            placeholder: 'ui-state-highlight',
            revert: true,
            scroll: true,
        });
        $procedureList.disableSelection();
    }

    init();
    setupEventHandlers();
});
