$(document).ready(function () {
    $('#gal-refreshButton').on('click', refreshButtonClick); // start click funtion essential
    $('#gal-refreshButton').trigger('click'); // start refresh

    // add a checkbox state change event listener
    $('input[name="checkStyle[]"]').on('change', function () {
        // count the number of currently checked checkboxes
        var checkedCount = $('input[name="checkStyle[]"]:checked').length;

        // if no checkboxes are checked, check all
        if (checkedCount === 0) {
            $('input[name="checkStyle[]"]').prop('checked', true);
        }
    });
});

var galleryImages = $('.gallery-images');
var numImages = 9;
//dummy loading image
function baseImages() {
    // Remove existing loading-dummy element
    galleryImages.empty(); //or galleryImages.find('.loading-dummy').remove();


    for (var i = 0; i < numImages; i++) {
        galleryImages.append(`
            <div class="loading-dummy" style="width: 100%; height: 0; padding-bottom: 75%; background-color: #ccc; position: relative; margin: 1px; opacity: 0.1;">
                <div id="dummy-loading-${i}" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; color: #333;">
                    loading...
                </div>
            </div>
        `);
    }

}

function loadImages() {

    var selectedFolder = document.getElementById("gal-quarter").value;

    //check checked styles
    var selectedFolders = [];
    $('input[name="checkStyle[]"]:checked').each(function () {
        selectedFolders.push($(this).val());
    });

    // if no folder is selected, use the default folder
    if (selectedFolders.length === 0) {
        selectedFolders.push('white', 'black', 'color');
    }

    var allImages = [];
    $.ajax({
        url: 'gallery.php',
        type: 'POST',
        data: { selectedFolder: selectedFolder }, // Pass selected folder name
        dataType: 'json',
        success: function (data) {
            // gather images in one place
            console.log(data)
            for (var i = 0; i < selectedFolders.length; i++) {
                var folder = selectedFolders[i];
                if (data.hasOwnProperty(folder)) {
                    allImages = allImages.concat(data[folder]);
                }
            }

            // Select image randomly
            var randomImages = [];
            while (randomImages.length < numImages && allImages.length > 0) {
                var randomIndex = Math.floor(Math.random() * allImages.length);
                randomImages.push(allImages.splice(randomIndex, 1)[0]);
            }

            // Replace the loading-dummy div with an image
            // Processing after the image is loaded
            $.each(randomImages, function (i, imageUrl) {
                setTimeout(function () {
                    var dummy = galleryImages.find('.loading-dummy').eq(i);

                    // Set background image and adjust transparency
                    dummy.css({
                        backgroundImage: 'url(' + imageUrl + ')',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 1
                    }).addClass('loaded');

                    // Hide 'loading' text (make it transparent)
                    $('#dummy-loading-' + i).css('color', 'transparent');

                }, i * 800);
            });




            
            // click on the gallery image
            galleryImages.on('click', '.loading-dummy.loaded', function () {
                // add a layer with a border applied only to the clicked image
                var borderLayer = $(this).find('.border-layer');
                if (borderLayer.length === 0) {
                    $(this).append('<div class="border-layer" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 8px solid #dc3545; box-sizing: border-box; z-index: 1;"></div>');
                }

                // remove border layers from other images
                galleryImages.find('.loading-dummy.loaded').not(this).each(function () {
                    $(this).find('.border-layer').remove(); // border 레이어 제거
                });

                // extract image URL
                var imageURL = $(this).css('background-image').replace(/url\(["']?/, '').replace(/["']?\)/, '');
                convertImageToBase64(imageURL);

                lastClickedImage = $(this); //move image
            });

            // click on the first image when you start
            setTimeout(function () {
                galleryImages.find('.loading-dummy.loaded:first-child').click();
            }, 500);

            function convertImageToBase64(imageURL) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        // remove the part to be removed using a regular expression and save the result in c_I2IBase64
                        c_I2IBase64 = reader.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
                        genButtonDisableCheck();
                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', imageURL);
                xhr.responseType = 'blob';
                xhr.send();
            }

            // handle mouse entry events for each image
            galleryImages.on('mouseenter', '.loading-dummy.loaded', function () {
                // x2 image
                $(this).css({
                    'transition': 'transform 0.2s ease',
                    'transform': 'scale(1.5)',
                    'z-index': 2,
                });
            }).on('mouseleave', '.loading-dummy.loaded', function () {
                // back x2 image
                $(this).css({
                    'transition': 'transform 0.2s ease',
                    'transform': 'scale(1)',
                    'z-index': 1,
                });
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('AJAX Error:', textStatus, errorThrown);
        }
    });
}


// refresh button click event handling function
function refreshButtonClick() {
    var button = $(this);
    baseImages();
    loadImages();

    // show spinner
    $('#spinner').css('opacity', '0').show().animate({ opacity: 1 }, 300); // 스피너를 투명도 0에서 1로 보이게 함

    button.prop('disabled', true).css('opacity', '0.4').text('Loading');

    setTimeout(function () {
        button.prop('disabled', false).css('opacity', '1').text('Refresh');

        // spinner hide
        $('#spinner').animate({ opacity: 0 }, 300, function() {
        });
    }, 8000); // how long spinner spin
}