$(document).ready(function () {
    var $procedureList = $('ul.procedure');
    var numNewPages = 1;

    $procedureList.on('click', 'a.add-page', function (ev) {
        var $parent = $(this).parent();
        $parent.after($parent.clone());
        $parent.after('<li><a href="#" class="open-page">New Page ' + numNewPages + '</a></li>');
        numNewPages++;
        
        ev.preventDefault();
    });
});
