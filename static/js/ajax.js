$(document).ready(function () {
    $("#dls-input-form, #dls-interrupted-form, #dls-cut-short-form, #dls-second-innings-delayed-form, #dls-first-innings-cut-short-form").submit(function (e) {
        e.preventDefault(); // Prevent the form from submitting normally
        
        // Get the form type
        var formType = $(this).find('input[name=form_type]').val();
        
        // Serialize the form data
        var formData = $(this).serialize();
        
        // Append the form type to the serialized form data
        formData += '&form_type=' + formType;
        
        // Send the AJAX request
        $.ajax({
            type: "POST",
            url: "/", // URL pattern defined in urls.py
            data: formData,
            success: function (response) {
                // Display the result in the result-container div
                $("#result-container").html("<p>Par Score: " + response.result + "</p>");
                $("#error-container").empty(); // Clear any previous error messages
            },
            error: function (xhr, status, error) {
                if (xhr.status === 400) {
                    var errorData = JSON.parse(xhr.responseJSON.errors);

                    // Loop through the errors and create disposable alerts
                    for (var key in errorData) {
                        if (errorData.hasOwnProperty(key)) {
                            var fieldName = key.replace(/_/g, " "); // Convert underscores to spaces
                            var errorMessage = errorData[key][0].message;

                            // Create the alert element with close button
                            var alertElement = $("<div>").addClass("alert alert-dismissible alert-danger");
                            var closeButton = $("<button>").addClass("close").attr("type", "button").html("&times;");
                            var fieldNameElement = $("<strong>").text(fieldName);
                            var errorMessageElement = $("<span>").text(errorMessage);

                            // Append the elements to the alert
                            alertElement.append(closeButton, errorMessageElement);

                            // Append the alert to the error container
                            $("#error-container").append(alertElement);

                            // Attach event handler to the close button to remove the alert when clicked
                            closeButton.click(function () {
                                $(this).parent().remove();
                            });
                        }
                    }
                } else {
                    console.error(xhr.responseText);
                }
            },
        });
    });
});
