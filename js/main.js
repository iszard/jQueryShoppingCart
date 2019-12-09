let cart = 0;

function addItem(id, name, description, price, moreInfo) {
    let html = `<div class="item" data-id=` + id + `>
                    <div class="name">` + name + `</div>
                    <img src="https://via.placeholder.com/400x200">
                    <div class="description">` + description + `</div>
                    <div class="price">` + price + `</div>
                    <button class="item-add">Add to cart</button>
                    <button class="item-remove">Remove</button>
                    <br>
                    <a class="more-info-link" href="#">More info</a>
                    <div class="more-info">` + moreInfo + `</div>
                </div>`;

    $('#container').prepend(html);
}

$(document).ready(function() {
    $('#container').on('click', '.more-info-link', function() {
        event.preventDefault();

        $(this).parent().find('.more-info').slideToggle('fast');
        $(this)
            .animate({ "opacity": 0.5, "margin-left": 10 }, 'fast')
            .animate({ "opacity": 1, "margin-left": 0 }, 'fast');
    });

    $('#container').on('click', '.item-remove', function() {
        $(this).parent().remove();
    });

    $.ajax('data/item.json', {
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
    })
    .done(function(response) {
        let items = response.items;
        items.forEach(function(item) {
            addItem(item.id, item.name, item.description, item.price, item.moreInfo);
        });
    })
    .fail(function(request, errorType, errorMessage) {
        console.log(errorMessage)
    })
    .always(function() {

    });

    $('#container').on('click', '.item-add', function() {
        let id = $(this).parent().data('id');
        $.ajax('data/addToCart.json', {
            type: 'POST',
            data: { id: id },
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function(response) {
            if (response.message === 'success') {
                let price = response.price;

                cart += price;

                $('#cart-container').text('$' + cart)
            }
        });
    });

    $('#newsletter-checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('#newsletter-frequency').fadeIn();
        } else {
            $('#newsletter-frequency').fadeOut();
        }
    });
    $('#newsletter-checkbox').trigger('change');

    $('#cart-form').on('submit', function(event) {
        event.preventDefault();

        let data = { 
            form: $(this).serialize(), 
            price: cart 
        };

        console.log(data.form)

        $.ajax($(this).attr('action'), {
            type: 'post',
            data: data
        })
        .done(function(response) {
            $('#feedback-message').text(response.message);
        })
    });
})