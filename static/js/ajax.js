$(document).ready(function () {
    $("#dls-input-form, #dls-interrupted-form, #dls-cut-short-form, #dls-second-innings-delayed-form, #dls-first-innings-cut-short-form, #dls-first-innings-interrupted-form").submit(function (e) {
        e.preventDefault(); // Prevent the form from submitting normally
        
        var $form = $(this); // Store the form element

        // Get the form type
        var formType = $form.find('input[name=form_type]').val();
        
        // Serialize the form data
        var formData = $form.serialize();
        
        // Append the form type to the serialized form data
        formData += '&form_type=' + formType;

        // Send the AJAX request
        $.ajax({
            type: "POST",
            url: "/", // URL pattern defined in urls.py
            data: formData,
            success: function (response) {  
                // Display the result in the corresponding container based on the form type
                if (formType === "second_innings_delayed") {
                    $("#result-container-1").html('<p class="btn custom-btn">Par Score: ' + response.result + "</p>");
                    $("#error-container-1").empty(); // Clear any previous error messages
                } else if (formType === "second_innings_cut_short") {
                    $("#result-container-2").html('<p class="btn custom-btn">Par Score: ' + response.result + "</p>");
                    $("#error-container-2").empty(); // Clear any previous error messages
                } else if (formType === "second_innings_interrupted") {
                    $("#result-container-3").html('<p class="btn custom-btn">Par Score: ' + response.result + "</p>");
                    $("#error-container-3").empty(); // Clear any previous error messages
                } else if (formType === "first_innings_cut_short") {
                    $("#result-container-4").html('<p class="btn custom-btn">Par Score: ' + response.result + "</p>");
                    $("#error-container-4").empty(); // Clear any previous error messages
                } else if (formType === "first_innings_interrupted") {
                    $("#result-container-5").html('<p class="btn custom-btn">Par Score: ' + response.result + "</p>");
                    $("#error-container-5").empty(); // Clear any previous error messages
                }
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
                            if (formType === "second_innings_delayed") {
                                $("#error-container-1").empty();
                                $("#result-container-1").empty();
                                $("#error-container-1").append(alertElement);
                            } else if (formType === "second_innings_cut_short") {
                                $("#error-container-2").empty();
                                $("#result-container-2").empty();
                                $("#error-container-2").append(alertElement);
                            } else if (formType === "second_innings_interrupted") {
                                $("#error-container-3").empty();
                                $("#result-container-3").empty();
                                $("#error-container-3").append(alertElement);
                            } else if (formType === "first_innings_cut_short") {
                                $("#error-container-4").empty();
                                $("#result-container-4").empty();
                                $("#error-container-4").append(alertElement);
                            } else if (formType === "first_innings_interrupted") {
                                $("#error-container-5").empty();
                                $("#result-container-5").empty();
                                $("#error-container-5").append(alertElement);
                            }

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
