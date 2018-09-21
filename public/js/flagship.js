$(document).ready(function () {
    var oldId = null;

    $('.tabs-controls__link').click(function (e) {
        e.preventDefault();

        if ($(this).hasClass('tabs-controls__link--active')) {
            return false;
        }

        var currentId = parseInt($(this).data('id'), 10);
        $('.tabs-controls__link--active').removeClass('tabs-controls__link--active');
        $(this).addClass('tabs-controls__link--active');

        if (currentId < oldId) { // item is hidden
            var timing = $('.card.hidden').length * 100;
            $('.card').each(function (index) {
                if (index > (currentId - 1) || index == (currentId - 1)) {
                    window.setTimeout(function () {
                        $('.card').eq(index).removeClass('hidden');
                    }, timing - (index * 100));
                }
            });
        } else {
            $('.card').each(function (index) {
                if (index < (currentId - 1)) {
                    window.setTimeout(function () {
                        $('.card').eq(index).addClass('hidden');
                    }, index * 100);
                }
            });
        }

        oldId = currentId;
    });
});