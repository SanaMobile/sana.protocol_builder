$(document).ready(function () {
    var $procedureList = $('ul.procedure');
    var numNewPages = 1;

    $procedureList.on('click', 'a.open-page', function (ev) {
        console.log('Hello World');
        ev.preventDefault();
    });

    $procedureList.on('click', 'span.add-condition', function (ev) {
        var $button = $(this);
        $button.parent('li').wrapInner('<div class="condition"></div>');
        $button.toggleClass('add-condition');
        $button.toggleClass('remove-condition');
        ev.preventDefault();
    });

    $procedureList.on('click', 'span.remove-condition', function (ev) {
        var $button = $(this);

        while ($button.parent().is('.condition')) {
            $button.unwrap();
        }

        $button.toggleClass('add-condition');
        $button.toggleClass('remove-condition');
        ev.preventDefault();
    });

    $procedureList.on('click', 'a.add-page', function (ev) {
        var $parent = $(this).parent();
        $parent.after($parent.clone());
        $parent.after('<li><a href="#" class="open-page">New Page ' + numNewPages + '</a></li>');
        numNewPages++;
        ev.preventDefault();
    });
});
